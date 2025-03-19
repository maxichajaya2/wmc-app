import { api } from "@/api";
import { PayloadPermission, Role, PayloadRole } from "@/models";

export class RoleService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  static findAll = async () => {
    const { data } = await api.get<Role[]>("/roles");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  };

  static create = async (payload: PayloadRole) => {
    const { data } = await api.post<Role>("/roles", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadRole) => {
    const { data } = await api.patch<Role>(`/roles/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/roles/${id}`);
  };

  static addPermission = async (id: number, payload: PayloadPermission) => {
    const { data } = await api.post<Role>(`/roles/${id}/permissions`, payload);
    return data;
  };

  static deletePermission = async (id: number, permissionId: number) => {
    const { data } = await api.delete(`/roles/${id}/permissions/${permissionId}`);
    return data;
  };

}
