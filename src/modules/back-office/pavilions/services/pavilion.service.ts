import { api } from "@/api";
import { Pavilion, PayloadPavilion } from "@/models";

export class PavilionService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Pavilion[]>("/pavilions");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Pavilion>(`/pavilions/${id}`);
    return data;
  };

  static create = async (payload: PayloadPavilion) => {
    const { data } = await api.post<Pavilion>("/pavilions", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadPavilion) => {
    const { data } = await api.patch<Pavilion>(`/pavilions/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/pavilions/${id}`);
  };

}
