export interface Person {
  givenNames?: string;
  lastName?: string;
  legalName?: string;
  address: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  type: PersonType;
  documentNumber: string;
  createdAt?: string;
  updatedAt?: string;
  id: string;
}

export enum PersonType {
  NATURAL = "natural",
  JURIDICAL = "juridica",
}

export enum DocumentType {
  DNI = '1',
  CE = '4',
  NO_DOMICILIADO = '0',
  PASSPORT = '7',
  RUC = '6',
  CREDENCIAL_DIPLOMATICA = 'A',
}

export const MapDocumentType: Record<DocumentType, string> = {
  [DocumentType.NO_DOMICILIADO]: "No Domiciliado",
  [DocumentType.DNI]: "DNI",
  [DocumentType.CE]: "Carnet de Extranjería",
  [DocumentType.PASSPORT]: "Pasaporte",
  [DocumentType.RUC]: "RUC",
  [DocumentType.CREDENCIAL_DIPLOMATICA]: "Credencial Diplomática",
};

export const MapPersonType: Record<PersonType, string> = {
  [PersonType.NATURAL]: "Natural",
  [PersonType.JURIDICAL]: "Jurídica",
};
