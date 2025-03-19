import { api } from "@/api";
import { PressRelease, PayloadPressRelease } from "@/models";

export class PressReleaseService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<PressRelease[]>("/press-releases");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<PressRelease>(`/press-releases/${id}`);
    return data;
  };

  static create = async (payload: PayloadPressRelease) => {
    const { data } = await api.post<PressRelease>("/press-releases", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadPressRelease) => {
    const { data } = await api.patch<PressRelease>(`/press-releases/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/press-releases/${id}`);
  };

}
