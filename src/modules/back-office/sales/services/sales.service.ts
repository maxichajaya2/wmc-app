import { api } from "@/api";
import { Sale, PayloadSale } from "@/models";

export class SaleService {
  static findAll = async () => {
    const { data } = await api.get<Sale[]>("/sales");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Sale>(`/sales/${id}`);
    return data;
  };

  static create = async (payload: PayloadSale) => {
    const { data } = await api.post<Sale>("/sales", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadSale) => {
    const { data } = await api.patch<Sale>(`/sales/${id}`, payload);
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/sales/${id}`);
  };
}
