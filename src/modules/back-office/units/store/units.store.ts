import { create, StateCreator } from "zustand";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { ActionsTypes, Unit as Entity } from "@/models";
import { handleRequestStore } from "@/utils/handle-request-store";
import { UnitsService as ApiService } from "../services/units.service";
import { devtools } from "zustand/middleware";

export interface UnitState extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  filterOptions: {
    isActive?: boolean;
    existSunat?: boolean;
  };
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;

  /* Actions */
  findAll: () => Promise<void>;
  // createUnit: (payload: Omit<PayloadBrand, "enterpriseId">) => Promise<void>;
  // updateUnit: (payload: Omit<PayloadBrand, "enterpriseId">) => Promise<void>;
  // deleteUnit: () => Promise<void>;
  setFilterTerm: (term: string) => void;
  setFilterOptions: (options: {
    isActive?: boolean;
    existSunat?: boolean;
  }) => void;
  clearFilters: () => void;
  setSelected: (item?: Entity) => void;
  setIsOpenDialog: (open: boolean) => void;
  setAction: (action: ActionsTypes) => void;
  openActionModal: (id: string, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;
}

export const storeApi: StateCreator<
  UnitState,
  [["zustand/devtools", never]]
> = (set, get) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  filterOptions: {
    isActive: true,
    existSunat: false,
  },
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
      (units) => {
        set({ data: units, filtered: units }, false, "getUnitsSuccess");
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  // async createUnit(payload) {
  //   const enterprise = useSessionBoundStore.getState().session?.enterprise;
  //   if (!enterprise) return;
  //   handleRequestStore(
  //     get(),
  //     () =>
  //       UnitsService.createBrand({ ...payload, enterpriseId: enterprise.id }),
  //     (newBrand) => {
  //       const brands = [newBrand, ...get().units];
  //       set(
  //         { units: brands, filteredUnits: brands, isOpenDialog: false },
  //         false,
  //         "createBrandSuccess"
  //       );
  //       get().clearFiltersUnits();
  //     },
  //     (error) => console.error(error)
  //   );
  // },

  // async updateUnit(payload) {
  //   const enterprise = useSessionBoundStore.getState().session?.enterprise;
  //   const brandSelected = get().unitSelected;
  //   if (!enterprise || !brandSelected) return;
  //   handleRequestStore(
  //     get(),
  //     () =>
  //       UnitsService.updateBrand(brandSelected.id, {
  //         ...payload,
  //         enterpriseId: enterprise.id,
  //       }),
  //     (updatedBrand) => {
  //       const brands = get().units.map((brand) =>
  //         brand.id === updatedBrand.id ? updatedBrand : brand
  //       );
  //       set(
  //         {
  //           units: brands,
  //           filteredUnits: brands,
  //           isOpenDialog: false,
  //           unitSelected: undefined,
  //         },
  //         false,
  //         "updateBrandSuccess"
  //       );
  //       get().clearFiltersUnits();
  //     },
  //     (error) => console.error(error)
  //   );
  // },

  // async deleteUnit() {
  //   const enterprise = useSessionBoundStore.getState().session?.enterprise;
  //   const brandSelected = get().unitSelected;
  //   if (!enterprise || !brandSelected) return;
  //   handleRequestStore(
  //     get(),
  //     () => UnitsService.deleteBrand(brandSelected.id),
  //     () => {
  //       const brands = get().units.filter((u) => u.id !== brandSelected.id);
  //       set(
  //         {
  //           units: brands,
  //           filteredUnits: brands,
  //           isOpenDialog: false,
  //           unitSelected: undefined,
  //         },
  //         false,
  //         "deleteBrandSuccess"
  //       );
  //       get().clearFiltersUnits();
  //     },
  //     (error) => console.error(error)
  //   );
  // },

  setFilterTerm(term) {
    set({ filterTerm: term }, false, "setFilterTerm");
    get().updateFiltered();
  },

  setFilterOptions(options) {
    set({ filterOptions: options }, false, "setFilterOptions");
    get().updateFiltered();
  },

  clearFilters() {
    set(
      {
        filterTerm: "",
        filterOptions: {
          isActive: true,
          existSunat: false,
        },
      },
      false,
      "clearFiltersUnits"
    );
    get().updateFiltered();
  },

  setSelected(selected) {
    set({ selected }, false, "setUnitSelected");
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
    const { data: units, filterTerm, filterOptions } = get();
    const { isActive, existSunat } = filterOptions;
    const filteredUnits = units.filter((unit) => {
      const termMatch =
        filterTerm === "" ||
        [unit.name, unit.code].some((field) =>
          field.toLowerCase().includes(filterTerm.toLowerCase())
        );
      return (
        termMatch &&
        (unit.isActive === isActive || isActive === null) &&
        (unit.existsInSunat === existSunat || existSunat === null)
      );
    });
    set({ filtered: filteredUnits }, false, "updateFilteredUnits");
  },
});

export const useUnitsStore = create<UnitState>()(
  devtools(withHttpRequest(storeApi), {
    name: "Units Store",
  })
);
