export enum ActionRoles {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  INACTIVATE = "inactivate",
  ASSIGN_PERMISSION = "assign_permission",
  UNASSIGN_PERMISSION = "unassign_permission",
  CHANGE_STATUS_CASHBOX = "change_status_cashbox",
  // FEATURE TECHNICAL WORKS
  // --COMENTARIOS
  CREATE_COMMENT = "create_comment",
  READ_COMMENT = "read_comment",
  UPDATE_COMMENT = "update_comment",
  DELETE_COMMENT = "delete_comment",
  // -- ACCIONES
  // ENVIAR A LIDER
  SEND_TO_LEADER = "send_to_leader",
  // ENVIAR A REVISOR
  SEND_TO_REVIEWER = "send_to_reviewer",
  // EN REVISIÓN
  IN_REVIEW = "in_review",
  // APROBADO
  APPROVED = "approved",
  // DESESTIMAR
  DISMISS = "dismiss",
}

export const MapActionRoles: Record<ActionRoles, string> = {
  [ActionRoles.CREATE]: "Crear",
  [ActionRoles.READ]: "Leer",
  [ActionRoles.UPDATE]: "Actualizar",
  [ActionRoles.DELETE]: "Eliminar",
  [ActionRoles.INACTIVATE]: "Inactivar",
  [ActionRoles.ASSIGN_PERMISSION]: "Asignar permisos",
  [ActionRoles.UNASSIGN_PERMISSION]: "Desasignar permisos",
  [ActionRoles.CHANGE_STATUS_CASHBOX]: "Cambiar estado de caja",
  // FEATURE TECHNICAL WORKS
  // --COMENTARIOS
  [ActionRoles.CREATE_COMMENT]: "Crear comentario",
  [ActionRoles.READ_COMMENT]: "Leer comentarios",
  [ActionRoles.UPDATE_COMMENT]: "Actualizar comentario",
  [ActionRoles.DELETE_COMMENT]: "Eliminar comentario",
  // -- ACCIONES
  [ActionRoles.SEND_TO_LEADER]: "Enviar a líder",
  [ActionRoles.SEND_TO_REVIEWER]: "Enviar a revisor",
  [ActionRoles.IN_REVIEW]: "En revisión",
  [ActionRoles.APPROVED]: "Aprobar",
  [ActionRoles.DISMISS]: "Desestimar",
};

export enum ModulesRoles {
  DASHBOARD = "dashboard",
  USERS = "users", //usuarios admin
  ROLES = "roles", //roles admin
  WEB_USERS = "web_users", //usuarios web
  TECHINICAL_WORKS = "technical_works", //trabajos técnicos
  TOPICS = "topics", //temas
  CATEGORIES = "categories", //categorías
  REPORTS = "reports", //reportes
}

export const ROLES_TREE = [
  {
    name: "Usuarios",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.USERS,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.USERS,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.USERS,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.USERS,
        action: ActionRoles.DELETE,
      },
    ],
  },
  {
    name: "Reportes",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.REPORTS,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.REPORTS,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.REPORTS,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.REPORTS,
        action: ActionRoles.DELETE,
      },
    ],
  },
  {
    name: "Roles",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.DELETE,
      },
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.ASSIGN_PERMISSION,
      },
      {
        id: undefined,
        module: ModulesRoles.ROLES,
        action: ActionRoles.UNASSIGN_PERMISSION,
      },
    ],
  },
  {
    name: "Categorías",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.CATEGORIES,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.CATEGORIES,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.CATEGORIES,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.CATEGORIES,
        action: ActionRoles.DELETE,
      },
    ],
  },
  {
    name: "Temas",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.TOPICS,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.TOPICS,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.TOPICS,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.TOPICS,
        action: ActionRoles.DELETE,
      },
    ],
  },
  {
    name: "Usuarios Web",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.WEB_USERS,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.WEB_USERS,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.WEB_USERS,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.WEB_USERS,
        action: ActionRoles.DELETE,
      },
    ],
  },
  {
    name: "Trabajos Técnicos",
    modules: [
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.CREATE,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.READ,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.UPDATE,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.DELETE,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.SEND_TO_LEADER,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.SEND_TO_REVIEWER,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.IN_REVIEW,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.APPROVED,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.DISMISS,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.CREATE_COMMENT,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.READ_COMMENT,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.UPDATE_COMMENT,
      },
      {
        id: undefined,
        module: ModulesRoles.TECHINICAL_WORKS,
        action: ActionRoles.DELETE_COMMENT,
      },
    ],
  },
];
