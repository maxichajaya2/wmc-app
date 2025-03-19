export interface MenuWebItem {
    id:            number;
    titleEs:       string;
    titleEn:       string;
    parentId?:      number;
    sort:          number;
    isExternalUrl: boolean;
    url?:           string;
    pageId?:        number;
    isActive:      boolean;
    createdUserId: null;
    updatedUserId: null;
    icon:          null;
    createdAt:     Date;
    updatedAt:     Date;
    deletedAt:     null;
    children?:     MenuWebItem[];
    i18n:          I18N;
}

export interface I18N {
    es: string;
    en: string;
}

export interface PayloadMenuItem {
    titleEs: string;
    titleEn: string;
    isParent?: boolean | undefined;
    idParent?: number | undefined;
    sort?: number | undefined;
    isExternalUrl?: boolean | undefined;
    url?: string | undefined;
    idPage?: number | undefined;
    isActive?: boolean | undefined;
}