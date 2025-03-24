const BASE_PATH_ADMIN = "/admin";
export const ROUTES_PATHS = {
  // GENERAL
  HOME: "/",
  ADMIN: BASE_PATH_ADMIN,
  // USER AUTH
  LOGIN: "/inicio-sesion",
  REGISTER: "/registro",
  CONFIRM_REGISTER: "/confirmar-registro",
  RESET_PASSWORD: "/restablecer-contrasena",
  PROFILE: "/perfil",
  TECHNICAL_WORK_TRAY: "/bandeja-trabajos-tecnicos",
  // ADMIN
  LOGIN_ADMIN: `${BASE_PATH_ADMIN}/inicio-sesion`,
  DASHBOARD: `${BASE_PATH_ADMIN}/dashboard`,
  USERS: `${BASE_PATH_ADMIN}/usuarios`,
  WEB_USERS: `${BASE_PATH_ADMIN}/usuarios-web`,
  ROLES: `${BASE_PATH_ADMIN}/roles`,
  CATEGORIES: `${BASE_PATH_ADMIN}/categorias`,
  TOPICS: `${BASE_PATH_ADMIN}/temas`,
  TECHINICAL_WORKS: `${BASE_PATH_ADMIN}/trabajos-tecnicos`,
  REPORTS: `${BASE_PATH_ADMIN}/reportes`,
  // ERROR
  NOT_FOUND: "/not-found",
  ERROR: "/error",
};
