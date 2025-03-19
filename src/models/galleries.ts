export interface Gallery {
    id:            number;
    urlKey:        string;
    titleEn:       string;
    titleEs:       string;
    contentEn:     string;
    contentEs:     string;
    descriptionEn: string;
    descriptionEs: string;
    isActive:      boolean;
    type:          GalleryType;
    startDate?:    string;
    endDate?:      string;
    url:           string;
    isTargetBlank: boolean;
    createdAt:     string;
    updatedAt:     string;
    deletedAt:     null;
    images:        Image[];
}

export enum ImageSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export const MapImageSize: Record<ImageSize, string> = {
    [ImageSize.SMALL]: 'Pequeño (6 x fila)',
    [ImageSize.MEDIUM]: 'Mediano (5 x fila)',
    [ImageSize.LARGE]: 'Grande (4 x fila)',
}

export interface Image {
    id:             number;
    galleryId:      number;
    sort:           number;
    valueEs:          string;
    valueEn:          string;
    createdAt:      string;
    updatedAt:      string;
    deletedAt:      null;
    urlEs:          string;
    urlEn:          string;
    isTargetBlank:  boolean;
}

export interface PayloadGallery {
    urlKey:        string;
    titleEn:       string;
    titleEs:       string;
    contentEn:     string;
    contentEs:     string;
    descriptionEn: string;
    descriptionEs: string;
    type:          GalleryType;
    size:          ImageSize;
    startDate?:    string;
    endDate?:      string;
    images:        PayloadImage[];
}

export interface PayloadImage {
    id?:           number;
    valueEs:         string;
    valueEn:         string;
    sort:          number;
    urlEs:          string;
    urlEn:          string;
    isTargetBlank: boolean;
}

export enum GalleryType {
    SLIDER = 'slider',
    CARRUSEL = 'carrusel',
    BANNER = 'banner',
    STATIC = 'static',
}

export const MapGalleryType: Record<GalleryType, string> = {
    [GalleryType.SLIDER]: 'Slider',
    [GalleryType.CARRUSEL]: 'Carrusel',
    [GalleryType.BANNER]: 'Banner',
    [GalleryType.STATIC]: 'Imagen Estática',
}