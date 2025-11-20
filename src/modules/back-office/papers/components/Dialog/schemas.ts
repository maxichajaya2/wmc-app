import { DateClass } from "@/lib";
import { AuthorType } from "@/models";
import * as z from "zod";

export const abstractSchema = z.object({
  title: z
      .string()
      .min(3, { message: "The title must have at least 3 characters" }),
    resume: z.string().optional(),
  
    // authorBiography: z
    //   .string()
    //   .min(1, { message: "Author Biography es requerido" })
    //   .refine(maxWords(100), { message: "Máximo 100 palabras" }),
    // abstractText: z
    //   .string()
    //   .min(1, { message: "Abstract es requerido" })
    //   .refine(maxWords(400), { message: "Máximo 400 palabras" }),
    // proposalSignificance: z
    //   .string()
    //   .min(1, { message: "Proposal Significance es requerido" })
    //   .refine(maxWords(100), { message: "Máximo 100 palabras" }),
  
    agreeTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must accept the statement" }),
  
  
    file: z.string().min(1, {
      message: "The file is required",
    }),
    categoryId: z.preprocess(
      (val) => Number(val || ""),
      z.number().min(1, {
        message: "Category is required",
      })
    ),
    topicId: z.preprocess(
      (val) => Number(val || ""),
      z.number().min(1, {
        message: "Topic is required",
      })
    ),
    // language: z.string().min(1, { message: "El idioma es obligatorio" }),
  
    industry: z.string().min(1, { message: "Selecting an industry type is required" }),
    keywords: z
      .array(z.string())
      .min(1, {
        message: "Minimum 1 keyword",
      })
      .max(6, {
        message: "Maximum 6 keywords",
      }),
    flagEvent: z.boolean().optional(),
    eventWhere: z.string().optional(),
    eventWhich: z.string().optional(),
    eventDate: z.string().optional(),
    webUserId: z.preprocess(
      (val) => Number(val || ""),
      z.number().min(1, {
        message: "User is required",
      })
    ),
});

export const authorSchema = z.object({
  name: z.string().min(1, {
      message: "Name is required",
    }),
    middle: z.string().min(1, {
      message: "Last name is required",
    }),
    // last: z.string().min(1, {
    //   message: "Apellido Materno es requerido",
    // }),
    institution: z.string().min(1, {
      message: "Institution is required",
    }),
    remissive: z.string().min(1, {
      message: "Position is required",
    }),
  
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State/Province is required" }),
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
    .min(1, { message: "Email is required" })
    .email({ message: "Personal email is not valid" }),
  
    cellphone: z.string().min(1, {
      message: "Cellphone is required",
    }),
    countryCode: z.string().min(1, {
      message: "Country is required",
    }),
    type: z.nativeEnum(AuthorType, {
      message: "Author type is required",
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
