import React, { useCallback } from "react"
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
} from "@/components"
import { type Paper as Entity, MapDocumentType, MapProcessPaper, MapStatePaper, MapTypePaper, ProcessPaper, StatePaper } from "@/models"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, MessageSquare } from "lucide-react"
import { usePaperStore } from "../../store/papers.store"
import { formatDate } from "../../../../../utils/format-date"
import { useCheckPermission } from "@/utils"
import { ActionRoles, ModulesRoles } from "@/constants"

const CorrelativeCell = React.memo(({ item }: { item: Entity }) => <div className="flex flex-col gap-1">{item.correlative || ''}</div>)
const TopicCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">{item.category?.name ?? "Sin asignar"}</div>
        <div className="flex flex-col gap-1">{item.topic?.name ?? "Sin asignar"}</div>
    </div>
))
const TitleCell = React.memo(({ item }: { item: Entity }) => <div className="flex flex-col gap-1">{item.title || ''}</div>)
const NameAndLastNameUserCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.webUser ? (
            <>
                {item.webUser.name} {item.webUser.lastName} <br />
                {item.webUser.email} <br />
                {MapDocumentType[item.webUser.documentType]} {item.webUser.documentNumber}
            </>
        ) : (
            "Sin asignar"
        )}
    </div>
))
const RegisterDateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">{item.receivedDate ? formatDate(item.receivedDate) : "Sin fecha"}</div>
))
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
            "Sin asignar"
        )}
    </div>
))
const TypeAssignedCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {item.type ? (
            <div className="flex flex-col gap-1">
                {MapTypePaper[item.type]}
            </div>
        ) : (
            "Sin asignar"
        )}
    </div>
))
const ApprovePhaseOneDateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">{item.approvedDate ? formatDate(item.approvedDate) : "Sin fecha"}</div>
))
const ApprovePhaseTwoDateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">{item.selectedApprovedDate ? formatDate(item.selectedApprovedDate) : "Sin fecha"}</div>
))

const ProcessCell = React.memo(({ item }: { item: Entity }) => {
    let className = "bg-blue-500 text-white hover:bg-blue-500/80"
    if (item.process === ProcessPaper.SELECCIONADO) {
        className = "bg-green-500 text-white hover:bg-green-500/80 font-extrabold h-6 w-[75px] flex justify-center items-center text-center"
    } else if (item.process === ProcessPaper.PRESELECCIONADO) {
        className = "bg-rose-500 text-white hover:bg-rose-500/80 font-extrabold h-6 w-[75px] flex justify-center items-center text-center"
    }
    const title = (item: Entity) => {
        if (item.process === ProcessPaper.PRESELECCIONADO) {
            return MapProcessPaper[item.process]
        }
        if (item.process === ProcessPaper.SELECCIONADO) {
            return MapProcessPaper[item.process]
        }
        return MapProcessPaper[item.process]
    }

    return (
        <div className="flex flex-col gap-1">
            <Badge className={className}>{title(item)}</Badge>
        </div>
    )
})

const StatusCell = React.memo(({ item }: { item: Entity }) => {
    let className = "bg-blue-500 text-white hover:bg-blue-500/80"
    const receivedDate = item.process === ProcessPaper.PRESELECCIONADO ? (
        item.receivedDate ? formatDate(item.receivedDate) : "Sin fecha"
    ) : (
        item.selectedReceivedDate ? formatDate(item.selectedReceivedDate) : "Sin fecha"
    )
    const assignedDate = item.process === ProcessPaper.PRESELECCIONADO ? (
        item.assignedDate ? formatDate(item.assignedDate) : "Sin fecha"
    ) : (
        item.selectedAssignedDate ? formatDate(item.selectedAssignedDate) : "Sin fecha"
    )
    const reviewedDate = item.process === ProcessPaper.PRESELECCIONADO ? (
        item.reviewedDate ? formatDate(item.reviewedDate) : "Sin fecha"
    ) : (
        item.selectedReviewedDate ? formatDate(item.selectedReviewedDate) : "Sin fecha"
    )
    const approvedDate = item.process === ProcessPaper.PRESELECCIONADO ? (
        item.approvedDate ? formatDate(item.approvedDate) : "Sin fecha"
    ) : (
        item.selectedApprovedDate ? formatDate(item.selectedApprovedDate) : "Sin fecha"
    )
    const dismissedDate = item.process === ProcessPaper.PRESELECCIONADO ? (
        item.dismissedDate ? formatDate(item.dismissedDate) : "Sin fecha"
    ) : (
        item.selectedDismissedDate ? formatDate(item.selectedDismissedDate) : "Sin fecha"
    )
    let tooltipContent = item.receivedDate ? formatDate(item.receivedDate) : "Sin fecha"

    if (item.state === StatePaper.SENT) {
        className = "bg-yellow-500 text-black hover:bg-yellow-500/80"
        tooltipContent = receivedDate
    } else if (item.state === StatePaper.ASSIGNED) {
        className = "bg-orange-500 text-white hover:bg-orange-500/80"
        tooltipContent = assignedDate
    } else if (item.state === StatePaper.UNDER_REVIEW) {
        className = "bg-red-500 text-white hover:bg-red-500/80"
        tooltipContent = reviewedDate
    } else if (item.state === StatePaper.APPROVED) {
        className = "bg-green-500 text-white hover:bg-green-500/80"
        tooltipContent = approvedDate
    } else if (item.state === StatePaper.DISMISSED) {
        className = "bg-gray-500 text-white hover:bg-gray-500/80"
        tooltipContent = dismissedDate
    }

    const title = (item: Entity) => {
        if (item.state === StatePaper.APPROVED) {
            if (item.process === ProcessPaper.PRESELECCIONADO) {
                return "Preseleccionado"
            }
            if (item.process === ProcessPaper.SELECCIONADO) {
                return "Seleccionado"
            }
        } else {
            return MapStatePaper[item.state]
        }
    }

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
    )
})

