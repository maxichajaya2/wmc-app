import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import { ActionsTypes, Abstract as Entity, PayloadAbstract, UserWeb } from "@/models";
import { Abstractservice as ApiService } from "../services/abstract.service";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";

type Payload = PayloadAbstract;

export interface State extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  selectedReviewer?: UserWeb;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;

  /* Particular States */
  usersWebFromAbstract: UserWeb[];
  isOpenDialogUsers: boolean;

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
  findUsers: () => Promise<void>;
  // assignUser: (userId: number) => Promise<void>;
  // unassignUser: (userId: number) => Promise<void>;
  setIsOpenDialogUsers: (open: boolean) => void;
  setSelectedReviewer: (item?: UserWeb) => void;
  openActionModalUsers: (idAbstract: number, action: ActionsTypes) => void;
  closeActionModalUsers: () => void;
}

export const storeApi: StateCreator<State, [["zustand/devtools", never]]> = (
  set,
  get
) => ({
  data: [],
  usersWebFromAbstract: [],
  filtered: [],
  filterTerm: "",
  selected: undefined,
  selectedReviewer: undefined,
  loading: false,
  isOpenDialog: false,
  isOpenDialogUsers: false,
  action: "none",
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  async findAll() {
    handleRequestStore(
      get(),
      () => ApiService.findAll(),
      (data) => {
        set({ data, filtered: data }, false, "getAbstractSuccess");
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async findUsers() {
    console.log('find users')
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.findUsers(selected.id),
      (data) => {
        set({ usersWebFromAbstract: data }, false, "getUsersFromAbstractSuccess");
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
          "createAbstractSuccess"
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
          "updateAbstractSsuccess"
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
          "deleteAbstractSuccess"
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

  setSelectedReviewer(selected) {
    set({ selectedReviewer: selected }, false, "setSelectedReviewer");
  },

  setIsOpenDialog(open) {
    set({ isOpenDialog: open }, false, "setIsOpenDialog");
  },

  setIsOpenDialogUsers(open) {
    set({ isOpenDialogUsers: open }, false, "setIsOpenDialogUsers");
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
    }
  },

  openActionModalUsers(id, action) {
    const item = get().data.find((u) => u.id === id);
    if (!item) return;
    get().setSelected(item);
    get().setAction(action);
    get().setIsOpenDialogUsers(true);
  },

  closeActionModal() {
    get().setSelected(undefined);
    get().setAction("none");
    get().setIsOpenDialog(false);
  },

  closeActionModalUsers(){
    get().setSelectedReviewer(undefined);
    get().setAction("none");
    get().setIsOpenDialogUsers(false);
  },

  // updateFiltered() {
  //   const { data, filterTerm } = get();
  //   const filtered = data.filter((item) =>
  //     item.name?.toLowerCase().includes(filterTerm.toLowerCase())
  //   );
  //   set({ filtered }, false, "updateFilteredAbstract");
  // },
  updateFiltered() {
    const { data, filterTerm } = get();
    const term = filterTerm.toLowerCase();

    const filtered = data.filter((item) => {
      // Ajusta esto según los campos reales de tu modelo Abstract (ej. title, code, keywords)
      const titleMatch = item.title?.toLowerCase().includes(term);
      const codeMatch = item.codigo?.toLowerCase().includes(term);
      const email = item.email?.toLowerCase().includes(term);
      const lastname = item.lastname?.toLowerCase().includes(term);
      
      // Retorna true si coincide con alguno
      return titleMatch || codeMatch || email || lastname;
    });

    set({ filtered }, false, "updateFilteredAbstract");
  },

  // async assignUser(userId) {
  //   const selected = get().selected;
  //   if (!selected) return;
  //   handleRequestStore(
  //     get(),
  //     () => ApiService.assignUser(selected.id, userId),
  //     ({ users }) => {
  //       set(
  //         {
  //           usersWebFromAbstract: users,
  //           isOpenDialog: false,
  //         },
  //         false,
  //         "assignUserSuccess"
  //       );
  //     },
  //     (error) => console.error(error)
  //   );
  // },

  // async unassignUser(userId) {
  //   const selected = get().selected;
  //   if (!selected) return;
  //   handleRequestStore(
  //     get(),
  //     () => ApiService.unassignUser(selected.id, userId),
  //     () => {
  //       const users = get().usersWebFromAbstract;
  //       const usersWebFromAbstract = users.filter((u) => u.id !== userId);
  //       set(
  //         {
  //           usersWebFromAbstract,
  //           isOpenDialog: false,
  //         },
  //         false,
  //         "unassignUserSuccess"
  //       );
  //     },
  //     (error) => console.error(error)
  //   );
  // },
});

export const useAbstractStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Abstracts Store",
  })
);
