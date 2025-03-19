import { api } from "@/api";
import { Fee, PayloadFee } from "@/models";

export class FeeService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Fee[]>("/fees");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Fee>(`/fees/${id}`);
    return data;
  };

  static create = async (payload: PayloadFee) => {
    const { data } = await api.post<Fee>("/fees", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadFee) => {
    const { data } = await api.patch<Fee>(`/fees/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/fees/${id}`);
  };

}
