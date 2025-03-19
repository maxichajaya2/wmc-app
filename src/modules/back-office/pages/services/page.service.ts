import { api } from "@/api";
import { PageWeb, PayloadPageWeb } from "@/models";

export class PageWebService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async ({ short }: { short?: boolean }) => {
    const { data } = await api.get<PageWeb[]>("/pages", {
      params: {
        short,
      },
    });
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<PageWeb>(`/pages/${id}`);
    return data;
  };

  static create = async (payload: PayloadPageWeb) => {
    const { data } = await api.post<PageWeb>("/pages", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadPageWeb) => {
    const { data } = await api.patch<PageWeb>(`/pages/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/pages/${id}`);
  };
}
