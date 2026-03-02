import React, { useCallback, useMemo } from "react";
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
  MapProcessPaper,
  MapStatePaperForUser,
  MapTypePaper,
  ProcessPaper,
  StatePaper,
} from "@/models";
import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";

import { usePaperStore } from "../../store/papers.store";
import { formatDate } from "../../../../../utils/format-date";

import dayjs from "dayjs";
// import utc from 'dayjs-plugin-utc';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// Configurar los plugins de Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CorrelativeCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">{item.correlative || ""}</div>
));
// const TopicCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-1">
//         <div className="flex flex-col gap-1">{item.category?.name ?? "Not assigned"}</div>
//         <div className="flex flex-col gap-1">{item.topic?.name ?? "Not assigned"}</div>
//     </div>
// ))
const TitleCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-1">{item.title || ""}</div>
));
const NameAndLastNameUserCell = React.memo(({ item }: { item: Entity }) => {
  const author = item.author;
  return (
    <div className="flex flex-col gap-1">
      {item.webUser ? (
        <>
          {author?.name} {author?.middle} {author?.last} <br />
          {author?.email} <br />
          {author?.remissive} {author?.institution}
        </>
      ) : (
        "Not assigned"
      )}
    </div>
  );
});
const CreationDateCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.createdAt ? formatDate(item.createdAt) : "Sin fecha"}
  </div>
));
const TypeAssignedCell = React.memo(({ item }: { item: Entity }) => (
  <div className="flex flex-col gap-2">
    {item.type ? (
      <div className="flex flex-col gap-1">{MapTypePaper[item.type]}</div>
    ) : (
      "Not assigned"
    )}
  </div>
));
// const ApproveDateCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-2">{item.approvedDate ? formatDate(item.approvedDate) : "Sin fecha"}</div>
// ))

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
        : "Sin fecha"
      : item.selectedReceivedDate
        ? formatDate(item.selectedReceivedDate)
        : "Sin fecha";
  const assignedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.assignedDate
        ? formatDate(item.assignedDate)
        : "Sin fecha"
      : item.selectedAssignedDate
        ? formatDate(item.selectedAssignedDate)
        : "Sin fecha";
  const reviewedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.reviewedDate
        ? formatDate(item.reviewedDate)
        : "Sin fecha"
      : item.selectedReviewedDate
        ? formatDate(item.selectedReviewedDate)
        : "Sin fecha";
  const approvedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.approvedDate
        ? formatDate(item.approvedDate)
        : "Sin fecha"
      : item.selectedApprovedDate
        ? formatDate(item.selectedApprovedDate)
        : "Sin fecha";
  const dismissedDate =
    item.process === ProcessPaper.PRESELECCIONADO
      ? item.dismissedDate
        ? formatDate(item.dismissedDate)
        : "Sin fecha"
      : item.selectedDismissedDate
        ? formatDate(item.selectedDismissedDate)
        : "Sin fecha";
  let tooltipContent = item.receivedDate
    ? formatDate(item.receivedDate)
    : "Sin fecha";

  // if (item.state === StatePaper.SENT) {
  //     className = "bg-yellow-500 text-black hover:bg-yellow-500/80"
  //     tooltipContent = receivedDate
  // } else if (item.state === StatePaper.ASSIGNED) {
  //     className = "bg-orange-500 text-white hover:bg-orange-500/80"
  //     tooltipContent = assignedDate
  // } else if (item.state === StatePaper.UNDER_REVIEW) {
  //     className = "bg-red-500 text-white hover:bg-red-500/80"
  //     tooltipContent = reviewedDate
  // } else if (item.state === StatePaper.APPROVED) {
  //     className = "bg-green-500 text-white hover:bg-green-500/80"
  //     tooltipContent = approvedDate
  // } else if (item.state === StatePaper.DISMISSED) {
  //     className = "bg-gray-500 text-white hover:bg-gray-500/80"
  //     tooltipContent = dismissedDate
  // }

  if (item.state === StatePaper.REGISTERED) {
    className = "bg-gray-400 text-white hover:bg-gray-400/80"; // Pending Submission
  } else if (item.state === StatePaper.RECEIVED) {
    className = "bg-sky-600 text-white hover:bg-sky-600/80"; // Submitted
  } else if (item.state === StatePaper.SENT) {
    className = "bg-yellow-500 text-black hover:bg-yellow-500/80";
    tooltipContent = receivedDate;
  } else if (item.state === StatePaper.ASSIGNED) {
    className = "bg-orange-500 text-white hover:bg-orange-500/80";
    tooltipContent = assignedDate;
  } else if (item.state === StatePaper.UNDER_REVIEW) {
    className = "bg-red-500 text-white hover:bg-red-500/80";
    tooltipContent = reviewedDate;
  } else if (item.state === StatePaper.APPROVED) {
    className = "bg-green-600 text-white hover:bg-green-600/80";
    tooltipContent = approvedDate;
  } else if (item.state === StatePaper.DISMISSED) {
    className = "bg-gray-600 text-white hover:bg-gray-600/80";
    tooltipContent = dismissedDate;
  } else if (item.state === StatePaper.OBSERVED) {
    className = "bg-red-600 text-white hover:bg-red-600/80";
    tooltipContent =
      "Observed on " +
      (item.reviewedDate ? formatDate(item.reviewedDate) : "Sin fecha");
  } else if (item.state === StatePaper.SUBSANATED) {
    className = "bg-blue-600 text-white hover:bg-blue-600/80";
    tooltipContent =
      "Subsanated on " +
      (item.reviewedDate ? formatDate(item.reviewedDate) : "Sin fecha");
  }

  const title = (item: Entity) => {
    if (item.state === StatePaper.APPROVED) {
      if (item.process === ProcessPaper.PRESELECCIONADO) {
        // return "Preseleccionado";
        return "PRESELECTED";
      }
      if (item.process === ProcessPaper.SELECCIONADO) {
        // return "Seleccionado";
        return "SELECTED";
      }
    } else {
      return MapStatePaperForUser[item.state];
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

// const Phase1ScoreFinalCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-2">
//         {item.phase1Score ? (
//             <div className="flex flex-col gap-1">
//                 {item.phase1Score}
//             </div>
//         ) : (
//             "--"
//         )}
//     </div>
// ))

// const Phase2ScoreFinalCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-2">
//         {item.phase2Score ? (
//             <div className="flex flex-col gap-1">
//                 {item.phase2Score}
//             </div>
//         ) : (
//             "--"
//         )}
//     </div>
// ))

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
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleEdit = useCallback(() => {
    openActionModal(item.id, "edit");
  }, [item, openActionModal]);

  // if (item.state !== StatePaper.REGISTERED) return null;
  if (
    item.state !== StatePaper.REGISTERED &&
    item.state !== StatePaper.RECEIVED &&
    item.state == StatePaper.OBSERVED // <--- AGREGAR ESTO
  )
    return <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>;
});

