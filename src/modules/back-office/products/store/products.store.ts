import { create, StateCreator } from "zustand";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import {
  ActionsTypes,
  Product as Entity,
  PayloadProduct as Payload,
} from "@/models";
import { handleRequestStore } from "@/utils/handle-request-store";
import { ProductsService } from "../services/products.service";
import { devtools } from "zustand/middleware";

export interface ProductsState extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;

  /* Actions */
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
  ProductsState,
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
    handleRequestStore(
      get(),
      () => ProductsService.findAll(),
      (products) => {
        set(
          { data: products, filtered: products },
          false,
          "getProductsSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async create(payload) {
    handleRequestStore(
      get(),
      () => ProductsService.create(payload),
      (newProduct) => {
        const products = [newProduct, ...get().data];
        set(
          { data: products, filtered: products, isOpenDialog: false },
          false,
          "createProductsSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async update(payload) {
    const productselected = get().selected;
    if (!productselected) return;
    handleRequestStore(
      get(),
      () => ProductsService.update(productselected.id, payload),
      (updatedItem) => {
        const products = get().data.map((brand) =>
          brand.id === updatedItem.id ? updatedItem : brand
        );
        set(
          {
            data: products,
            filtered: products,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updateProductSsuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async remove() {
    const productselected = get().selected;
    if (!productselected) return;
    handleRequestStore(
      get(),
      () => ProductsService.rmeove(productselected.id),
      () => {
        const products = get().data.filter((u) => u.id !== productselected.id);
        set(
          {
            data: products,
            filtered: products,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deleteProductsSuccess"
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
      const product = get().data.find((u) => u.id === id);
      if (!product) return;
      get().setSelected(product);
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
    const { data: products, filterTerm } = get();
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filterTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(filterTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered: filteredProducts }, false, "updateFilteredProducts");
  },
});

export const useProductsStore = create<ProductsState>()(
  devtools(withHttpRequest(storeApi), {
    name: "Products Store",
  })
);
