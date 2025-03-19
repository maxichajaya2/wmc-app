import { api } from "@/api";
import { Exhibitor, PayloadExhibitor } from "@/models";

export class ExhibitorService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Exhibitor[]>("/exhibitors");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Exhibitor>(`/exhibitors/${id}`);
    return data;
  };

  static create = async (payload: PayloadExhibitor) => {
    const { data } = await api.post<Exhibitor>("/exhibitors", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadExhibitor) => {
    const { data } = await api.patch<Exhibitor>(`/exhibitors/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/exhibitors/${id}`);
  };

  static assignStands = async (id: number, standIds: number[]) => {
    const { data } = await api.post<Exhibitor>(`/exhibitors/${id}/stands`, {
      standIds,
    });
    return data;
  };
}
