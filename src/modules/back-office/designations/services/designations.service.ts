import { api } from "@/api";
import { Category, PayloadCategory } from "@/models";

export class CategoryService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  };

  static create = async (payload: PayloadCategory) => {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadCategory) => {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/categories/${id}`);
  };

}
