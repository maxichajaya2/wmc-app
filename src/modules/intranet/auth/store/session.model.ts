export interface PayloadLogin {
    documentType: DocumentType;
    documentNumber: number;
    password: string;
}

export enum DocumentType {
  DNI = "1",
  CE = "4",
  NO_DOMICILIADO = "0",
  PASSPORT = "7",
  RUC = "6",
  CREDENCIAL_DIPLOMATICA = "A",
}

export const MapDocumentType: Record<DocumentType, string> = {
  [DocumentType.NO_DOMICILIADO]: "No Domiciliado",
  [DocumentType.DNI]: "DNI",
  [DocumentType.CE]: "Carnet de Extranjería",
  [DocumentType.PASSPORT]: "Pasaporte",
  [DocumentType.RUC]: "RUC",
  [DocumentType.CREDENCIAL_DIPLOMATICA]: "Credencial Diplomática",
};
export interface PayloadPreRegister {
  name: string;
  lastName: string;
  maternalLastName: string;
  email: string;
  password: string;
  documentType: DocumentType; //DNI, CE
  documentNumber: string;
}

export interface Session {
  user: User;
  token: string;
}
export interface User {
  name: string;
  lastName: string;
  maternalLastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  password?: string;
  isActive: boolean;
  createdAt: Date;
  id: number;
  updatedAt: Date;
  deletedAt: null;
}

export interface UserBodyRequest
  extends Omit<
    User,
    "id" | "createdAt" | "updatedAt" | "deletedAt" | "isActive" | "email"
  > {
  email?: string;
}

export interface PayloadRecoverAccount {
  email: string;
}

export interface PayloadResetPassword {
  password: string;
  token: string;
}