const Phase1ScoreFinalCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {item.phase1Score ? (
            <div className="flex flex-col gap-1">
                {item.phase1Score}
            </div>
        ) : (
            "--"
        )}
    </div>
))

const Phase2ScoreFinalCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {item.phase2Score ? (
            <div className="flex flex-col gap-1">
                {item.phase2Score}
            </div>
        ) : (
            "--"
        )}
    </div>
))

const ButtonView = React.memo(({ item }: { item: Entity }) => {
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleEdit = useCallback(() => {
        openActionModal(item.id, "view")
    }, [item, openActionModal])
    return (
        <DropdownMenuItem onClick={handleEdit}>
            Ver
        </DropdownMenuItem>
    )
})

const ButtonEdit = React.memo(({ item }: { item: Entity }) => {
    const canEdit = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.UPDATE)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleEdit = useCallback(() => {
        openActionModal(item.id, "edit")
    }, [item, openActionModal])

    if (!canEdit) return null

    return (
        <DropdownMenuItem onClick={handleEdit}>
            Editar
        </DropdownMenuItem>
    )
})

const ButtonDelete = React.memo(({ item }: { item: Entity }) => {
    const canDelete = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.DELETE)
    const openActionModal = usePaperStore((state) => state.openActionModal)
    const handleDelete = useCallback(() => {
        openActionModal(item.id, "delete")
    }, [item, openActionModal])

    if (!canDelete) return null

    return (
        <DropdownMenuItem onClick={handleDelete}>
            Eliminar
        </DropdownMenuItem>
    )
});

const ButtonSendToLeader = React.memo(({ item }: { item: Entity }) => {
    const canSendToLeader = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.SEND_TO_LEADER)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleSend = useCallback(() => {
        openActionModal(item.id, "send-paper")
    }, [item, openActionModal])

    if (!canSendToLeader || item.state !== StatePaper.RECEIVED) return null

    return (
        <DropdownMenuItem onClick={handleSend}>Enviar Líder</DropdownMenuItem>
    )
})

const ButtonSendToReviewer = React.memo(({ item }: { item: Entity }) => {
    const canSendToReviewer = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.SEND_TO_REVIEWER)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleAssign = useCallback(() => {
        openActionModal(item.id, "assign-paper")
    }, [item, openActionModal])

    if (!canSendToReviewer || item.state !== StatePaper.SENT) return null

    return (
        <DropdownMenuItem onClick={handleAssign}>Asignar</DropdownMenuItem>
    )
})

const ButtonReview = React.memo(({ item }: { item: Entity }) => {
    const canReview = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.IN_REVIEW)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleReview = useCallback(() => {
        openActionModal(item.id, "review-paper")
    }, [item, openActionModal])

    if (!canReview || item.state !== StatePaper.ASSIGNED) return null

    return (
        <DropdownMenuItem onClick={handleReview}>En revisión</DropdownMenuItem>
    )
})

const ButtonRate = React.memo(({ item }: { item: Entity }) => {
    const canReview = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.IN_REVIEW)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleReview = useCallback(() => {
        openActionModal(item.id, "rate-paper")
    }, [item, openActionModal])

    if (!canReview || item.state !== StatePaper.UNDER_REVIEW
        // || Comentamos esto para que puedan seguir calificando
        // (item.process === ProcessPaper.PRESELECCIONADO && item.phase1Score) ||
        // (item.process === ProcessPaper.SELECCIONADO && item.phase2Score)
    ) return null

    return (
        <DropdownMenuItem onClick={handleReview}>Puntuación</DropdownMenuItem>
    )
})

