import { ERROR_CODES } from "@/constants";
import { DocumentType } from "./person";

export type ActionsTypes =
  | "edit"
  | "create"
  | "delete"
  | "view"
  | "list"
  | "accept"
  | "none"
  | "changeStatus"
  | "view-permissions"
  | "create-with-parent"
  | "change-status-paper"
  | "view-reviewers"
  | "delete-reviewer"
  | "receive-paper"
  | "send-paper"
  | "review-paper"
  | "rate-paper"
  | "assign-paper"
  | "approve-paper"
  | "dismiss-paper"
  | 'assign-stand'
  | "observe-paper"
  | "subsanate-paper"
  | "charge-complete-archive"
  | "reassign-paper";
export class ErrorType extends Error {
  code: ERROR_CODES;
  constructor(code: ERROR_CODES, message: string) {
    super(message);
    this.code = code;
  }
}

export interface CommonPeople {
  givenNames: string;
  lastName: string;
  fullName: string;
  address: string;
  departmentName: string;
  provinceName: string;
  districtName: string;
  documentType: DocumentType;
  documentNumber: string;
}
