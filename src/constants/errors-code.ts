export enum ERROR_CODES {
  UNAUTHORIZED = "UNAUTHORIZED",
  UNAUTHORIZED_LOGIN = "UNAUTHORIZED_LOGIN",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  ERROR = "ERROR",
  PERSON_ALREADY_EXISTS = "PERSON_ALREADY_EXISTS",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  STOCK_IS_NOT_ENOUGH = "STOCK_IS_NOT_ENOUGH",
  TOTAL_INVALID = "TOTAL_INVALID",
}

export const ERRORS = {
  [ERROR_CODES.UNAUTHORIZED]: {
    code: ERROR_CODES.UNAUTHORIZED,
    message: "No estás autorizado para realizar esta acción.",
  },
  [ERROR_CODES.UNAUTHORIZED_LOGIN]: {
    code: ERROR_CODES.UNAUTHORIZED_LOGIN,
    message: "Tus credenciales son incorrectas.",
  },
  [ERROR_CODES.USER_ALREADY_EXISTS]: {
    code: ERROR_CODES.USER_ALREADY_EXISTS,
    message: "El usuario ya existe con ese username.",
  },
  [ERROR_CODES.ERROR]: {
    code: ERROR_CODES.ERROR,
    message: "Ha ocurrido un error.",
  },
  [ERROR_CODES.PERSON_ALREADY_EXISTS]: {
    code: ERROR_CODES.PERSON_ALREADY_EXISTS,
    message: "La persona con ese número de documento ya existe.",
  },
  [ERROR_CODES.NOT_FOUND]: {
    code: ERROR_CODES.NOT_FOUND,
    message: "No se encontró la información solicitada.",
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: "Error en el servidor.",
  },
  [ERROR_CODES.STOCK_IS_NOT_ENOUGH]: {
    code: ERROR_CODES.STOCK_IS_NOT_ENOUGH,
    message: "No hay suficiente stock.",
  },
  [ERROR_CODES.TOTAL_INVALID]: {
    code: ERROR_CODES.TOTAL_INVALID,
    message: "El total es inválido.",
  },
};
