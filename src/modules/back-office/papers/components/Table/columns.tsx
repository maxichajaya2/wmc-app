import React, { useCallback } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import {
  type Paper as Entity,
  MapDocumentType,
  MapProcessPaper,
  MapStatePaper,
  MapTypePaper,
  ProcessPaper,
  StatePaper,
} from "@/models";
import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";
import { usePaperStore } from "../../store/papers.store";
import { formatDate } from "../../../../../utils/format-date";
import { useCheckPermission } from "@/utils";
import { ActionRoles, ModulesRoles } from "@/constants";
// import { Category } from '../../../../../../../backend/src/domain/entities/category.entity';

const CorrelativeCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">{item.correlative || ""}</div>
));
const CategoryCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-col gap-1">
      {item.category?.name ?? "Not assigned"}
    </div>
  </div>
));
const TopicCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-col gap-1">
      {item.topic?.name ?? "Not assigned"}
    </div>
  </div>
));

const TitleCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">{item.title || ""}</div>
));
const NameAndLastNameUserCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">
    {item.webUser ? (
      <>
        {item.webUser.name} {item.webUser.lastName} <br />
        {item.webUser.email} <br />
        {MapDocumentType[item.webUser.documentType]}{" "}
        {item.webUser.documentNumber}
      </>
    ) : (
      "Not assigned"
    )}
  </div>
));
const RegisterDateCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.receivedDate ? formatDate(item.receivedDate) : "No date"}
  </div>
));
const ReviewerAssignedCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.reviewerUser ? (
      <>
        <div className="flex flex-col gap-1">
          {item.reviewerUser.name} <br />
          {item.reviewerUser.email}
        </div>
      </>
    ) : (
      "Not assigned"
    )}
  </div>
));
const ReviewersTeamCell = React.memo(({ item }: { item: Entity }) => {
  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      {/* REVISOR PRINCIPAL */}
      {item.reviewerUser ? (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white w-fit">
          ⭐ Principal: {item.reviewerUser.name}
        </Badge>
      ) : (
        <span className="text-[11px] text-gray-400 italic">Sin principal</span>
      )}

      {/* REVISOR DE APOYO 1 */}
      {item.reviewerSupport1 && (
        <Badge
          variant="outline"
          className="border-slate-300 text-slate-700 w-fit"
        >
          👥 Apoyo 1: {item.reviewerSupport1.name}
        </Badge>
      )}

      {/* REVISOR DE APOYO 2 */}
      {item.reviewerSupport2 && (
        <Badge
          variant="outline"
          className="border-slate-300 text-slate-700 w-fit"
        >
          👥 Apoyo 2: {item.reviewerSupport2.name}
        </Badge>
      )}

      {/* REVISOR DE APOYO 3 (Agregado por si lo necesitas) */}
      {item.reviewerSupport3 && (
        <Badge
          variant="outline"
          className="border-slate-300 text-slate-700 w-fit"
        >
          👥 Apoyo 3: {item.reviewerSupport3.name}
        </Badge>
      )}
    </div>
  );
});

const TypeAssignedCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.type ? (
      <div className="flex flex-col gap-1">{MapTypePaper[item.type]}</div>
    ) : (
      "Not assigned"
    )}
  </div>
));
const ApprovePhaseOneDateCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.approvedDate ? formatDate(item.approvedDate) : "No date"}
  </div>
));
const ApprovePhaseTwoDateCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.selectedApprovedDate
      ? formatDate(item.selectedApprovedDate)
      : "No date"}
  </div>
));

const ProcessCell = React.memo(({ item }: { item: Entity }) => {
  let className = "bg-blue-500 text-white hover:bg-blue-500/80";
  if (item.process === ProcessPaper.SELECCIONADO) {
    className =
      "bg-green-500 text-white hover:bg-green-500/80 font-extrabold h-6 w-[75px] flex justify-center items-center text-center";
  } else if (item.process === ProcessPaper.PRESELECCIONADO) {
    className =
      "bg-rose-500 text-white hover:bg-rose-500/80 font-extrabold h-6 w-[75px] flex justify-center items-center text-center";
  }
  const title = (item: Entity) => {
    if (item.process === ProcessPaper.PRESELECCIONADO) {
      return MapProcessPaper[item.process];
    }
    if (item.process === ProcessPaper.SELECCIONADO) {
      return MapProcessPaper[item.process];
    }
    return MapProcessPaper[item.process];
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge className={className}>{title(item)}</Badge>
    </div>
  );
});

