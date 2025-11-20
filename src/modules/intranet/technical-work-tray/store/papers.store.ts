import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
import {
  ActionsTypes,
  Category,
  Paper as Entity,
  PayloadChangeStatusPaper,
  PayloadPaper,
  StatePaper,
  Topic,
  User,
  Commentary,
} from "@/models";
import { PaperService as ApiService } from "../services/papers.service";
import { useUsersStore } from "@/modules/back-office/users/store/users.store";
import { useAuthIntranetStore } from "../../auth/store";

// DAYJS
import dayjs from "dayjs";
// import utc from 'dayjs-plugin-utc';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import axios from "axios";
import { toast } from "@/components";
// import { formatDate } from '../../../../../utils/format-date';
// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

type Payload = PayloadPaper;

export interface State extends HttpRequestState {
  data: Entity[];
  filtered: Entity[];
  filterTerm: string;
  selected?: Entity;
  loading: boolean;
  isOpenDialog: boolean;
  action: ActionsTypes;
  abstractData: null;

  /* Filter States */
  dateRange: { start: string; end: string };
  selectedTopic: Topic | null;
  selectedReviewer: User | null;
  selectedCategory: Category | null;
  selectedLeader: User | null;
  selectedState: StatePaper | null;
  selectedProcess: string | null;

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

  setLoading: (loading: boolean) => void;
  setAbstractData: (data: any) => void;
  /* Particular Actions */
  changeStatusPaper: (payload: PayloadChangeStatusPaper) => Promise<void>;
  uploadCompleteArchive: (fullFileUrl: string) => Promise<void>;

  /* Particular Filter Actions */
  setDateRange: (range: { start: string; end: string }) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setSelectedReviewer: (reviewer: User | null) => void;
  setSelectedState: (state: StatePaper | null) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedLeader: (category: User | null) => void;
  setSelectedProcess: (process: string | null) => void;

  // Add these to the State interface
  isOpenCommentsDialog: boolean;
  openCommentsDialog: (id: number) => void;
  closeCommentsDialog: () => void;

  // Confirm delete comment
  comments: Commentary[];
  setComments: (comments: Commentary[]) => void;
  deletingCommentId: number | null;
  setDeletingCommentId: (id: number | null) => void;
  isOpenConfirmDeleteComment: boolean;
  openConfirmDeleteComment: (id: number) => void;
  closeConfirmDeleteComment: () => void;

  // Parameters limit dates
  limitDatePhaseOne?: string;
  limitDatePhaseTwo?: string;
  limitDatePhaseThree?: string;
  setLimitDates: () => Promise<void>;
}

