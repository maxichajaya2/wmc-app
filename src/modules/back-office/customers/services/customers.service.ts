import { api } from "@/api";
import { Customer, PayloadCustomer } from "@/models";

export class CustomersService {
  static findAll = async () => {
    const { data } = await api.get<Customer[]>("/customers");
    return data;
  };

  static findOne = async (id: string) => {
    const { data } = await api.get<Customer>(`/customers/${id}`);
    return data;
  };

  static create = async (payload: PayloadCustomer) => {
    const { data } = await api.post<Customer>("/customers", payload);
    return data;
  };

  static update = async (id: string, payload: PayloadCustomer) => {
    const { data } = await api.patch<Customer>(`/customers/${id}`, payload);
    return data;
  };

  static remove = async (id: string) => {
    await api.delete(`/customers/${id}`);
  };
}
