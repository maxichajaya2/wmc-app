import { Stand } from "./stand";

export interface Pavilion {
    id: number;
    nameEs: string;
    nameEn: string;
    isActive: boolean;
    stands: Stand[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PayloadPavilion {
    nameEs: string;
    nameEn: string;
    isActive: boolean;
}