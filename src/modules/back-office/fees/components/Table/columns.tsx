import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components";
import { Fee as Entity, MapSymbolCurrency } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useFeeStore } from '../../store/fees.store';
import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';
import { DateClass } from '@/lib';

const NameESCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.nameEs} <br />
    </div>
));

const NameENCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.nameEn}
    </div>
));

const CurrencyCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {MapSymbolCurrency[item.currency]}{" "}{item.amount}
    </div>
));

const SIE_CodeCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.sieCode}
    </div>
));

const DateRangeCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {DateClass.DateToFormat(item.startDate, DateClass.FORMAT_OUTPUT)} - {DateClass.DateToFormat(item.endDate, DateClass.FORMAT_OUTPUT)}
    </div>
));

const DateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {formatDate(item.updatedAt ?? item.createdAt)}
    </div>
));


const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useFeeStore(state => state.openActionModal);

    const handleEdit = useCallback(() => {
        openActionModal(item.id, 'edit');
    }, [item]);

    const handleRemove = useCallback(() => {
        openActionModal(item.id, 'delete');
    }, [item]);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.UPDATE) && (
                    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
                )}
                {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.DELETE) && (
                    <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "nameEs",
        header: "Nombre (ES)",
        cell: ({ row }) => <NameESCell item={row.original} />,
    },
    {
        accessorKey: "nameEn",
        header: "Name (EN)",
        cell: ({ row }) => <NameENCell item={row.original} />,
    },
    {
        accessorKey: "currency",
        header: "Monto",
        cell: ({ row }) => <CurrencyCell item={row.original} />,
    },
    {
        accessorKey: "sieCode",
        header: "Código SIE",
        cell: ({ row }) => <SIE_CodeCell item={row.original} />,
    },
    {
        accessorKey: "startDate",
        header: "Fechas",
        cell: ({ row }) => <DateRangeCell item={row.original}
        />,
    },
    {
        accessorKey: "updatedAt",
        header: "Fecha Actualización",
        cell: ({ row }) => <DateCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];