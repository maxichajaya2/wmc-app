import { PayloadUser, User } from "@/models";
import { api } from "@/api";

export class UsersService {
  static async findAll() {
    const { data } = await api.get<User[]>("/users");
    return data;
  }

  static async findOne(id: number) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  }

  static async create(payload: PayloadUser) {
    const { data } = await api.post<User>("/users", payload);
    return data;
  }

  static async update(id: number, payload: PayloadUser) {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  }

  static async remove(id: number) {
    await api.delete(`/users/${id}`);
  }
}
