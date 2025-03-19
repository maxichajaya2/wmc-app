import { api } from "@/api";
import { Course, PayloadCourse } from "@/models";

export class CourseService {
  static sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  static findAll = async () => {
    const { data } = await api.get<Course[]>("/courses");
    return data;
  };

  static findOne = async (id: number) => {
    const { data } = await api.get<Course>(`/courses/${id}`);
    return data;
  };

  static create = async (payload: PayloadCourse) => {
    const { data } = await api.post<Course>("/courses", payload);
    return data;
  };

  static update = async (id: number, payload: PayloadCourse) => {
    const { data } = await api.patch<Course>(`/courses/${id}`, payload);
    return data;
  };

  static remove = async (id: number) => {
    await api.delete(`/courses/${id}`);
  };

}
