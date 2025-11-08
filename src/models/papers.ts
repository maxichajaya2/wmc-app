import { Category } from "./category";
import { Country } from "./speaker";
import { Topic } from "./topic";
import { User, UserWeb } from "./user";

export interface Paper {
  id: number;
  title: string;
  correlative: string;
  resume: string;
  file?: string;
  state: StatePaper;
  fullFileUrl?: string;
  receivedDate?: string;
  selectedReceivedDate?: string;
  sentDate?: string;
  selectedSentDate?: string;
  assignedDate?: string;
  selectedAssignedDate?: string;
  reviewedDate?: string;
  selectedReviewedDate?: string;
  approvedDate?: string;
  selectedApprovedDate?: string;
  author: Author;
  phase1Score1?: number;
  phase1Score2?: number;
  phase1Score3?: number;
  phase1Score?: number;
  phase2Score1?: number;
  phase2Score2?: number;
  phase2Score3?: number;
  phase2Score?: number;
  dismissedDate?: string;
  selectedDismissedDate?: string;
  webUserId?: number;
  webUser: UserWeb;
  reviewerUserId?: number;
  reviewerUser?: User;
  leaderId?: number;
  leader?: User;
  topicId: number;
  topic?: Topic;
  category: Category;
  categoryId?: number;
  language?: string;
  keywords?: string[];
  flagEvent?: boolean;
  eventWhere?: string;
  eventWhich?: string;
  eventDate?: string;
  process: ProcessPaper;
  comentaries?: Commentary[];
  type?: TypePaper;
  authors?: Author[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PayloadPaper {
  title: string;
  resume: string;
  file?: string;
  categoryId: number;
  topicId: number;
  language?: string;
  keywords?: string[];
  flagEvent?: boolean;
  eventWhere?: string;
  eventWhich?: string;
  eventDate?: string;
  webUserId: number;
  type?: TypePaper;
}

export interface PayloadChangeStatusPaper {
  state: StatePaper;
  leaderId?: number;
  reviewerUserId?: number;
  type?: TypePaper;
}

export enum TypePaper {
  ORAL = "O",
  POSTER = "P",
  PRESENTACION_INTERACTIVA = "PI",
}

export const MapTypePaper: Record<TypePaper, string> = {
  [TypePaper.ORAL]: "Oral",
  [TypePaper.POSTER]: "Poster",
  [TypePaper.PRESENTACION_INTERACTIVA]: "Presentación Interactiva",
};

export enum StatePaper {
  REGISTERED = 0,
  RECEIVED = 1,
  SENT = 2,
  ASSIGNED = 3,
  UNDER_REVIEW = 4,
  APPROVED = 5,
  DISMISSED = 6,
}
export enum ProcessPaper {
  PRESELECCIONADO = "P",
  SELECCIONADO = "S",
}

export const MapStatePaper: Record<StatePaper, string> = {
  [StatePaper.REGISTERED]: "Registrado",
  [StatePaper.RECEIVED]: "Recibido",
  [StatePaper.SENT]: "Enviado",
  [StatePaper.ASSIGNED]: "Asignado",
  [StatePaper.UNDER_REVIEW]: "En revisión",
  [StatePaper.APPROVED]: "Aprobado",
  [StatePaper.DISMISSED]: "Descartado",
};

export const MapStatePaperForUser: Record<StatePaper, string> = {
  // [StatePaper.REGISTERED]: "Registrado",
  // [StatePaper.RECEIVED]: "Enviado",
  // [StatePaper.SENT]: "Enviado a Lider",
  // [StatePaper.ASSIGNED]: "Asignado",
  // [StatePaper.UNDER_REVIEW]: "En revisión",
  // [StatePaper.APPROVED]: "Aprobado",
  // [StatePaper.DISMISSED]: "Descartado",
  [StatePaper.REGISTERED]: "PENDING",
  [StatePaper.RECEIVED]: "SUBMITTED",
  [StatePaper.SENT]: "SENT TO LEADER",
  [StatePaper.ASSIGNED]: "ASSIGNED",
  [StatePaper.UNDER_REVIEW]: "UNDER REVIEW",
  [StatePaper.APPROVED]: "APPROVED",
  [StatePaper.DISMISSED]: "DISMISSED",
};

export const MapProcessPaper: Record<ProcessPaper, string> = {
  // [ProcessPaper.PRESELECCIONADO]: "FASE 1",
  // [ProcessPaper.SELECCIONADO]: "FASE 2",
  [ProcessPaper.PRESELECCIONADO]: "PHASE 1",
  [ProcessPaper.SELECCIONADO]: "PHASE 2",
};

export interface PayloadCreateComment {
  comentary: string;
  fileUrl?: string;
  // userId: number;
}

export interface Commentary {
  id: number;
  comentary: string;
  fileUrl?: string;
  userId?: number;
  user?: User;
  paperId: number;
  paper: Paper;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Author {
  id: number;
  type: AuthorType;
  name: string;
  middle: string;
  last: string;
  remissive: string;
  institution: string;
  countryCode: string;
  email: string;
  emailCorp: string;
  cellphone: string;
  paperId: number;
  country: Country;
}

export enum AuthorType {
  AUTOR = "A",
  COAUTOR = "C",
}

export const MapAuthorType: Record<AuthorType, string> = {
  [AuthorType.AUTOR]: "Autor",
  [AuthorType.COAUTOR]: "Coautor",
};

export interface Parameter {
  id: number;
  code: string;
  value: string;
  groupCode: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}
