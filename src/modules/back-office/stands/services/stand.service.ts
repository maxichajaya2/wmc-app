import { api } from "@/api";
import { Stand, PayloadStand } from "@/models";

export class StandService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Stand[]>("/stands");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Stand>(`/stands/${id}`);
    return data;
  };

  static create = async (payload: PayloadStand) => {
    const { data } = await api.post<Stand>("/stands", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadStand) => {
    const { data } = await api.patch<Stand>(`/stands/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/stands/${id}`);
  };

}
