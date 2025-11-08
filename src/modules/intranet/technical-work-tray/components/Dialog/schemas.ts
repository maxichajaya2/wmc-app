import { DateClass } from "@/lib";
import { AuthorType } from "@/models";
import * as z from "zod";

const maxWords = (n: number) => (v: string) =>
  (v?.trim().split(/\s+/).filter(Boolean).length ?? 0) <= n;

export const abstractSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" }),
  resume: z.string().optional(),

  authorBiography: z
    .string()
    .min(1, { message: "Author Biography es requerido" })
    .refine(maxWords(100), { message: "Máximo 100 palabras" }),
  abstractText: z
    .string()
    .min(1, { message: "Abstract es requerido" })
    .refine(maxWords(400), { message: "Máximo 400 palabras" }),
  proposalSignificance: z
    .string()
    .min(1, { message: "Proposal Significance es requerido" })
    .refine(maxWords(100), { message: "Máximo 100 palabras" }),

  agreeTerms: z
  .boolean()
  .refine((v) => v === true, { message: "Debes aceptar la declaración" }),


  file: z.string().min(1, {
    message: "El archivo es requerido",
  }),
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
  keywords: z
    .array(z.string())
    .min(1, {
      message: "Mínimo 1 palabra clave",
    })
    .max(6, {
      message: "Máximo 6 palabras clave",
    }),
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
  // last: z.string().min(1, {
  //   message: "Apellido Materno es requerido",
  // }),
  institution: z.string().min(1, {
    message: "Institución es requerida",
  }),
  remissive: z.string().min(1, {
    message: "Cargo es requerido",
  }),

  address: z.string().min(1, { message: "Dirección es requerida" }),
  city: z.string().min(1, { message: "Ciudad es requerida" }),
  state: z.string().min(1, { message: "Estado/Provincia es requerido" }),
   professionalDesignation: z.string().min(1, { message: "Professional Designation es requerido" }),
  // emailCorp: z
  //   .string()
  //   .email({
  //     message: "Email Corporativo no es válido",
  //   })
  //   .min(1, {
  //     message: "Email Corporativo es requerido",
  //   }),
  // email: z
  //   .string()
  //   .email({
  //     message: "Email Personal no es válido",
  //   })
  //   .optional(),
  email: z
  .string()
  .min(1, { message: "Email es requerido" })
  .email({ message: "Email Personal no es válido" }),

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
