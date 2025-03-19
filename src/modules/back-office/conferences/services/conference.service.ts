import { api } from "@/api";
import { Conference, PayloadConference } from "@/models";

export class ConferenceService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Conference[]>("/conferences?mode=dashboard");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Conference>(`/conferences/${id}`);
    return data;
  };

  static create = async (payload: PayloadConference) => {
    const { data } = await api.post<Conference>("/conferences", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadConference) => {
    const { data } = await api.patch<Conference>(`/conferences/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/conferences/${id}`);
  };

}
