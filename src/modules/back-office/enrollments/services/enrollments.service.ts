import { api } from "@/api";
import type {
  Enrollment,
  PayloadChangePaymentStatus,
  PayloadChangeRegistrationStatus
} from "@/models";

export class EnrollmentService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  static findAll = async () => {
    const { data } = await api.get<Enrollment[]>("/enrollments");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Enrollment>(`/enrollments/${id}`);
    return data;
  };

  static create = async (payload: Partial<Enrollment>) => {
    const { data } = await api.post<Enrollment>("/enrollments", payload);
    return data;
  };

  static update = async (id: number, payload: Partial<Enrollment>) => {
    const { data } = await api.patch<Enrollment>(`/enrollments/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/enrollments/${id}`);
  };

  static changePaymentStatus = async (
    id: number,
    payload: PayloadChangePaymentStatus
  ) => {
    const { data } = await api.post<Enrollment>(
      `/enrollments/${id}/payment-status`,
      payload
    );
    return data;
  };

  static changeRegistrationStatus = async (
    id: number,
    payload: PayloadChangeRegistrationStatus
  ) => {
    const { data } = await api.post<Enrollment>(
      `/enrollments/${id}/registration-status`,
      payload
    );
    return data;
  };

  static sendToSie = async (id: number) => {
    const { data } = await api.post<Enrollment>(
      `/enrollments/${id}/registration-status`,
      {
        status: 1,
      }
    );

    return data;
  };
}
