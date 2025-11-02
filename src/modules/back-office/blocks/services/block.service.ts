import { api } from "@/api";
import { Block, PayloadBlock } from "@/models";

export class BlocksService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async ({ keys }: { keys?: boolean }) => {
    const { data } = await api.get<Block[]>("/blocks", {
      params: {
        keys,
      },
    });
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Block>(`/blocks/${id}`);
    return data;
  };

  static create = async (payload: PayloadBlock) => {
    const { data } = await api.post<Block>("/blocks", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadBlock) => {
    const { data } = await api.patch<Block>(`/blocks/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/blocks/${id}`);
  };
}
