import { api } from "@/api";
import { Brand, PayloadBrand } from "@/models";

export class BrandsService {
  static findAll = async () => {
    const { data } = await api.get<Brand[]>("/brands");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Brand>(`/brands/${id}`);
    return data;
  };

  static create = async (payload: PayloadBrand) => {
    const { data } = await api.post<Brand>("/brands", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadBrand) => {
    const { data } = await api.patch<Brand>(`/brands/${id}`, payload);
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/brands/${id}`);
  };
}
