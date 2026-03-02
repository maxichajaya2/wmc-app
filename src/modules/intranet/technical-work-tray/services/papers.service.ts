import { apiIntranet as api } from "@/api";
import {
  Paper,
  PayloadPaper,
  PayloadChangeStatusPaper, Commentary,
  PayloadCreateComment,
  Author,
  Parameter
} from "@/models";

export class PaperService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async (idUser: number) => {
    const { data } = await api.get<Paper[]>(`/web-users/${idUser}/papers`);
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Paper>(`/papers/${id}`);
    return data;
  };

  static create = async (payload: PayloadPaper) => {
    const { data } = await api.post<Paper>("/papers", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadPaper) => {
    
    const { data } = await api.patch<Paper>(`/papers/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/papers/${id}`);
  };

  static changeState = async (
    id: number,
    payload: PayloadChangeStatusPaper
  ) => {
    const { data } = await api.post<Paper>(
      `/papers/${id}/change-state`,
      payload
    );
    return data;
  };

  // COMMENTS OF PAPER FUNCTIONALITY
  static findAllComments = async (id: number) => {
    const { data } = await api.get<Commentary[]>(`/papers/${id}/comments`);
    return data;
  };

  static createComment = async (id: number, payload: PayloadCreateComment) => {
    const { data } = await api.post<Commentary>(
      `/papers/${id}/comments`,
      payload
    );
    return data;
  };

  static updateComment = async (
    id: number,
    commentId: number,
    payload: PayloadCreateComment
  ) => {
    const { data } = await api.patch<Commentary>(
      `/papers/${id}/comments/${commentId}`,
      payload
    );
    return data;
  };

  static removeComment = async (id: number, commentId: number) => {
    await api.delete(`/papers/${id}/comments/${commentId}`);
  };

  static findAuthorsByPaper = async (id: number) => {
    const { data } = await api.get<Author[]>(`/papers/${id}/authors`);
    return data;
  }

  // Parámetros para Papers
  static getParameters = async () => {
    const { data } = await api.get<Parameter[]>("/parameters");
    return data;
  }

  // /papers/:id/upload-full-file
  /* 
  {
   "fullFileUrl": 'strig',
}
  */
  static uploadFullFile = async (id: number, payload: { fullFileUrl: string }) => {
    const { data } = await api.post<Paper>(`/papers/${id}/upload-full-file`, payload);
    return data;
  }
}
