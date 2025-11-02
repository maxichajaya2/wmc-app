import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import { ActionsTypes, Sale as Entity, PayloadSale as Payload } from "@/models";
import { SaleService as ApiService } from "../services/sales.service";
import { toast } from "@/components";

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
  openActionModal: (id: string, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;
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
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  async findAll() {
    handleRequestStore(
      get(),
      () => ApiService.findAll(),
      (data) => {
        set({ data, filtered: data }, false, "getSaleSuccess");
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
          "createSaleSuccess"
        );
        get().clearFilters();
        toast({
          title: "Venta registrada",
          description: `Venta registrada con éxito`,
        });
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
          "updateSaleSsuccess"
        );
        get().clearFilters();
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
          "deleteSaleSuccess"
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
    }
  },

  closeActionModal() {
    get().setSelected(undefined);
    get().setAction("none");
    get().setIsOpenDialog(false);
  },

  updateFiltered() {
    const { data, filterTerm } = get();
    const filtered = data.filter(
      (item) =>
        // TODO: mejorar esto
        item.data.items.find((i) =>
          i.productId?.toLowerCase().includes(filterTerm.toLowerCase())
        ) ||
        item.data.customerId?.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered }, false, "updateFilteredSale");
  },
});

export const useSalesStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Sales Store",
  })
);
