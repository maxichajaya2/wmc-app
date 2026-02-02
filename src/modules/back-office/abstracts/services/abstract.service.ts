import { api } from "@/api";
import { Abstract, PayloadAbstract, UserWeb } from "@/models";

export class Abstractservice {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Abstract[]>("/abstracts");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Abstract>(`/abstracts/${id}`);
    return data;
  };

  static create = async (payload: PayloadAbstract) => {
    const { data } = await api.post<Abstract>("/abstracts", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadAbstract) => {
    const { data } = await api.patch<Abstract>(`/abstracts/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/abstracts/${id}`);
  };

  static findUsers = async (id: number) => {
    const { data } = await api.get<UserWeb[]>(`/abstracts/${id}/users`);
    return data;
  };

  static assignUser = async (id: number, userId: number) => {
    const { data } = await api.post<Abstract>(`/abstracts/${id}/users/${userId}`);
    return data;
  };

  static unassignUser = async (id: number, userId: number) => {
    await api.delete(`/abstracts/${id}/users/${userId}`);
  };

}
