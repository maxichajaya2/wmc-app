import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { type HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import type { ActionsTypes } from "@/models";
import type {
  Enrollment as Entity,
  PayloadChangePaymentStatus,
  PayloadChangeRegistrationStatus,
  SieResponse,
} from "@/models/";
import { EnrollmentService as ApiService } from "../services/enrollments.service";

export interface State extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  isOpenPaymentStatusDialog: boolean;
  isOpenSieDialog: boolean;
  action: ActionsTypes;
  sieResponse?: SieResponse;

  /* Filter States */
  dateRange: { start: string; end: string };
  selectedPaymentStatus: number | null;
  selectedRegistrationStatus: number | null;

  /* Generic Actions */
  findAll: () => Promise<void>;
  create: (payload: Partial<Entity>) => Promise<void>;
  update: (payload: Partial<Entity>) => Promise<void>;
  remove: () => Promise<void>;
  setFilterTerm: (term: string) => void;
  clearFilters: () => void;
  setSelected: (item?: Entity) => void;
  setIsOpenDialog: (open: boolean) => void;
  setIsOpenPaymentStatusDialog: (open: boolean) => void;
  setIsOpenSieDialog: (open: boolean) => void;
  setAction: (action: ActionsTypes) => void;
  openActionModal: (id: number, action: ActionsTypes) => void;
  closeActionModal: () => void;
  updateFiltered: () => void;

  /* Particular Actions */
  changePaymentStatus: (payload: PayloadChangePaymentStatus) => Promise<void>;
  changeRegistrationStatus: (
    payload: PayloadChangeRegistrationStatus
  ) => Promise<void>;
  sendToSie: () => Promise<void>;

  /* Particular Filter Actions */
  setDateRange: (range: { start: string; end: string }) => void;
  setSelectedPaymentStatus: (status: number | null) => void;
  setSelectedRegistrationStatus: (status: number | null) => void;

  /* Dialog Actions */
  openPaymentStatusDialog: (id: number) => void;
  closePaymentStatusDialog: () => void;
  openSieDialog: (id: number) => void;
  closeSieDialog: () => void;
}

export const storeApi: StateCreator<State, [["zustand/devtools", never]]> = (
  set,
  get
) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  dateRange: { start: "", end: "" },
  selectedPaymentStatus: null,
  selectedRegistrationStatus: null,
  selected: undefined,
  loading: false,
  isOpenDialog: false,
  isOpenPaymentStatusDialog: false,
  isOpenSieDialog: false,
  action: "none",
  error: null,
  sieResponse: undefined,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },

  async findAll() {
    handleRequestStore(
      get(),
      () => ApiService.findAll(),
      (data) => {
        set(
          {
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
          },
          false,
          "getEnrollmentsSuccess"
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
        const data = [newItem, ...get().data];
        set(
          {
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
            isOpenDialog: false,
          },
          false,
          "createEnrollmentSuccess"
        );
        get().clearFilters();
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
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updateEnrollmentSuccess"
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
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deleteEnrollmentSuccess"
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

  setDateRange: (range) => {
    set({ dateRange: range }, false, "setDateRange");
    get().updateFiltered();
  },

  setSelectedPaymentStatus: (status) => {
    set({ selectedPaymentStatus: status }, false, "setSelectedPaymentStatus");
    get().updateFiltered();
  },

  setSelectedRegistrationStatus: (status) => {
    set(
      { selectedRegistrationStatus: status },
      false,
      "setSelectedRegistrationStatus"
    );
    get().updateFiltered();
  },

  clearFilters() {
    set(
      {
        filterTerm: "",
        dateRange: { start: "", end: "" },
        selectedPaymentStatus: null,
        selectedRegistrationStatus: null,
      },
      false,
      "clearFilters"
    );
    get().updateFiltered();
  },

  setSelected(selected) {
    set({ selected }, false, "setSelected");
  },

  setIsOpenDialog(open) {
    set({ isOpenDialog: open }, false, "setIsOpenDialog");
  },

  setIsOpenPaymentStatusDialog(open) {
    set(
      { isOpenPaymentStatusDialog: open },
      false,
      "setIsOpenPaymentStatusDialog"
    );
  },

  setIsOpenSieDialog(open) {
    set({ isOpenSieDialog: open }, false, "setIsOpenSieDialog");
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
    const {
      data,
      filterTerm,
      dateRange,
      selectedPaymentStatus,
      selectedRegistrationStatus,
    } = get();

    const filtered = data.filter((item) => {
      const matchesTerm =
        item.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        item.paternalName.toLowerCase().includes(filterTerm.toLowerCase()) ||
        item.maternalName.toLowerCase().includes(filterTerm.toLowerCase()) ||
        item.documentNumber.includes(filterTerm) ||
        (item.user &&
          (item.user.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
            item.user.lastName
              .toLowerCase()
              .includes(filterTerm.toLowerCase()) ||
            item.user.documentNumber.includes(filterTerm)));

      const matchesDate =
        (!dateRange.start ||
          new Date(item.createdAt) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(item.createdAt) <= new Date(dateRange.end));

      const matchesPaymentStatus =
        selectedPaymentStatus === null ||
        item.paymentStatus === selectedPaymentStatus;

      const matchesRegistrationStatus =
        selectedRegistrationStatus === null ||
        item.registrationStatus === selectedRegistrationStatus;

      return (
        matchesTerm &&
        matchesDate &&
        matchesPaymentStatus &&
        matchesRegistrationStatus
      );
    });

    set({ filtered }, false, "updateFilteredEnrollments");
  },

  // Particular Actions
  async changePaymentStatus(payload) {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.changePaymentStatus(selected.id, payload),
      (updatedItem) => {
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data,
            filtered: data,
            isOpenPaymentStatusDialog: false,
            selected: undefined,
          },
          false,
          "changePaymentStatusSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async changeRegistrationStatus(payload) {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.changeRegistrationStatus(selected.id, payload),
      (updatedItem) => {
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
            selected: undefined,
          },
          false,
          "changeRegistrationStatusSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  async sendToSie() {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.sendToSie(selected.id),
      (updatedItem) => {
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data: sortEnrollmentsByDate(data),
            filtered: sortEnrollmentsByDate(data),
            selected: undefined,
          },
          false,
          "changeRegistrationStatusSuccess"
        );
        get().clearFilters();
      },
      (error) => console.error(error)
    );
  },

  // Dialog Actions
  openPaymentStatusDialog(id) {
    const item = get().data.find((u) => u.id === id);
    if (!item) return;
    get().setSelected(item);
    set({ isOpenPaymentStatusDialog: true }, false, "openPaymentStatusDialog");
  },

  closePaymentStatusDialog() {
    get().setSelected(undefined);
    set(
      { isOpenPaymentStatusDialog: false },
      false,
      "closePaymentStatusDialog"
    );
  },

  openSieDialog(id) {
    const item = get().data.find((u) => u.id === id);
    if (!item) return;
    get().setSelected(item);
    set(
      {
        isOpenSieDialog: true,
        sieResponse: undefined,
      },
      false,
      "openSieDialog"
    );
  },

  closeSieDialog() {
    get().setSelected(undefined);
    set(
      {
        isOpenSieDialog: false,
        sieResponse: undefined,
      },
      false,
      "closeSieDialog"
    );
  },
});

export const useEnrollmentStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Enrollments Store",
  })
);

function sortEnrollmentsByDate(data: Entity[]) {
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