const ButtonApprove = React.memo(({ item }: { item: Entity }) => {
    const canApprove = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.APPROVED)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleApprove = useCallback(() => {
        openActionModal(item.id, "approve-paper")
    }, [item, openActionModal])

    if (!canApprove || item.state !== StatePaper.UNDER_REVIEW
        || (item.process === ProcessPaper.PRESELECCIONADO && !item.phase1Score)
        || (item.process === ProcessPaper.SELECCIONADO && !item.phase2Score)
    ) return null

    return (
        <DropdownMenuItem onClick={handleApprove}>
            {item.process === ProcessPaper.PRESELECCIONADO ? "Preseleccionar" : "Aprobar"}
        </DropdownMenuItem>
    )
})

const ButtonViewComments = React.memo(({ item }: { item: Entity }) => {
    const { openCommentsDialog, setSelected } = usePaperStore((state) => ({
        openCommentsDialog: state.openCommentsDialog,
        setSelected: state.setSelected,
    }))
    const handleViewComments = useCallback(() => {
        openCommentsDialog(item.id)
        setSelected(item)
    }, [item, openCommentsDialog])

    return (
        <DropdownMenuItem onClick={handleViewComments}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ver comentarios
        </DropdownMenuItem>
    )
})

const ButtonDismiss = React.memo(({ item }: { item: Entity }) => {
    const canDismiss = useCheckPermission(ModulesRoles.TECHINICAL_WORKS, ActionRoles.DISMISS)
    const { openActionModal } = usePaperStore((state) => ({
        openActionModal: state.openActionModal,
    }))
    const handleDismiss = useCallback(() => {
        openActionModal(item.id, "dismiss-paper")
    }, [item, openActionModal])

    if (!canDismiss || item.state === StatePaper.DISMISSED || item.state === StatePaper.APPROVED) return null

    return (
        <DropdownMenuItem onClick={handleDismiss}>Desestimar</DropdownMenuItem>
    )
})


const ActionsCell = React.memo(({ item }: { item: Entity }) => {

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ButtonView item={item} />
                <ButtonEdit item={item} />
                <ButtonDelete item={item} />
                <ButtonSendToLeader item={item} />
                <ButtonSendToReviewer item={item} />
                <ButtonReview item={item} />
                <ButtonRate item={item} />
                <ButtonApprove item={item} />
                <ButtonViewComments item={item} />
                <ButtonDismiss item={item} />
                {/* DEV
                    <DropdownMenuItem onClick={handleReceipt}>Recibir</DropdownMenuItem> */}

            </DropdownMenuContent>
        </DropdownMenu>
    )
})

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "correlative",
        header: "Nro",
        cell: ({ row }) => <CorrelativeCell item={row.original} />,
    },
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => <TopicCell item={row.original} />,
    },
    {
        accessorKey: "title",
        header: "Titulo",
        cell: ({ row }) => <TitleCell item={row.original} />,
    },
    {
        accessorKey: "userName",
        header: "Nombres",
        cell: ({ row }) => <NameAndLastNameUserCell item={row.original} />,
    },
    {
        accessorKey: "registeredDate",
        header: "F. Enviado",
        cell: ({ row }) => <RegisterDateCell item={row.original} />,
    },
    {
        accessorKey: "reviewerUser",
        header: "Revisor",
        cell: ({ row }) => <ReviewerAssignedCell item={row.original} />,
    },
    {
        accessorKey: "approvedDate",
        header: "F. Preselecc.",
        cell: ({ row }) => <ApprovePhaseOneDateCell item={row.original} />,
    },
    {
        accessorKey: "selectedApprovedDate",
        header: "F. Selecc.",
        cell: ({ row }) => <ApprovePhaseTwoDateCell item={row.original} />,
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <TypeAssignedCell item={row.original} />,
    },
    {
        accessorKey: "phase1Score",
        header: "Puntuación Fase 1",
        cell: ({ row }) => <Phase1ScoreFinalCell item={row.original} />,
    },
    {
        accessorKey: "phase2Score",
        header: "Puntuación Fase 2",
        cell: ({ row }) => <Phase2ScoreFinalCell item={row.original} />,
    },
    {
        accessorKey: "process",
        header: "Proceso",
        cell: ({ row }) => <ProcessCell item={row.original} />,
    },
    {
        accessorKey: "state",
        header: "Estado",
        cell: ({ row }) => <StatusCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
]

