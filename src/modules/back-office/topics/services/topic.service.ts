import { api } from "@/api";
import { Topic, PayloadTopic, UserWeb } from "@/models";

export class TopicService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Topic[]>("/topics");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Topic>(`/topics/${id}`);
    return data;
  };

  static create = async (payload: PayloadTopic) => {
    const { data } = await api.post<Topic>("/topics", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadTopic) => {
    const { data } = await api.patch<Topic>(`/topics/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/topics/${id}`);
  };

  static findUsers = async (id: number) => {
    const { data } = await api.get<UserWeb[]>(`/topics/${id}/users`);
    return data;
  };

  static assignUser = async (id: number, userId: number) => {
    const { data } = await api.post<Topic>(`/topics/${id}/users/${userId}`);
    return data;
  };

  static unassignUser = async (id: number, userId: number) => {
    await api.delete(`/topics/${id}/users/${userId}`);
  };

}
