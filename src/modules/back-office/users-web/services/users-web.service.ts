import { api } from "@/api";
import { UserWeb, PayloadUserWeb } from "@/models";

export class UserWebService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<UserWeb[]>("/web-users");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<UserWeb>(`/web-users/${id}`);
    return data;
  };

  static create = async (payload: PayloadUserWeb) => {
    const { data } = await api.post<UserWeb>("/web-users", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadUserWeb) => {
    const { data } = await api.patch<UserWeb>(`/web-users/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/web-users/${id}`);
  };
}
