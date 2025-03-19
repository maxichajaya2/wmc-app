import { api } from "@/api";
import { CashBox, PayloadCashBox, PayloadChangeStatusCashBox } from "@/models";

export class CashBoxesService {
  static findAll = async () => {
    const { data } = await api.get<CashBox[]>("/cash-boxes");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<CashBox>(`/cash-boxes/${id}`);
    return data;
  };

  static create = async (payload: PayloadCashBox) => {
    const { data } = await api.post<CashBox>("/cash-boxes", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadCashBox) => {
    const { data } = await api.patch<CashBox>(`/cash-boxes/${id}`, payload);
    return data;
  };

  static changeStatus = async (
    id: string,
    payload: PayloadChangeStatusCashBox
  ) => {
    const { data } = await api.post<CashBox>(
      `/cash-boxes/${id}/change-status`,
      payload
    );
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/cash-boxes/${id}`);
  };
}
