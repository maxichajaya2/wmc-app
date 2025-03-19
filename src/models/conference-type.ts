
export interface ConferenceType {
    id: number;
    nameEn: string;
    nameEs: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadConferenceType {
    nameEn: string;
    nameEs: string;
    isActive?: boolean;
}