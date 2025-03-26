import { DateClass } from "@/lib";
import { AuthorType } from "@/models";
import * as z from "zod";

export const abstractSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" }),
  resume: z
    .string()
    .optional(),
  file: z.string().optional(),
  categoryId: z.preprocess(
    (val) => Number(val || ""),
    z.number().min(1, {
      message: "Categoria es requerida",
    })
  ),
  topicId: z.preprocess(
    (val) => Number(val || ""),
    z.number().min(1, {
      message: "Tema es requerido",
    })
  ),
  language: z.string().min(1, { message: "El idioma es obligatorio" }),
  keywords: z.array(z.string()).optional(),
  flagEvent: z.boolean().optional(),
  eventWhere: z.string().optional(),
  eventWhich: z.string().optional(),
  eventDate: z.string().optional(),
  webUserId: z.preprocess(
    (val) => Number(val || ""),
    z.number().min(1, {
      message: "Usuario es requerido",
    })
  ),
});

export const authorSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  middle: z.string().min(1, {
    message: "Apellido Paterno es requerido",
  }),
  last: z.string().min(1, {
    message: "Apellido Materno es requerido",
  }),
  institution: z.string().min(1, {
    message: "Institución es requerida",
  }),
  remissive: z.string().min(1, {
    message: "Cargo es requerido",
  }),
  emailCorp: z
    .string()
    .email({
      message: "Email Corporativo no es válido",
    })
    .min(1, {
      message: "Email Corporativo es requerido",
    }),
  email: z
    .string()
    .email({
      message: "Email Personal no es válido",
    })
    .optional(),
  cellphone: z.string().min(1, {
    message: "Celular es requerido",
  }),
  countryCode: z.string().min(1, {
    message: "País es requerido",
  }),
  type: z.nativeEnum(AuthorType, {
    message: "Tipo de autor es requerido",
  }),
});

export const paperSchema = abstractSchema
  .extend({
    authors: z.array(authorSchema).min(1, "Mínimo un autor es requerido"),
  })
  .transform((data) => ({
    ...data,
    eventDate: data.eventDate
      ? DateClass.DateToISOString(data.eventDate)
      : undefined,
    eventWhere: data.flagEvent ? data.eventWhere : undefined,
    eventWhich: data.flagEvent ? data.eventWhich : undefined,
    resume: "default",
  }));

export type AbstractFormData = z.infer<typeof abstractSchema>;
export type AuthorFormData = z.infer<typeof authorSchema>;
export type PaperFormData = z.infer<typeof paperSchema>;
