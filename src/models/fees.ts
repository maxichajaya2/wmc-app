import { Course } from "./courses";

export interface Fee {
    id:         number;
    courseId:   number;
    course:     Course;
    nameEs:     string;
    nameEn:     string;
    memberFlag: boolean;
    startDate:  string;
    endDate:    string;
    currency:   Currency;
    amount:     string;
    noteEs:     string;
    noteEn:     string;
    flagFile:    boolean;
    sieCode?:   string;
    isActive:   boolean;
    createdAt:  string;
    updatedAt:  string;
    deletedAt:  null;
}

export enum Currency {
    USD = 'usd',
    PEN = 'pen',
}

export const MapCurrency: Record<Currency, string> = {
    [Currency.USD]: '  $ Dolar',
    [Currency.PEN]: 'S/. Soles',
}
export const MapSymbolCurrency: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.PEN]: 'S/.',
}

export interface PayloadFee {
    courseId:   number;
    nameEs:     string;
    nameEn:     string;
    sieCode:   string;
    memberFlag: boolean;
    flagFile:    boolean;
    startDate:  string;
    endDate:    string;
    currency:   Currency;
    amount:     number;
    noteEs?:     string;
    noteEn?:     string;
    fileUrl?:    string;
    isActive:   boolean;
}
