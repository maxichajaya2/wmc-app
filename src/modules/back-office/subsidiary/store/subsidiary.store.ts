import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import {
  ActionsTypes,
  Subsidiary as Entity,
  PayloadSubsidiary as Payload,
} from "@/models";
export interface SubsidiaryState extends HttpRequestState {
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
  openActionModal: (id: string, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;
}

export const storeApi: StateCreator<
  SubsidiaryState,
  [["zustand/devtools", never]]
> = (set, get) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  selected: undefined,
  loading: false,
  isOpenDialog: false,
  action: "none",
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  async findAll() {
    // const enterprise = useSessionBoundStore.getState().session?.enterprise;
    // if (!enterprise) return;
    // handleRequestStore(
    //   get(),
    //   () => ApiService.findAll(enterprise.id),
    //   (data) => {
    //     set({ data, filtered: data }, false, "getSubsidiarySuccess");
    //     get().clearFilters();
    //   },
    //   (error) => console.error(error)
    // );
  },

  async create(_payload) {
    // const enterprise = useSessionBoundStore.getState().session?.enterprise;
    // if (!enterprise) return;
    // handleRequestStore(
    //   get(),
    //   () => ApiService.create(payload, enterprise.id),
    //   (newItem) => {
    //     const data = [newItem, ...get().data];
    //     set(
    //       { data, filtered: data, isOpenDialog: false },
    //       false,
    //       "createSubsidiarySuccess"
    //     );
    //     get().clearFilters();
    //   },
    //   (error) => console.error(error)
    // );
  },

  async update(_payload) {
    // const enterprise = useSessionBoundStore.getState().session?.enterprise;
    // if (!enterprise) return;
    // const selected = get().selected;
    // if (!selected) return;
    // handleRequestStore(
    //   get(),
    //   () => ApiService.update(selected.id, payload, enterprise.id),
    //   (updatedItem) => {
    //     const data = get().data.map((item) =>
    //       item.id === updatedItem.id ? updatedItem : item
    //     );
    //     set(
    //       {
    //         data,
    //         filtered: data,
    //         isOpenDialog: false,
    //         selected: undefined,
    //       },
    //       false,
    //       "updateSubsidiarySsuccess"
    //     );
    //     get().clearFilters();
    //   },
    //   (error) => console.error(error)
    // );
  },

  async remove() {
    // const enterprise = useSessionBoundStore.getState().session?.enterprise;
    // const selected = get().selected;
    // if (!enterprise || !selected) return;
    // handleRequestStore(
    //   get(),
    //   () => ApiService.remove(selected.id, enterprise.id),
    //   () => {
    //     const data = get().data.filter((u) => u.id !== selected.id);
    //     set(
    //       {
    //         data,
    //         filtered: data,
    //         isOpenDialog: false,
    //         selected: undefined,
    //       },
    //       false,
    //       "deleteSubsidiarySuccess"
    //     );
    //     get().clearFilters();
    //   },
    //   (error) => console.error(error)
    // );
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
      item.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered }, false, "updateFilteredSubsidiary");
  },
});

export const useSubsidiaryStore = create<SubsidiaryState>()(
  devtools(withHttpRequest(storeApi), {
    name: "Subsidiary Store",
  })
);
