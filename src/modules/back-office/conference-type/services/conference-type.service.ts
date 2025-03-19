import { api } from "@/api";
import { ConferenceType, PayloadConferenceType } from "@/models";

export class ConferenceTypeService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<ConferenceType[]>("/conference-types");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<ConferenceType>(`/conference-types/${id}`);
    return data;
  };

  static create = async (payload: PayloadConferenceType) => {
    const { data } = await api.post<ConferenceType>("/conference-types", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadConferenceType) => {
    const { data } = await api.patch<ConferenceType>(`/conference-types/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/conference-types/${id}`);
  };

}
