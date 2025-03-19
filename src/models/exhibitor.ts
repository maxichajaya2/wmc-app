import { Stand } from "./stand";

export interface Exhibitor {
    id: number;
    ruc: string;
    enterprise: string;
    web: string;
    stands: Stand[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PayloadExhibitor {
    ruc: string;
    enterprise: string;
    web: string;
    isActive: boolean;
}