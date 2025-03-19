import { ConferenceType } from "./conference-type";

export interface Course {
    id: number;
    nameEn: string;
    nameEs: string;
    code: string;
    backgroundImageUrl: string;
    positionX: string;
    positionY: string;
    conferenceTypeId: string;
    conferenceType: ConferenceType;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadCourse {
    nameEn: string;
    nameEs: string;
    code: string;
    backgroundImageUrl?: string;
    positionX?: string;
    positionY?: string;
    conferenceTypeId: string;
    isActive?: boolean;
}