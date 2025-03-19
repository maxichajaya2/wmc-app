import { api } from "@/api";
import { Room, PayloadRoom } from "@/models";

export class RoomService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Room[]>("/rooms");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Room>(`/rooms/${id}`);
    return data;
  };

  static create = async (payload: PayloadRoom) => {
    const { data } = await api.post<Room>("/rooms", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadRoom) => {
    const { data } = await api.patch<Room>(`/rooms/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/rooms/${id}`);
  };

}
