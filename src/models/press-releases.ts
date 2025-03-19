
export interface PressRelease {
    id:        number;
    type:      PressReleaseType;
    titleEs:   string;
    titleEn:   string;
    subtitleEs: string;
    subtitleEn: string;
    date:      string;
    photo:     string;
    textEs:    string;
    textEn:    string;
    video:     string;
    isActive:  boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PayloadPressRelease {
    type: string;
    titleEs: string;
    titleEn: string;
    subtitleEs?: string;
    subtitleEn?: string;
    date: string;
    photo?: string;
    textEs: string;
    textEn: string;
    video?: string;
    isActive: boolean;
}

export enum PressReleaseType {
    PRESS_RELEASES = 'N',
    NEWSLETTERS = 'B',
    INTERVIEWS = 'E'
}

export const MapPressReleasesType : Record<PressReleaseType, string> = {
    [PressReleaseType.PRESS_RELEASES]: 'Notas de Prensa',
    [PressReleaseType.NEWSLETTERS]: 'Boletines',
    [PressReleaseType.INTERVIEWS]: 'Entrevistas'
}