const StatusCell = React.memo(({ item }: { item: Entity }) => {
  let className = "bg-blue-500 text-white hover:bg-blue-500/80";
  const receivedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.receivedDate
        ? formatDate(item.receivedDate)
        : "No date"
      : item.selectedReceivedDate
        ? formatDate(item.selectedReceivedDate)
        : "No date";
  const assignedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.assignedDate
        ? formatDate(item.assignedDate)
        : "No date"
      : item.selectedAssignedDate
        ? formatDate(item.selectedAssignedDate)
        : "No date";
  const reviewedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.reviewedDate
        ? formatDate(item.reviewedDate)
        : "No date"
      : item.selectedReviewedDate
        ? formatDate(item.selectedReviewedDate)
        : "No date";
  const approvedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.approvedDate
        ? formatDate(item.approvedDate)
        : "No date"
      : item.selectedApprovedDate
        ? formatDate(item.selectedApprovedDate)
        : "No date";
  const dismissedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.dismissedDate
        ? formatDate(item.dismissedDate)
        : "No date"
      : item.selectedDismissedDate
        ? formatDate(item.selectedDismissedDate)
        : "No date";
  let tooltipContent = item.receivedDate
    ? formatDate(item.receivedDate)
    : "No date";

  if (item.state === StatePaper.SENT) {
    className = "bg-yellow-500 text-black hover:bg-yellow-500/80";
    tooltipContent = receivedDate;
  } else if (item.state === StatePaper.ASSIGNED) {
    className = "bg-orange-500 text-white hover:bg-orange-500/80";
    tooltipContent = assignedDate;
  } else if (item.state === StatePaper.UNDER_REVIEW) {
    className = "bg-red-500 text-white hover:bg-red-500/80";
    tooltipContent = reviewedDate;
  } else if (item.state === StatePaper.APPROVED) {
    className = "bg-green-500 text-white hover:bg-green-500/80";
    tooltipContent = approvedDate;
  } else if (item.state === StatePaper.DISMISSED) {
    className = "bg-gray-500 text-white hover:bg-gray-500/80";
    tooltipContent = dismissedDate;
  } else if (item.state === StatePaper.OBSERVED) {
    className =
      "bg-orange-600 text-white hover:bg-orange-600/80 border-2 border-orange-900";
    tooltipContent = "This work has observations that must be corrected.";
  } else if (item.state === StatePaper.SUBSANATED) {
    className = "bg-cyan-600 text-white hover:bg-cyan-600/80";
    tooltipContent = "The author has uploaded the corrected file.";
  }

  const title = (item: Entity) => {
    if (item.state === StatePaper.APPROVED) {
      if (item.process === ProcessPaper.PRESELECCIONADO) {
        // return "Preseleccionado"
        return "PRESELECTED";
      }
      if (item.process === ProcessPaper.SELECCIONADO) {
        // return "Seleccionado"
        return "SELECTED";
      }
    } else {
      return MapStatePaper[item.state];
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <TooltipProvider delayDuration={1}>
        <Tooltip delayDuration={1}>
          <TooltipTrigger>
            <Badge className={className}>{title(item)}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

const ReviewerScoreCell = React.memo(
  ({ item, slot }: { item: Entity; slot: 1 | 2 | 3 | 4 }) => {
    const phasePrefix =
      item.process === ProcessPaper.PRESELECCIONADO ? "p1" : "p2";
    const slotKey =
      slot === 1 ? "m" : slot === 2 ? "s1" : slot === 3 ? "s2" : "s3";
    const key = `${phasePrefix}_${slotKey}_rate` as keyof Entity;
    const value = item[key] as any;

    return (
      <div className="flex flex-col gap-2">
        {value ? <div className="flex flex-col gap-1">{value}</div> : "--"}
      </div>
    );
  },
);

const TotalScoreCell = React.memo(({ item }: { item: Entity }) => {
  const value =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.phase1_general_rate
      : item.phase2_general_rate;

  return (
    <div className="flex flex-col gap-2 font-bold">
      {value ? <div className="flex flex-col gap-1">{value}</div> : "--"}
    </div>
  );
});

const ButtonView = React.memo(({ item }: { item: Entity }) => {
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleEdit = useCallback(() => {
    openActionModal(item.id, "view");
  }, [item, openActionModal]);
  return <DropdownMenuItem onClick={handleEdit}>View</DropdownMenuItem>;
});

const ButtonEdit = React.memo(({ item }: { item: Entity }) => {
  const canEdit = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.UPDATE,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleEdit = useCallback(() => {
    openActionModal(item.id, "edit");
  }, [item, openActionModal]);

  if (!canEdit) return null;

  return <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>;
});

const ButtonDelete = React.memo(({ item }: { item: Entity }) => {
  const canDelete = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.DELETE,
  );
  const openActionModal = usePaperStore((state) => state.openActionModal);
  const handleDelete = useCallback(() => {
    openActionModal(item.id, "delete");
  }, [item, openActionModal]);

  if (!canDelete) return null;

  return <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>;
});

const ButtonSendToLeader = React.memo(({ item }: { item: Entity }) => {
  const canSendToLeader = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.SEND_TO_LEADER,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleSend = useCallback(() => {
    openActionModal(item.id, "send-paper");
  }, [item, openActionModal]);

  if (!canSendToLeader || item.state !== StatePaper.RECEIVED) return null;

  return (
    <DropdownMenuItem onClick={handleSend}>Send to Leader</DropdownMenuItem>
  );
});

const ButtonSendToReviewer = React.memo(({ item }: { item: Entity }) => {
  const canSendToReviewer = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.SEND_TO_REVIEWER,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleAssign = useCallback(() => {
    openActionModal(item.id, "assign-paper");
  }, [item, openActionModal]);

  if (!canSendToReviewer || item.state !== StatePaper.SENT) return null;

  return <DropdownMenuItem onClick={handleAssign}>Assign</DropdownMenuItem>;
});

const ButtonReview = React.memo(({ item }: { item: Entity }) => {
  const canReview = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.IN_REVIEW,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleReview = useCallback(() => {
    openActionModal(item.id, "review-paper");
  }, [item, openActionModal]);

  if (!canReview || item.state !== StatePaper.ASSIGNED) return null;

  return <DropdownMenuItem onClick={handleReview}>In review</DropdownMenuItem>;
});

const ButtonRate = React.memo(({ item }: { item: Entity }) => {
  const canReview = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.IN_REVIEW,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleReview = useCallback(() => {
    openActionModal(item.id, "rate-paper");
  }, [item, openActionModal]);

  // Se añade la condición para que aparezca en UNDER_REVIEW o en OBSERVED
  if (
    !canReview ||
    (item.state !== StatePaper.UNDER_REVIEW &&
      item.state !== StatePaper.OBSERVED &&
      item.state !== StatePaper.SUBSANATED) // <-- AGREGAR ESTADO OBSERVED Y SUBSANATED
    // || Comentamos esto para que puedan seguir calificando
    // (item.process === ProcessPaper.PRESELECCIONADO && item.phase1Score) ||
    // (item.process === ProcessPaper.SELECCIONADO && item.phase2Score)
  )
    return null;

  return <DropdownMenuItem onClick={handleReview}>Score</DropdownMenuItem>;
});

const ButtonApprove = React.memo(({ item }: { item: Entity }) => {
  const canApprove = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.APPROVED,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleApprove = useCallback(() => {
    openActionModal(item.id, "approve-paper");
  }, [item, openActionModal]);

  // Condición de visibilidad:
  if (
    !canApprove ||
    // Si el estado NO es ninguno de estos tres, se oculta (return null)
    (item.state !== StatePaper.UNDER_REVIEW &&
      item.state !== StatePaper.OBSERVED &&
      item.state !== StatePaper.SUBSANATED) ||
    // O si falta el score según el proceso
    (item.process === ProcessPaper.PRESELECCIONADO &&
      !item.phase1_general_rate) ||
    (item.process === ProcessPaper.SELECCIONADO && !item.phase2_general_rate)
  ) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={handleApprove}>
      {item.process === ProcessPaper.PRESELECCIONADO ? "Preselect" : "Approve"}
    </DropdownMenuItem>
  );
});
const ButtonViewComments = React.memo(({ item }: { item: Entity }) => {
  const { openCommentsDialog, setSelected } = usePaperStore((state) => ({
    openCommentsDialog: state.openCommentsDialog,
    setSelected: state.setSelected,
  }));
  const handleViewComments = useCallback(() => {
    openCommentsDialog(item.id);
    setSelected(item);
  }, [item, openCommentsDialog, setSelected]);

  /* if (
    (item.state !== StatePaper.UNDER_REVIEW &&
      item.state !== StatePaper.OBSERVED &&
      item.state !== StatePaper.SUBSANATED) ||
    (item.process === ProcessPaper.PRESELECCIONADO && !item.phase1Score) ||
    (item.process === ProcessPaper.SELECCIONADO && !item.phase2Score)
  ) {
    return null;
  } */

  return (
    <DropdownMenuItem onClick={handleViewComments}>
      <MessageSquare className="mr-2 h-4 w-4" />
      View comments
    </DropdownMenuItem>
  );
});

const ButtonDismiss = React.memo(({ item }: { item: Entity }) => {
  const canDismiss = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.DISMISS,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleDismiss = useCallback(() => {
    openActionModal(item.id, "dismiss-paper");
  }, [item, openActionModal]);

  if (
    !canDismiss ||
    item.state === StatePaper.DISMISSED ||
    item.state === StatePaper.APPROVED
  )
    return null;

  return <DropdownMenuItem onClick={handleDismiss}>Dismiss</DropdownMenuItem>;
});

const ButtonObserve = React.memo(({ item }: { item: Entity }) => {
  const canObserve = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.IN_REVIEW,
  );
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));

  const handleObserve = useCallback(() => {
    openActionModal(item.id, "observe-paper");
  }, [item.id, openActionModal]);

  // CONDICIÓN CORREGIDA:
  // Queremos que aparezca si el usuario tiene permiso Y el trabajo NO está finalizado (ni aprobado ni desestimado)
  if (
    !canObserve ||
    item.state === StatePaper.APPROVED ||
    item.state === StatePaper.DISMISSED ||
    item.state === StatePaper.OBSERVED || // <-- AGREGADO: Si ya está observado, no mostramos "Observe" (porque ya lo está)
    item.state === StatePaper.RECEIVED ||
    item.state === StatePaper.SENT
  ) {
    return null;
  }

  return <DropdownMenuItem onClick={handleObserve}>Observe</DropdownMenuItem>;
});

