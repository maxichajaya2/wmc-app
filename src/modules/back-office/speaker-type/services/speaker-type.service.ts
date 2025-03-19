import { api } from "@/api";
import { SpeakerType, PayloadSpeakerType } from "@/models";

export class SpeakerTypeService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<SpeakerType[]>("/speaker-types");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<SpeakerType>(`/speaker-types/${id}`);
    return data;
  };

  static create = async (payload: PayloadSpeakerType) => {
    const { data } = await api.post<SpeakerType>("/speaker-types", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadSpeakerType) => {
    const { data } = await api.patch<SpeakerType>(`/speaker-types/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/speaker-types/${id}`);
  };

}
