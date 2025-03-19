import { api } from "@/api";
import { Supplier, PayloadSupplier } from "@/models";

export class SuppliersService {
  static findAll = async () => {
    const { data } = await api.get<Supplier[]>("/suppliers");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Supplier>(`/suppliers/${id}`);
    return data;
  };

  static create = async (payload: PayloadSupplier) => {
    const { data } = await api.post<Supplier>("/suppliers", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadSupplier) => {
    const { data } = await api.patch<Supplier>(`/suppliers/${id}`, payload);
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/suppliers/${id}`);
  };
}
