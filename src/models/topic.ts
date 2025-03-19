import { Category } from "./category";
import { UserWeb } from "./user";

export interface Topic {
    id:        number;
    name:      string;
    users?:    UserWeb[];
    categoryId: number;
    category:  Category;
    isActive:  boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

export interface PayloadTopic {
    name: string;
    categoryId: number;
}