const ButtonReassign = React.memo(({ item }: { item: Entity }) => {
  const canReassign = useCheckPermission(
    ModulesRoles.TECHINICAL_WORKS,
    ActionRoles.SEND_TO_REVIEWER,
  );

  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));

  const handleReassign = useCallback(() => {
    // Si ya tiene un revisor, abrimos el modal de asignación de revisor
    // Si queremos una lógica unificada, usamos "reassign-paper"
    openActionModal(item.id, "reassign-paper" as any);
  }, [item.id, openActionModal]);

  // Regla: Se puede reasignar si ya está en estado ASSIGNED
  // (es decir, ya tiene a alguien pero aún no empieza la revisión)
  if (!canReassign || item.state !== StatePaper.ASSIGNED) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={handleReassign}>
      Reassign Reviewer/Leader
    </DropdownMenuItem>
  );
});

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        {/* <MoreHorizontal className="w-5 h-5" /> */}
        <div className="px-3 py-1 text-white rounded-full text-xs font-bold cursor-pointer hover:opacity-90 animate-glow">
          ACTIONS
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ButtonView item={item} />
        <ButtonEdit item={item} />
        <ButtonDelete item={item} />
        <ButtonSendToLeader item={item} />
        <ButtonSendToReviewer item={item} />
        <ButtonReassign item={item} />
        <ButtonReview item={item} />
        <ButtonRate item={item} />
        <ButtonApprove item={item} />
        <ButtonObserve item={item} />
        <ButtonViewComments item={item} />
        <ButtonDismiss item={item} />
        {/* DEV
                    <DropdownMenuItem onClick={handleReceipt}>Recibir</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "correlative",
    header: "Nro",
    cell: ({ row }) => <CorrelativeCell item={row.original} />,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryCell item={row.original} />,
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => <TopicCell item={row.original} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <TitleCell item={row.original} />,
  },
  {
    accessorKey: "userName",
    header: "Names",
    cell: ({ row }) => <NameAndLastNameUserCell item={row.original} />,
  },
  {
    accessorKey: "registeredDate",
    header: "Submission Date",
    cell: ({ row }) => <RegisterDateCell item={row.original} />,
  },
  {
    id: "reviewers-team", // Cambiamos a id porque usaremos múltiples campos
    header: "Review Team", // Cambié el título para que tenga sentido
    cell: ({ row }) => <ReviewersTeamCell item={row.original} />, // <--- USAMOS TU NUEVO COMPONENTE
  },
  {
    accessorKey: "approvedDate",
    // header: "F. Preselecc.",
    header: "D. Preselection",
    cell: ({ row }) => <ApprovePhaseOneDateCell item={row.original} />,
  },
  {
    accessorKey: "selectedApprovedDate",
    // header: "F. Selecc.",
    header: "Selection Date",
    cell: ({ row }) => <ApprovePhaseTwoDateCell item={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeAssignedCell item={row.original} />,
  },
  {
    id: "p1_score",
    header: "P. 1 Score",
    cell: ({ row }) => <ReviewerScoreCell item={row.original} slot={1} />,
  },
  {
    id: "p2_score",
    header: "P. 2 Score",
    cell: ({ row }) => <ReviewerScoreCell item={row.original} slot={2} />,
  },
  {
    id: "p3_score",
    header: "P. 3 Score",
    cell: ({ row }) => <ReviewerScoreCell item={row.original} slot={3} />,
  },
  {
    id: "p4_score",
    header: "P. 4 Score",
    cell: ({ row }) => <ReviewerScoreCell item={row.original} slot={4} />,
  },
  {
    accessorKey: "process",
    header: "Process",
    cell: ({ row }) => <ProcessCell item={row.original} />,
  },
  {
    accessorKey: "state",
    header: "Status",
    cell: ({ row }) => <StatusCell item={row.original} />,
  },
  // actions
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];
