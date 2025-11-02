import { User } from "./user";

export interface CashBox {
    subsidiaryId:  string;
    name:          string;
    responsableId: string;
    status:        CashBoxStatus;
    createdById:   string;
    createdAt:     string;
    id:            string;
    updatedAt:     string;
    responsable:   User;
}

export enum CashBoxStatus {
    OPEN = "open",
    CLOSED = "closed",
}

export const MapCashBoxStatus: Record<CashBoxStatus, string> = {
    [CashBoxStatus.OPEN]: "Abierta",
    [CashBoxStatus.CLOSED]: "Cerrada",
};

export interface PayloadCashBox {
    name:          string;
    responsableId: string;
}

export interface PayloadChangeStatusCashBox {
    status:  CashBoxStatus;
    items:   Item[];
    total:   number;
    remarks?: string;
}

export interface Item {
    amount:  number;
    remarks?: string;
}
