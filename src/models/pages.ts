export interface PageWeb {
    id:           number;
    titleEn:      string;
    titleEs:      string;
    urlKeyEn:     string;
    urlKeyEs:     string;
    contentEn:    string;
    contentEs:    string;
    decriptionEn: string;
    decriptionEs: string;
    isActive:     boolean;
    createdAt:    string;
    updatedAt:    string;
    deletedAt:    null;
}

export interface PayloadPageWeb {
    titleEn:      string;
    titleEs:      string;
    urlKeyEn:     string;
    urlKeyEs:     string;
    contentEn:    string;
    contentEs:    string;
    decriptionEn: string;
    decriptionEs: string;
}
