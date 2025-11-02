import { useSessionBoundStore } from "@/modules/back-office/auth/store";

export const useCheckPermission = (module: string, action: string) => {
  const permissions = useSessionBoundStore((state) => state.permissions);
  if (!permissions) return false;
  // Verifica si el módulo:acción existe en el Set
  return permissions.includes(`${module}:${action}`);
};
