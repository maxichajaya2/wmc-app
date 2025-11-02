import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import { ActionsTypes, MenuWebItem as Entity, PayloadMenuItem } from "@/models";
import { MenuService as ApiService } from "../services/menu.service";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";

type Payload = PayloadMenuItem;

export interface State extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;

  /* Generic Actions */
  findAll: () => Promise<void>;
  create: (payload: Payload) => Promise<void>;
  update: (payload: Payload) => Promise<void>;
  remove: () => Promise<void>;
  setFilterTerm: (term: string) => void;
  clearFilters: () => void;
  setSelected: (item?: Entity) => void;
  setIsOpenDialog: (open: boolean) => void;
  setAction: (action: ActionsTypes) => void;
  openActionModal: (id: number, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;

  /* Particular Actions */
}

export const storeApi: StateCreator<State, [["zustand/devtools", never]]> = (
  set,
  get
) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  selected: undefined,
  loading: false,
  isOpenDialog: false,
  action: "none",
  rolesPermissions: [],
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  async findAll() {
    handleRequestStore(
      get(),
      () => ApiService.findAll(),
      (data) => {
        set(
          { data: orderMenuItems(data), filtered: orderMenuItems(data) },
          false,
          "getRoleSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async create(payload) {
    handleRequestStore(
      get(),
      () => ApiService.create(payload),
      (newItem) => {
        let data = [...get().data];
        if (newItem.parentId) {
          const parent = data.find((item) => item.id === newItem.parentId);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(newItem);
          }
        } else {
          data = [newItem, ...get().data];
        }
        set(
          {
            data: orderMenuItems(data),
            filtered: orderMenuItems(data),
            isOpenDialog: false,
          },
          false,
          "createRoleSuccess"
        );
        get().clearFilters();
        useUsersStore.getState().clearPersonFound();
      },
      (error) => console.error(error)
    );
  },

  async update(payload) {
    const selected = get().selected;
    if (!selected) return;

    handleRequestStore(
      get(),
      () => ApiService.update(selected.id, payload),
      (updatedItem) => {
        let data = [...get().data];

        // Buscar el antiguo padre y eliminar el item de sus hijos
        const oldParent = data.find((item) => item.id === selected.parentId);
        if (oldParent && oldParent.children) {
          oldParent.children = oldParent.children.filter(
            (child) => child.id !== updatedItem.id
          );
        }

        // Si el item tiene un nuevo parentId, agregarlo como hijo del nuevo padre
        if (updatedItem.parentId) {
          const newParent = data.find(
            (item) => item.id === updatedItem.parentId
          );
          if (newParent) {
            if (!newParent.children) newParent.children = [];
            const existingIndex = newParent.children.findIndex(
              (child) => child.id === updatedItem.id
            );

            if (existingIndex !== -1) {
              newParent.children[existingIndex] = updatedItem;
            } else {
              newParent.children.push(updatedItem);
            }
          }
        } else {
          // Si no tiene parentId, lo movemos al nivel raíz
          data = data.map((item) =>
            item.id === updatedItem.id ? {...updatedItem, children: item.children} : item
          );
        }

        set(
          {
            data: orderMenuItems(data),
            filtered: orderMenuItems(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updateRoleSuccess"
        );

        get().clearFilters();
        useUsersStore.getState().clearPersonFound();
      },
      (error) => console.error(error)
    );
  },

  async remove() {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.remove(selected.id),
      () => {
        // const data = get().data.filter((u) => u.id !== selected.id);
        let data = [...get().data];
        if (selected.parentId) {
          const parent = data.find((item) => item.id === selected.parentId);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children = parent.children.filter(
              (item) => item.id !== selected.id
            );
          }
        } else {
          data = data.filter((item) => item.id !== selected.id);
        }
        set(
          {
            data: orderMenuItems(data),
            filtered: orderMenuItems(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deleteRoleSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  setFilterTerm(term) {
    set({ filterTerm: term }, false, "setFilterTerm");
    get().updateFiltered();
  },

  clearFilters() {
    set({ filterTerm: "" }, false, "clearFiltersProducts");
    get().updateFiltered();
  },

  setSelected(selected) {
    set({ selected }, false, "setProductselected");
  },

  setIsOpenDialog(open) {
    set({ isOpenDialog: open }, false, "setIsOpenDialog");
  },

  setAction(action) {
    set({ action }, false, "setAction");
  },

  openActionModal(id, action) {
    if (action === "create" || action === "create-with-parent") {
      get().setAction(action);
      get().setIsOpenDialog(true);
    } else {
      const menuItemsFlated = [...get().data].flatMap((item) =>
        item.children ? [item, ...item.children] : [item]
      );
      const item = menuItemsFlated.find((item) => item.id === id);
      if (!item) return;
      get().setSelected(item);
      get().setAction(action);
      get().setIsOpenDialog(true);
    }
  },

  closeActionModal() {
    get().setSelected(undefined);
    get().setAction("none");
    get().setIsOpenDialog(false);
  },

  updateFiltered() {
    const { data, filterTerm } = get();
    const filtered = data.filter((item) =>
      item.titleEs?.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered }, false, "updateFilteredRole");
  },
});

export const useMenuStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Menu Store",
  })
);

function orderMenuItems(data: Entity[]) {
  data.sort((a, b) => a.sort - b.sort);
  data.forEach((item) => {
    if (item.children) {
      item.children.sort((a, b) => a.sort - b.sort);
    }
  });
  return data;
}
