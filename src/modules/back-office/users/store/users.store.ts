import {
  ActionsTypes,
  CommonPeople, PayloadUser,
  User as Entity
} from "@/models";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { UsersService as ApiService } from "../services/users.service";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import { useRoleStore } from "@/modules/back-office/roles/store/roles.store";

type Payload = PayloadUser;

export interface UsersState extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  personFound?: CommonPeople;
  selectedRoles: string[];
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
  setSelectedRoles: (roles: string[]) => void;
  setSelected: (item?: Entity) => void;
  setIsOpenDialog: (open: boolean) => void;
  setAction: (action: ActionsTypes) => void;
  openActionModal: (id: number, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;
  /* Particular Actions */
  clearPersonFound: () => void;
}

export const storeApi: StateCreator<
  UsersState,
  [["zustand/devtools", never]]
> = (set, get) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  personFound: undefined,
  selectedRoles: [],
  selected: undefined,
  loading: false,
  isOpenDialog: false,
  payload: undefined,
  action: "none",
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  findAll: async () => {
    await useRoleStore.getState().findAll();
    await handleRequestStore(
      get(),
      () => ApiService.findAll(),
      (users) => {
        set({ data: users, filtered: users }, false, "getUsersSuccess");
        get().clearFilters();
      },
      (error: any) => console.log("Error getting users", error)
    );
  },
  create: async (payload) => {
    handleRequestStore(
      get(),
      () => ApiService.create(payload),
      (newUser) => {
        const users = [newUser, ...get().data];
        set(
          {
            data: users,
            filtered: users,
            isOpenDialog: false,
            personFound: undefined,
          },
          false,
          "createUserSuccess"
        );
        get().clearFilters();
      },
      (error: any) => console.log("Error creating user", error)
    );
  },
  update: async (payload) => {
    const userSelected = get().selected;
    if (!userSelected) return;
    handleRequestStore(
      get(),
      () => ApiService.update(userSelected.id, payload),
      (updatedUser) => {
        const users = get().data.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );
        set(
          {
            data: users,
            filtered: users,
            isOpenDialog: false,
            selected: undefined,
            personFound: undefined,
          },
          false,
          "updateUserSuccess"
        );
        get().clearFilters();
      },
      (error: any) => console.log("Error updating user", error)
    );
  },
  remove: async () => {
    const userSelected = get().selected;
    if (!userSelected) return;
    handleRequestStore(
      get(),
      () => ApiService.remove(userSelected.id),
      () => {
        const users = get().data.filter((u) => u.id !== userSelected.id);
        set(
          {
            data: users,
            filtered: users,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deleteUserSuccess"
        );
        get().clearFilters();
      },
      (error: any) => console.log("Error deleting user", error)
    );
  },
  clearPersonFound: () => {
    set({ personFound: undefined }, false, "clearPersonFound");
  },
  setFilterTerm: (term) => {
    set({ filterTerm: term }, false, "setFilterTerm");
    get().updateFiltered();
  },
  setSelectedRoles: (roles) => {
    set({ selectedRoles: roles }, false, "setSelectedRoles");
    get().updateFiltered();
  },
  clearFilters: () => {
    set({ filterTerm: "", selectedRoles: [] }, false, "clearFiltersUsers");
    get().updateFiltered();
  },
  setSelected: (selected) => {
    set({ selected }, false, "setUserSelected");
  },
  setIsOpenDialog: (open) => {
    set({ isOpenDialog: open }, false, "setIsOpenDialog");
  },
  setAction: (action) => {
    set({ action }, false, "setAction");
  },
  openActionModal: (id, action) => {
    if (action === "create") {
      get().setAction(action);
      get().setIsOpenDialog(true);
    } else {
      const user = get().data.find((u) => u.id === id);
      if (!user) return;
      get().setSelected(user);
      get().setAction(action);
      get().setIsOpenDialog(true);
    }
  },
  closeActionModal: () => {
    get().setIsOpenDialog(false);
    get().setSelected(undefined);
    get().setAction("none");
  },
  updateFiltered: () => {
    // const { data: users, filterTerm, selectedRoles } = get();

    // const filteredUsers = users.filter((user: Entity) => {
      // const roleNameString = user.role.id;

      // Filtrado por roles
      // const roleMatch =
      //   selectedRoles.length === 0 || selectedRoles.includes(roleNameString);

      // Filtrado por término de búsqueda
      // const termMatch =
      //   filterTerm === "" ||
      //   [
      //     user.name,
      //     user.email,
      //     user.role.name,
      //     roleNameString,
      //   ].some((field) =>
      //     field.toLowerCase().includes(filterTerm.toLowerCase())
      //   );

      // return termMatch && roleMatch;
    // });

    // set({ filtered: filteredUsers }, false, "updateFilteredUsers");
  },
});

export const useUsersStore = create<UsersState>()(
  devtools(withHttpRequest(storeApi), {
    name: "Users Store",
  })
);
