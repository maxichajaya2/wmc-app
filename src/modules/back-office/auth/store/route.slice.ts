import { ROUTES_PATHS } from "@/constants";
import { ModulesRoles } from "@/constants/roles-tree";
import { HttpRequestState } from "@/middlewares";
import { Group } from "@/models";
import { Globe, Home } from "lucide-react";
import { StateCreator } from "zustand";

export interface RouteSlice extends HttpRequestState {
  groups: Group[];
}

export const createRouteSlice: StateCreator<RouteSlice> = (_set, _get) => ({
  groups: [
    {
      name: "Gestión Operativa",
      icon: Home,
      menus: [
        {
          name: "Usuarios",
          url: ROUTES_PATHS.USERS, // /usuarios
          module: ModulesRoles.USERS, // users
          items: [
            {
              name: "Roles",
              url: ROUTES_PATHS.ROLES, // /roles
              module: ModulesRoles.ROLES, // roles
            },
          ],
        },
        {
          name: "Reportes",
          url: ROUTES_PATHS.REPORTS, // /usuarios
          module: ModulesRoles.REPORTS, // users
        },
      ],
    },
    {
      name: "Website",
      icon: Globe,
      menus: [
        {
          name: "Usuarios Web",
          url: ROUTES_PATHS.WEB_USERS,
          module: ModulesRoles.WEB_USERS,
        },
        {
          // name: "Trabajos Técnicos",
          name: "Submissions",
          url: ROUTES_PATHS.TECHINICAL_WORKS,
          module: ModulesRoles.TECHINICAL_WORKS,
        },
        {
          name: "Tablas",
          url: "#",
          module: ModulesRoles.DASHBOARD,
          items: [
            {
              name: "Categorías",
              url: ROUTES_PATHS.CATEGORIES,
              module: ModulesRoles.CATEGORIES,
            },
            {
              name: "Temas",
              url: ROUTES_PATHS.TOPICS,
              module: ModulesRoles.TOPICS,
            },
            {
              name: "Abstracts",
              url: ROUTES_PATHS.ABSTRACTS,
              module: ModulesRoles.ABSTRACTS,
            },
          ]
        }
      ],
    },
  ],
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  error: null,
  loading: false,
});
