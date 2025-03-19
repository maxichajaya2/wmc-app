import { api } from "@/api";
import { Product, PayloadProduct } from "@/models";

export class ProductsService {
  static findAll = async () => {
    const { data } = await api.get<Product[]>("/products");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  };

  static create = async (payload: PayloadProduct) => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadProduct) => {
    const { data } = await api.patch<Product>(`/products/${id}`, payload);
    return data;
  };

  static rmeove = async (id: string) => {
    await api.delete(`/brands/${id}`);
  };
}
