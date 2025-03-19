import { api } from "@/api";
import { MenuWebItem, PayloadMenuItem } from "@/models";

export class MenuService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  static findAll = async () => {
    const { data } = await api.get<MenuWebItem[]>("/menus");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<MenuWebItem>(`/menus/${id}`);
    return data;
  };

  static create = async (payload: PayloadMenuItem) => {
    const { data } = await api.post<MenuWebItem>("/menus", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadMenuItem) => {
    const { data } = await api.patch<MenuWebItem>(`/menus/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/menus/${id}`);
  };

}
