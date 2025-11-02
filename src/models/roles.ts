import { ActionRoles, ModulesRoles } from "@/constants/roles-tree";
import { Permission } from "./permission";

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt?: string;
}

export interface PayloadRole {
  name: string;
}

export interface RolesPermissions {
  name: string;
  modules: {
    module: ModulesRoles;
    action: ActionRoles;
    enabled: boolean;
    id: number | undefined;
  }[];
}

export enum PrimaryRoles {
// ADMIN, REVISOR, LIDER
  ADMIN = 1,
  REVIEWER = 2,
  LEADER = 3,
}

export const MapPrimaryRoles: Record<PrimaryRoles, string> = {
  [PrimaryRoles.ADMIN]: "Administrador",
  [PrimaryRoles.REVIEWER]: "Revisor",
  [PrimaryRoles.LEADER]: "Líder",
};