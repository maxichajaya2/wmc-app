import { api } from "@/api";
import { Unit } from "@/models";

export class UnitsService {
  static findAll = async () => {
    const { data } = await api.get<Unit[]>("/units");
    return data;
  };
}
