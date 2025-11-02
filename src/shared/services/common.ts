import { Country } from "@/models";
import { api } from "@/api";
import { AxiosError, AxiosProgressEvent } from "axios";

export class CommonService {

  static async getCountries() {
    try {
      const { data } = await api.get<Country[]>("/countries");
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new Error(error.response?.data);
      }

      console.log(error);
      throw new Error("No se pudieron obtener los países.");
    }
  }

  static async uploadFile(
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("name", "default");
      formData.append("file", file);

      const { data } = await api.post<{ url: string }>(
        "/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress, // Pasar el callback de progreso a Axios
        }
      );

      return data.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        throw new Error(error.response?.data);
      }

      console.log(error);
      throw new Error("No se pudo subir el archivo.");
    }
  }
}
