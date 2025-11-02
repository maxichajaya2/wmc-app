import { create, StateCreator } from "zustand";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import {
  ActionsTypes,
  Brand as Entity,
  PayloadBrand as Payload,
} from "@/models";
import { handleRequestStore } from "@/utils/handle-request-store";
import { BrandsService } from "../services/brands.service";
import { devtools } from "zustand/middleware";

export interface BrandState extends HttpRequestState {
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
  BrandState,
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
      () => BrandsService.findAll(),
      (brands) => {
        set({ data: brands, filtered: brands }, false, "getBrandsSuccess");
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async create(payload) {
    handleRequestStore(
      get(),
      () => BrandsService.create(payload),
      (newBrand) => {
        const brands = [newBrand, ...get().data];
        set(
          { data: brands, filtered: brands, isOpenDialog: false },
          false,
          "createBrandSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async update(payload) {
    const brandSelected = get().selected;
    if (!brandSelected) return;
    handleRequestStore(
      get(),
      () => BrandsService.update(brandSelected.id, payload),
      (updatedBrand) => {
        const brands = get().data.map((brand) =>
          brand.id === updatedBrand.id ? updatedBrand : brand
        );
        set(
          {
            data: brands,
            filtered: brands,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updateBrandSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async remove() {
    const brandSelected = get().selected;
    if (!brandSelected) return;
    handleRequestStore(
      get(),
      () => BrandsService.remove(brandSelected.id),
      () => {
        const brands = get().data.filter((u) => u.id !== brandSelected.id);
        set(
          {
            data: brands,
            filtered: brands,
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deleteBrandSuccess"
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
    set({ filterTerm: "" }, false, "clearFiltersBrands");
    get().updateFiltered();
  },

  setSelected(selected) {
    set({ selected }, false, "setBrandSelected");
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
      const user = get().data.find((u) => u.id === id);
      if (!user) return;
      get().setSelected(user);
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
    const { data: brands, filterTerm } = get();
    const filteredBrands = brands.filter((brand) =>
      brand.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
    set({ filtered: filteredBrands }, false, "updateFilteredBrands");
  },
});

export const useBrandsStore = create<BrandState>()(
  devtools(withHttpRequest(storeApi), {
    name: "Brands Store",
  })
);
