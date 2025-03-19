import { Fee } from "./fees";
import { DocumentType } from "./person";
import { UserWeb } from "./user";

export interface Enrollment {
  id: number;
  userId: number;
  documentType: DocumentType;
  documentNumber: string;
  name: string;
  paternalName: string;
  maternalName: string;
  nationality: string;
  company: string;
  position: string;
  countryCode: string;
  address: string;
  departmentId: number;
  provinceId: number;
  districtId: number;
  phoneNumber: string;
  email: string;
  feeId: number;
  amount: string;
  fileUrl: null | string;
  factType: string;
  factRuc: null | string;
  factRazonSocial: null | string;
  factAddress: string;
  factPerson: string;
  factPhone: string;
  paymentMethod: PaymentMethodEnrollMent;
  paymentFile: string;
  paymentStatus: PaymentStatus;
  visaResponse: null;
  registrationStatus: RegistrationStatus;
  registrationNumber: null | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  department: Department;
  district: District;
  province: Province;
  fee: Fee;
  user: UserWeb;
}

export interface Department {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
}

export interface Province {
  id: number;
  name: string;
  departmentId: number;
}

export enum PaymentStatus {
  SUCCESS = 1,
  PENDING = 2,
  REJECTED = 0,
}

export const MapPaymentStatus: Record<PaymentStatus, string> = {
  [PaymentStatus.SUCCESS]: "Pagado",
  [PaymentStatus.PENDING]: "Pendiente",
  [PaymentStatus.REJECTED]: "Rechazado",
};

export enum RegistrationStatus {
  REGISTERED = 0,
  SIE = 1,
  ANULADO = 9,
}

export enum PaymentMethodEnrollMent {
    VISA= 'visa', DEPOSIT= 'deposit'
}

export const MapPaymentMethodEnrollMent: Record<PaymentMethodEnrollMent, string> = {
    [PaymentMethodEnrollMent.VISA]: "Visa",
    [PaymentMethodEnrollMent.DEPOSIT]: "Depósito",
};

export const MapRegistrationStatus: Record<RegistrationStatus, string> = {
  [RegistrationStatus.REGISTERED]: "Registrado",
  [RegistrationStatus.SIE]: "Enviado a SIE",
  [RegistrationStatus.ANULADO]: "Anulado",
};

export interface PayloadChangePaymentStatus {
  status: PaymentStatus;
}

export interface PayloadChangeRegistrationStatus {
  status: RegistrationStatus;
}

export interface SieResponse {
  success: boolean;
  code: string;
  message: string;
}
