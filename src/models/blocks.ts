export interface Block {
    id:        number;
    urlKey:    string;
    titleEn:   string;
    titleEs:   string;
    contentEn: string;
    contentEs: string;
    isActive:  boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

export interface PayloadBlock {
    urlKey:    string;
    titleEn:   string;
    titleEs:   string;
    contentEn: string;
    contentEs: string;
}
