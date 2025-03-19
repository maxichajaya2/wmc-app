import { api } from "@/api";
import { Gallery, PayloadGallery } from "@/models";

export class GalleryService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async ({ keys }: { keys?: boolean }) => {
    const { data } = await api.get<Gallery[]>("/gallery", {
      params: {
        keys,
      },
    });
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Gallery>(`/gallery/${id}`);
    return data;
  };

  static create = async (payload: PayloadGallery) => {
    const { data } = await api.post<Gallery>("/gallery", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadGallery) => {
    const { data } = await api.patch<Gallery>(`/gallery/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/gallery/${id}`);
  };
}
