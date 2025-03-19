import { api } from "@/api";
import { Speaker, PayloadSpeaker } from "@/models";

export class SpeakerService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Speaker[]>("/speakers");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Speaker>(`/speakers/${id}`);
    return data;
  };

  static create = async (payload: PayloadSpeaker) => {
    const { data } = await api.post<Speaker>("/speakers", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadSpeaker) => {
    const { data } = await api.patch<Speaker>(`/speakers/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/speakers/${id}`);
  };

}
