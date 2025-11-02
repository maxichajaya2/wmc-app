import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import {
  ActionsTypes,
  Role as Entity,
  PayloadRole,
  PayloadPermission,
  RolesPermissions,
} from "@/models";
import { RoleService as ApiService } from "../services/roles.service";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";
import { ROLES_TREE } from "@/constants/roles-tree";

type Payload = PayloadRole;

export interface State extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;
  rolesPermissions: RolesPermissions[];

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
  addPermission: (payload: PayloadPermission) => Promise<void>;
  deletePermission: (permissionId: number) => Promise<void>;
  updateRolePermissions: () => void;
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
        set({ data, filtered: data }, false, "getRoleSuccess");
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
        const data = [newItem, ...get().data];
        set(
          { data, filtered: data, isOpenDialog: false },
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
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data,
            filtered: data,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updateRoleSsuccess"
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
        const data = get().data.filter((u) => u.id !== selected.id);
        set(
          {
            data,
            filtered: data,
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
    if (action === "create") {
      get().setAction(action);
      get().setIsOpenDialog(true);
    } else {
      const item = get().data.find((u) => u.id === id);
      if (!item) return;
      get().setSelected(item);
      get().setAction(action);
      get().setIsOpenDialog(true);
      get().updateRolePermissions();
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
      item.name?.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered }, false, "updateFilteredRole");
  },

  async addPermission(payload) {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.addPermission(selected.id, payload),
      (role) => {
        const data = get().data.map((item) =>
          item.id === selected.id
            ? role
            : item
        );
        set(
          { data, filtered: data, selected: role },
          false,
          "addPermissionSuccess"
        );
        get().updateRolePermissions();
      },
      (error) => console.error(error)
    );
  },

  async deletePermission(permissionId) {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.deletePermission(selected.id, permissionId),
      () => {
        const data = get().data.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                permissions: item.permissions.filter(
                  (p) => p.id !== permissionId
                ),
              }
            : item
        );
        const current = {
          ...selected,
          permissions: selected.permissions.filter(
            (p) => p.id !== permissionId
          ),
        };
        set(
          { data, filtered: data, selected: current },
          false,
          "deletePermissionSuccess"
        );
        get().updateRolePermissions();
      },
      (error) => console.error(error)
    );
  },

  updateRolePermissions() {
    const selected = get().selected;
    if (!selected) return;
    const rolesPermissions = ROLES_TREE.map((group) => {
      const modules = group.modules.map((module) => {
        const isPermissionActive = selected?.permissions.some(
          (perm) =>
            perm.module === module.module && perm.action === module.action
        );
        const idPermission = selected?.permissions.find(
          (perm) =>
            perm.module === module.module && perm.action === module.action
        )?.id;
        return {
          module: module.module,
          action: module.action,
          enabled: isPermissionActive,
          id: idPermission,
        };
      });
      return {
        name: group.name,
        modules,
      };
    });

    set({ rolesPermissions }, false, "updateRolePermissions");
  },
});

export const useRoleStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Roles Store",
  })
);
