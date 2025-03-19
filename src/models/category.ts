import { Topic } from "./topic";

export interface Category {
    id:           number;
    name:         string;
    isActive:     boolean;
    topics?:      Topic[];
    createdAt:    string;
    updatedAt:    string;
    deletedAt:    string;
}

export interface PayloadCategory {
    name:         string;
    isActive:     boolean;
}
