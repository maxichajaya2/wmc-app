
export interface SpeakerType {
    id: number;
    nameEn: string;
    nameEs: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadSpeakerType {
    nameEn: string;
    nameEs: string;
    isActive?: boolean
}