const ButtonSend = React.memo(({ item }: { item: Entity }) => {
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleSend = useCallback(() => {
    openActionModal(item.id, "receive-paper");
  }, [item, openActionModal]);

  if (
    item.state === StatePaper.REGISTERED ||
    (item.process === ProcessPaper.PRESELECCIONADO &&
      item.state === StatePaper.APPROVED &&
      item.fullFileUrl)
  ) {
    return <DropdownMenuItem onClick={handleSend}>Submit</DropdownMenuItem>;
  } else {
    null;
  }
});

const ButtonChargeCompleteArchive = React.memo(({ item }: { item: Entity }) => {
  const { openActionModal } = usePaperStore((state) => ({
    openActionModal: state.openActionModal,
  }));
  const handleChargeCompleteArchive = useCallback(() => {
    openActionModal(item.id, "charge-complete-archive");
  }, [item, openActionModal]);

  if (
    item.process === ProcessPaper.PRESELECCIONADO &&
    item.state === StatePaper.APPROVED &&
    !item.fullFileUrl
  ) {
    return (
      <DropdownMenuItem onClick={handleChargeCompleteArchive}>
        Upload Complete Work
      </DropdownMenuItem>
    );
  } else {
    null;
  }
});

const ButtonViewComments = React.memo(({ item }: { item: Entity }) => {
  const { openCommentsDialog, setSelected } = usePaperStore((state) => ({
    openCommentsDialog: state.openCommentsDialog,
    setSelected: state.setSelected,
  }));
  const handleViewComments = useCallback(() => {
    openCommentsDialog(item.id);
    setSelected(item);
  }, [item, openCommentsDialog]);

  return (
    <DropdownMenuItem onClick={handleViewComments}>
      <MessageSquare className="mr-2 h-4 w-4" />
      View Comments
    </DropdownMenuItem>
  );
});

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
  const limitDatePhaseOne = usePaperStore((state) => state.limitDatePhaseOne);
  const limitDatePhaseTwo = usePaperStore((state) => state.limitDatePhaseTwo);

  const currentDate = dayjs().startOf("day");
  const endDate = useMemo(() => {
    if (!limitDatePhaseOne) return dayjs().startOf("day");
    return dayjs.tz(limitDatePhaseOne, "America/Lima").startOf("day");
  }, [limitDatePhaseOne]);
  const isValidDate: boolean = useMemo(() => {
    return currentDate.isSameOrBefore(endDate);
  }, [currentDate, endDate]);
  const isValidDatePhaseTwo: boolean = useMemo(() => {
    if (!limitDatePhaseTwo) return false;
    const endDatePhaseTwo = dayjs
      .tz(limitDatePhaseTwo, "America/Lima")
      .startOf("day");
    return currentDate.isSameOrBefore(endDatePhaseTwo);
  }, [currentDate, limitDatePhaseTwo]);

  return (
    <DropdownMenu modal={false}>
      {/* <DropdownMenuTrigger>
        <div className="px-3 py-1 text-white rounded-full text-xs font-bold cursor-pointer hover:opacity-90 animate-glow">
          ACTIONS
        </div>
      </DropdownMenuTrigger> */}
      <DropdownMenuTrigger>
        {item.state === StatePaper.RECEIVED ? (
          // 👉 BOTÓN PLATEADO SI YA FUE ENVIADO
          <div className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-bold cursor-pointer">
            ACTIONS
          </div>
        ) : (
          // 👉 BOTÓN ANIMADO SI NO SE HA ENVIADO
          <div className="px-3 py-1 text-white rounded-full text-xs font-bold cursor-pointer hover:opacity-90 animate-glow">
            ACTIONS
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ButtonView item={item} />
        {(isValidDate ||
          (isValidDatePhaseTwo &&
            item.process === ProcessPaper.PRESELECCIONADO &&
            item.state === StatePaper.APPROVED)) && <ButtonEdit item={item} />}
        <ButtonChargeCompleteArchive item={item} />
        {(isValidDate || isValidDatePhaseTwo) && <ButtonSend item={item} />}
        <ButtonViewComments item={item} />
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
  // {
  //     accessorKey: "category",
  //     header: "Categoría",
  //     cell: ({ row }) => <TopicCell item={row.original} />,
  // },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <TitleCell item={row.original} />,
  },
  {
    accessorKey: "userName",
    header: "Author(s)",
    cell: ({ row }) => <NameAndLastNameUserCell item={row.original} />,
  },
  {
    accessorKey: "registeredDate",
    header: "Submission Date",
    cell: ({ row }) => <CreationDateCell item={row.original} />,
  },
  // {
  //     accessorKey: "phase1Score",
  //     header: "Puntuación Fase 1",
  //     cell: ({ row }) => <Phase1ScoreFinalCell item={row.original} />,
  // },
  // {
  //     accessorKey: "phase2Score",
  //     header: "Puntuación Fase 2",
  //     cell: ({ row }) => <Phase2ScoreFinalCell item={row.original} />,
  // },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeAssignedCell item={row.original} />,
  },
  {
    accessorKey: "process",
    header: "Stage",
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
