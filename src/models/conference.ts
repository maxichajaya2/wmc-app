import { Room } from "./room";
import { Speaker } from "./speaker";
import { SpeakerType } from "./speaker-type";

export interface Conference {
    id: number;
    nameEn: string;
    nameEs: string;
    startDate: string;
    endDate: string;
    roomId: number;
    room: Room;
    speakerIds?: number[];
    speakers?: Speaker[];
    conferenceSpeakers?: ConferenceSpeaker[];
    resumeEn?: string;
    resumeEs?: string;
    liveLink?: string;
    liveImage?: string;
    googleLink?: string;
    outlookLink?: string;
    calendarLink?: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface PayloadConference {
    nameEn: string;
    nameEs: string;
    startDate: string;
    endDate: string;
    roomId: number;
    speakerIds?: number[];
    resumeEn?: string;
    resumeEs?: string;
    liveLink?: string;
    liveImage?: string;
    googleLink?: string;
    outlookLink?: string;
    calendarLink?: string;
    isActive?: boolean;
}

export interface ConferenceSpeaker {
    id:            number;
    conferenceId:  number;
    speakerId:     number;
    speakerTypeId: number;
    speaker:       Speaker;
    speakerType:   SpeakerType;
}
