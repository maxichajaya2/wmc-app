import { Category, DocumentType, Role } from "@/models";

export interface User {
  id:        number;
  name:      string;
  email:     string;
  password:  string;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  role:      Role;
  categoryId: number;
  category:  Category;
}

export interface PayloadUser {
  name: string;
  email: string;
  password?: string;
  roleId: number;
  categoryId: number;
}

export enum RoleName {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CASHIER = "cashier",
  WAREHOUSE_MANAGER = "warehouse_manager",
  ACCOUNTANT = "accountant",
}

export const MapRoleName: Record<RoleName, string> = {
  super_admin: "Super Admin",
  admin: "Administrador",
  cashier: "Cajero",
  warehouse_manager: "Jefe de Almacén",
  accountant: "Contador",
};

export interface UserWeb {
  id:             number;
  name:           string;
  lastName:       string;
  documentType:   DocumentType;
  documentNumber: string;
  email:          string;
  password:       string;
  isActive:       boolean;
  createdAt:      string;
  updatedAt:      string;
  deletedAt:      null;
}

export enum WebUserType {
  REVIEWER = 'reviewer',
  USER = 'user',
}

export const MapWebUserType: Record<WebUserType, string> = {
  [WebUserType.REVIEWER]: 'Revisor',
  [WebUserType.USER]: 'Usuario',
};

export interface PayloadUserWeb {
  name:           string;
  lastName:       string;
  documentType:   DocumentType;
  documentNumber: string;
  email:          string;
  password?:      string;
}