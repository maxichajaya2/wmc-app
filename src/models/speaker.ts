import { SpeakerType } from "./speaker-type";

export interface Speaker {
    id: number;
    speakerTypeId: number;
    speakerType: SpeakerType;
    name: string;
    jobEn: string;
    jobEs: string;
    cvEs: string;
    cvEn: string;
    photoUrl: string;
    countryCode: string;
    country: Country;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadSpeaker {
    name: string;
    jobEn: string;
    jobEs: string;
    cvEs: string;
    cvEn: string;
    photoUrl: string;
    countryCode: string;
    speakerTypeId: number;
    isActive?: boolean
}

export interface Country {
    code: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface ProfessionalDesignation {
    code: string;
    name: string;
    icon: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

