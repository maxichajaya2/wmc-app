import { apiDomain as api } from "@/api";
import { Subsidiary, PayloadSubsidiary } from "@/models";

export class SubsidiaryService {
  static findAll = async (enterpriseId: string) => {
    const { data } = await api.get<Subsidiary[]>(
      `/enterprises/${enterpriseId}/subsidiaries`
    );
    return data;
  };

  static findOne = async (id: string, enterpriseId: string) => {
    const { data } = await api.get<Subsidiary>(
      `/enterprises/${enterpriseId}/subsidiaries/${id}`
    );
    return data;
  };

  static create = async (payload: PayloadSubsidiary, enterpriseId: string) => {
    const { data } = await api.post<Subsidiary>(
      `/enterprises/${enterpriseId}/subsidiaries`,
      payload
    );
    return data;
  };

  static update = async (
    id: string,
    payload: PayloadSubsidiary,
    enterpriseId: string
  ) => {
    const { data } = await api.patch<Subsidiary>(
      `/enterprises/${enterpriseId}/subsidiaries/${id}`,
      payload
    );
    return data;
  };

  static remove = async (id: string, enterpriseId: string) => {
    await api.delete(`/enterprises/${enterpriseId}/subsidiaries/${id}`);
  };
}