export const storeApi: StateCreator<State, [["zustand/devtools", never]]> = (
  set,
  get
) => ({
  data: [],
  filtered: [],
  filterTerm: "",
  dateRange: { start: "", end: "" },
  selectedTopic: null,
  selectedReviewer: null,
  selectedCategory: null,
  selectedLeader: null,
  selectedProcess: null,
  selectedState: null,
  selected: undefined,
  loading: false,
  isOpenDialog: false,
  action: "none",
  error: null,
  abstractData: null,

  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  async findAll() {
    const user = useAuthIntranetStore.getState().user;
    if (!user) return;
    handleRequestStore(
      get(),
      () => ApiService.findAll(user.id),
      (data) => {
        set(
          {
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
          },
          false,
          "getPaperSuccess"
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
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
            isOpenDialog: false,
          },
          false,
          "createPaperSuccess"
        );
        get().clearFilters();
        useUsersStore.getState().clearPersonFound();
      },
      (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            // Mostrar error específico
            toast({
              title: "Error",
              description: "El título que intenta registrar ya existe.",
              duration: 5000,
            });
          } else {
            alert("Ocurrió un error inesperado.");
          }
        }
      }
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
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "updatePaperSsuccess"
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
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "deletePaperSuccess"
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

  setAbstractData: (data) =>
    set({ abstractData: data }, false, "setAbstractData"),
  setDateRange: (range) => set({ dateRange: range }, false, "rangeFilterTerm"),
  setSelectedTopic: (topic) =>
    set({ selectedTopic: topic }, false, "topicFilterTerm"),
  setSelectedReviewer: (reviewer) =>
    set({ selectedReviewer: reviewer }, false, "reviewerFilterTerm"),
  setSelectedCategory: (category) =>
    set({ selectedCategory: category }, false, "categoryFilterTerm"),
  setSelectedProcess: (process) =>
    set({ selectedProcess: process }, false, "processFilterTerm"),
  setSelectedLeader: (leader) =>
    set({ selectedLeader: leader }, false, "leaderFilterTerm"),
  setSelectedState: (state) =>
    set({ selectedState: state }, false, "stateFilterTerm"),

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
    console.log("closeActionModal");
    get().setSelected(undefined);
    get().setAction("none");
    get().setIsOpenDialog(false);
  },

  updateFiltered() {
    const {
      data,
      filterTerm,
      dateRange,
      selectedTopic,
      selectedReviewer,
      selectedState,
      selectedCategory,
      selectedLeader,
      selectedProcess,
    } = get();
    const filtered = data.filter((item) => {
      const matchesTerm =
        item.webUser.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        item.webUser.lastName
          .toLowerCase()
          .includes(filterTerm.toLowerCase()) ||
        item.webUser.documentNumber.includes(filterTerm);

      const matchesDate =
        (!dateRange.start ||
          dayjs(item.createdAt).isSameOrAfter(dayjs(dateRange.start))) &&
        (!dateRange.end ||
          dayjs(item.createdAt).isSameOrBefore(dayjs(dateRange.end)));

      const matchesTopic = !selectedTopic || item.topicId === selectedTopic.id;
      const matchesReviewer =
        !selectedReviewer || item.reviewerUserId === selectedReviewer.id;
      const matchesState = !selectedState || item.state === selectedState;
      const matchesCategory =
        !selectedCategory || item.categoryId === selectedCategory.id;
      const matchesLeader =
        !selectedLeader || item.leaderId === selectedLeader.id;
      const matchesProcess =
        !selectedProcess || item.process === selectedProcess;

      return (
        matchesTerm &&
        matchesDate &&
        matchesTopic &&
        matchesReviewer &&
        matchesState &&
        matchesCategory &&
        matchesLeader &&
        matchesProcess
      );
    });
    set({ filtered }, false, "updateFilteredPaper");
  },

  // Particular Actions
  async changeStatusPaper(payload) {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.changeState(selected.id, payload),
      (updatedItem) => {
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "changeStatusPaperSuccess"
        );
        get().clearFilters();
        get().closeActionModal();
      },
      (error) => console.error(error)
    );
  },

  // Add these to the storeApi object
  isOpenCommentsDialog: false,
  openCommentsDialog: (id) => {
    const item = get().data.find((u) => u.id === id);
    if (!item) return;
    set(
      { isOpenCommentsDialog: true, selected: item },
      false,
      "openCommentsDialog"
    );
  },
  closeCommentsDialog: () => {
    console.log("entra aqui? closeCommentsDialog");
    get().setSelected(undefined);
    set({ isOpenCommentsDialog: false }, false, "closeCommentsDialog");
  },

  setLoading: (loading) => set({ loading }, false, "setLoading"),

  comments: [],
  setComments: (comments: Commentary[]) => {
    set({ comments }, false, "setComments");
  },
  deletingCommentId: null,
  isOpenConfirmDeleteComment: false,
  setDeletingCommentId: (id) => {
    set({ deletingCommentId: id });
  },
  openConfirmDeleteComment: (id) => {
    set({ deletingCommentId: id, isOpenConfirmDeleteComment: true });
  },
  closeConfirmDeleteComment: () => {
    set({ deletingCommentId: null, isOpenConfirmDeleteComment: false });
  },

  setLimitDates: async () => {
    handleRequestStore(
      get(),
      () => ApiService.getParameters(),
      (data) => {
        set(
          {
            limitDatePhaseOne: data.find(
              (param) => param.code === "limitDatePhase1"
            )?.value,
            // limitDatePhaseOne: '2025-03-23',
            limitDatePhaseTwo: data.find(
              (param) => param.code === "limitDatePhase2"
            )?.value,
            limitDatePhaseThree: data.find(
              (param) => param.code === "limitDatePhase3"
            )?.value,
          },
          false,
          "getLimitDatesSuccess"
        );
      },
      (error) => console.error(error)
    );
  },

  uploadCompleteArchive: async (fullFileUrl: string) => {
    const selected = get().selected;
    if (!selected) return;
    handleRequestStore(
      get(),
      () => ApiService.uploadFullFile(selected.id, { fullFileUrl }),
      (updatedItem) => {
        const data = get().data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        set(
          {
            data: sortPapersByCreationDate(data),
            filtered: sortPapersByCreationDate(data),
            isOpenDialog: false,
            selected: undefined,
          },
          false,
          "uploadCompleteArchiveSuccess"
        );
        get().clearFilters();
        get().closeActionModal();
      },
      (error) => console.error(error)
    );
  },
});

export const usePaperStore = create<State>()(
  devtools(withHttpRequest(storeApi), {
    name: "Papers Store",
  })
);

function sortPapersByCreationDate(data: Entity[]): Entity[] {
  // return data.filter((item) => item.state !== StatePaper.REGISTERED);
  return data.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
    return 0;
  });
}
