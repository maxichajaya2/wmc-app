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
  fileVersion1?: string;
  fileVersion2?: string;
  state: StatePaper;
  fullFileUrl?: string;
  fullFileUrlVersion1?: string;
  fullFileUrlVersion2?: string;
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
  // PHASE 1
  p1_m_impact?: number;
  p1_m_quality?: number;
  p1_m_innovation?: number;
  p1_m_rate?: number;
  p1_s1_impact?: number;
  p1_s1_quality?: number;
  p1_s1_innovation?: number;
  p1_s1_rate?: number;
  p1_s2_impact?: number;
  p1_s2_quality?: number;
  p1_s2_innovation?: number;
  p1_s2_rate?: number;
  p1_s3_impact?: number;
  p1_s3_quality?: number;
  p1_s3_innovation?: number;
  p1_s3_rate?: number;
  phase1_general_rate?: number;

  // PHASE 2
  p2_m_impact?: number;
  p2_m_quality?: number;
  p2_m_innovation?: number;
  p2_m_rate?: number;
  p2_s1_impact?: number;
  p2_s1_quality?: number;
  p2_s1_innovation?: number;
  p2_s1_rate?: number;
  p2_s2_impact?: number;
  p2_s2_quality?: number;
  p2_s2_innovation?: number;
  p2_s2_rate?: number;
  p2_s3_impact?: number;
  p2_s3_quality?: number;
  p2_s3_innovation?: number;
  p2_s3_rate?: number;
  phase2_general_rate?: number;
  dismissedDate?: string;
  selectedDismissedDate?: string;
  webUserId?: number;
  webUser: UserWeb;
  reviewerUserId?: number | null;
  reviewerUser?: User | null;
  reviewerSupport1Id?: number | null;
  reviewerSupport1?: User | null;
  reviewerSupport2Id?: number | null;
  reviewerSupport2?: User | null;
  reviewerSupport3Id?: number | null;
  reviewerSupport3?: User | null;
  leaderId?: number | null;
  leader?: User | null;
  topicId: number;
  topic?: Topic;
  category: Category;
  categoryId?: number;
  language?: string;
  keywords?: string[];
  industry?: string;
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
  industry?: string;
  eventDate?: string;
  webUserId: number;
  type?: TypePaper;
}

export interface PayloadChangeStatusPaper {
  state: StatePaper;
  leaderId?: number | null;
  reviewerUserId?: number | null;
  type?: TypePaper;
  reviewerSupport1Id?: number | null;
  reviewerSupport2Id?: number | null;
  reviewerSupport3Id?: number | null;
}

export enum TypePaper {
  // ORAL = "O",
  // POSTER = "P",
  // PRESENTACION_INTERACTIVA = "PI",
  PRESENTACION_ORAL = "PO",
}

export const MapTypePaper: Record<TypePaper, string> = {
  // [TypePaper.ORAL]: "Oral",
  // [TypePaper.POSTER]: "Poster",
  // [TypePaper.PRESENTACION_INTERACTIVA]: "Presentación Interactiva",
  [TypePaper.PRESENTACION_ORAL]: "Oral Presentation",
};

export enum StatePaper {
  REGISTERED = 0,
  RECEIVED = 1,
  SENT = 2,
  ASSIGNED = 3,
  UNDER_REVIEW = 4,
  APPROVED = 5,
  DISMISSED = 6,
  OBSERVED = 7,
  SUBSANATED = 8,
}
export enum ProcessPaper {
  PRESELECCIONADO = "P",
  SELECCIONADO = "S",
}

export const MapStatePaper: Record<StatePaper, string> = {
  // [StatePaper.REGISTERED]: "Registrado",
  // [StatePaper.RECEIVED]: "Recibido",
  // [StatePaper.SENT]: "Enviado",
  // [StatePaper.ASSIGNED]: "Asignado",
  // [StatePaper.UNDER_REVIEW]: "En revisión",
  // [StatePaper.APPROVED]: "Aprobado",
  // [StatePaper.DISMISSED]: "Descartado",
  [StatePaper.REGISTERED]: "REGISTERED",
  [StatePaper.RECEIVED]: "RECEIVED",
  [StatePaper.SENT]: "SENT",
  [StatePaper.ASSIGNED]: "ASSIGNED",
  [StatePaper.UNDER_REVIEW]: "UNDER REVIEW",
  [StatePaper.APPROVED]: "APPROVED",
  [StatePaper.DISMISSED]: "REJECTED",
  [StatePaper.OBSERVED]: "OBSERVED",
  [StatePaper.SUBSANATED]: "SUBSANATED",
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
  [StatePaper.OBSERVED]: "OBSERVED",
  [StatePaper.SUBSANATED]: "SUBSANATED",
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
  blockId?: number;
  // userId: number;
}

export interface Commentary {
  id: number;
  comentary: string;
  fileUrl?: string;
  blockId?: number;
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
  [AuthorType.AUTOR]: "Author",
  [AuthorType.COAUTOR]: "Co-author",
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
