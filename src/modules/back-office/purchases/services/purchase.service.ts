import { api } from "@/api";
import { Purchase, PayloadPurchase } from "@/models";

export class PurchaseService {
  static findAll = async () => {
    const { data } = await api.get<Purchase[]>("/purchases");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Purchase>(`/purchases/${id}`);
    return data;
  };

  static create = async (payload: PayloadPurchase) => {
    const { data } = await api.post<Purchase>("/purchases", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadPurchase) => {
    const { data } = await api.patch<Purchase>(`/purchases/${id}`, payload);
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/purchases/${id}`);
  };
}
