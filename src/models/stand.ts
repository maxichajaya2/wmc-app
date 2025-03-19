import { Exhibitor } from "./exhibitor";
import { Pavilion } from "./pavilion";

export interface Stand {
    id: number;
    name: string;
    pavilionId: number;
    pavilion?: Pavilion;
    exhibitorId?: number;
    exhibitor?: Exhibitor;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PayloadStand {
    name: string;
    pavilionId: number;
    isActive: boolean;
}