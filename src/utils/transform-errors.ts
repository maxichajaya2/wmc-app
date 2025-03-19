import { ERROR_CODES, ERRORS, ROUTES_PATHS } from "@/constants";
import { ErrorType } from "@/models";
import { AxiosError } from "axios";

export function transformError(errorAxios: AxiosError) {
  const status = errorAxios.response?.status;
  console.log({status})
  if (status === 400) {
    const { code } = errorAxios.response?.data as any;
    const message =
      ERRORS[code as keyof typeof ERRORS]?.message ?? "Error en la petición";
    return new ErrorType(code ?? "UNKNOWN_ERROR", message);
  }

  if (status === 401) {
    if (window.location.pathname !== ROUTES_PATHS.LOGIN) {
      return new ErrorType(
        ERROR_CODES.UNAUTHORIZED,
        ERRORS[ERROR_CODES.UNAUTHORIZED].message
      );
    }
    return new ErrorType(
      ERROR_CODES.UNAUTHORIZED_LOGIN,
      ERRORS[ERROR_CODES.UNAUTHORIZED_LOGIN].message
    );
  }
  if (status === 404) {
    return new ErrorType(
      ERROR_CODES.NOT_FOUND,
      ERRORS[ERROR_CODES.NOT_FOUND].message
    );
  }

  // Manejo de otros códigos de error
  return new ErrorType(
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    ERRORS[ERROR_CODES.INTERNAL_SERVER_ERROR].message
  );
}
