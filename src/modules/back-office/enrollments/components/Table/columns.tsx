"use client"

import React, { useCallback } from "react"
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components"
import {
    type Enrollment as Entity,
    MapPaymentStatus,
    MapRegistrationStatus,
    PaymentStatus,
    MapDocumentType,
    MapCurrency,
    MapPaymentMethodEnrollMent
} from "@/models/"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, CreditCard, Send } from "lucide-react"
import { useEnrollmentStore } from "../../store/enrollments.store"
import { formatDate } from "@/utils/format-date"

const UserInfoCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <div className="font-medium">
            {item.name} {item.paternalName} {item.maternalName}
        </div>
        <div className="text-sm text-muted-foreground">
            {MapDocumentType[item.documentType]}: {item.documentNumber}
        </div>
        <div className="text-sm text-muted-foreground">{item.email}</div>
    </div>
))

const CourseInfoCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <div className="font-medium">{item.fee?.course?.nameEs || "N/A"}</div>
        <div className="font-medium">{item.fee?.nameEs || "N/A"}</div>
        <div className="text-sm text-muted-foreground">
            {MapCurrency[item.fee?.currency]} {item.fee?.amount}
        </div>
    </div>
))

const LocationInfoCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <div className="text-sm">{item.department?.name || "N/A"}</div>
        <div className="text-sm">{item.province?.name || "N/A"}</div>
        <div className="text-sm">{item.district?.name || "N/A"}</div>
    </div>
))

const PaymentStatusCell = React.memo(({ item }: { item: Entity }) => {
    let className = "bg-red-500 text-white hover:bg-red-500/80"

    if (item.paymentStatus === PaymentStatus.SUCCESS) {
        className = "bg-green-500 text-white hover:bg-green-500/80"
    } else if (item.paymentStatus === PaymentStatus.PENDING) {
        className = "bg-yellow-500 text-black hover:bg-yellow-500/80"
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">{MapPaymentMethodEnrollMent[item.paymentMethod]}</div>
            <Badge className={className}>{MapPaymentStatus[item.paymentStatus as PaymentStatus] || "Desconocido"}</Badge>
        </div>
    )
})

const RegistrationStatusCell = React.memo(({ item }: { item: Entity }) => {
    let className = "bg-blue-500 text-white hover:bg-blue-500/80"

    if (item.registrationStatus === 1) {
        className = "bg-green-500 text-white hover:bg-green-500/80"
    } else if (item.registrationStatus === 9) {
        className = "bg-red-500 text-white hover:bg-red-500/80"
    }

    return (
        <div className="flex flex-col gap-1">
            <Badge className={className}>{MapRegistrationStatus[item.registrationStatus] || "Desconocido"}</Badge>
            {item.registrationNumber && <div className="text-sm font-medium">Código: {item.registrationNumber}</div>}
        </div>
    )
})

const DateInfoCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <div className="text-sm">{formatDate(item.createdAt)}</div>
    </div>
))

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const { openActionModal, openPaymentStatusDialog, openSieDialog } = useEnrollmentStore((state) => ({
        openActionModal: state.openActionModal,
        openPaymentStatusDialog: state.openPaymentStatusDialog,
        openSieDialog: state.openSieDialog,
    }))

    const handleView = useCallback(() => {
        openActionModal(item.id, "view")
    }, [item, openActionModal])

    const handleChangePaymentStatus = useCallback(() => {
        openPaymentStatusDialog(item.id)
    }, [item, openPaymentStatusDialog])

    const handleSendToSie = useCallback(() => {
        openSieDialog(item.id)
    }, [item, openSieDialog])

    // Only show "Send to SIE" button when payment status is SUCCESS (1)
    const showSendToSieButton = item.paymentStatus === PaymentStatus.SUCCESS

    return (
        <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={100}>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleView}
                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ver detalles</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleChangePaymentStatus}
                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span className="sr-only">Cambiar estado de pago</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Cambiar estado de pago</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {showSendToSieButton && (
                <TooltipProvider delayDuration={100}>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleSendToSie}
                                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Enviar a SIE</span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Enviar a SIE</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    )
})

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "user",
        header: "Usuario",
        cell: ({ row }) => <UserInfoCell item={row.original} />,
    },
    {
        accessorKey: "course",
        header: "Curso",
        cell: ({ row }) => <CourseInfoCell item={row.original} />,
    },
    {
        accessorKey: "location",
        header: "Ubicación",
        cell: ({ row }) => <LocationInfoCell item={row.original} />,
    },
    {
        accessorKey: "paymentStatus",
        header: "Estado de Pago",
        cell: ({ row }) => <PaymentStatusCell item={row.original} />,
    },
    {
        accessorKey: "registrationStatus",
        header: "Estado de Registro",
        cell: ({ row }) => <RegistrationStatusCell item={row.original} />,
    },
    {
        accessorKey: "createdAt",
        header: "Fecha de Registro",
        cell: ({ row }) => <DateInfoCell item={row.original} />,
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
]

