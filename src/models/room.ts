import { Conference } from "./conference";

export interface Room {
    id: number;
    nameEn: string;
    nameEs: string;
    isActive?: boolean;
    conferences?: Conference[];
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadRoom {
    nameEn: string;
    nameEs: string;
    isActive?: boolean;
}