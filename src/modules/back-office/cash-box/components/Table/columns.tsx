import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { CashBox as Entity, MapCashBoxStatus } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useCashBoxesStore } from '../../store/cash-boxes.store';
import { cn } from '@/lib/utils';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <span className="font-semibold text-base">{item.name}</span>
    </div>
));

const StatusCell = React.memo(({ item }: { item: Entity }) => {
    return (
        <div className="flex items-center gap-1">
            <span className={cn(
                "text-sm font-semibold text-white dark:text-white px-2 py-1 rounded-md",
                item.status === "open" ? "bg-green-500" : "bg-red-500"
            )}>
                {MapCashBoxStatus[item.status]}
            </span>
        </div>
    );
})

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useCashBoxesStore(state => state.openActionModal);
    const openActionModalChangeStatus = useCashBoxesStore(state => state.openActionModalChangeStatus);

    const handleEdit = useCallback(() => {
        openActionModal(item.id, 'edit');
    }, [item]);

    const handleRemove = useCallback(() => {
        openActionModal(item.id, 'delete');
    }, [item]);

    const handleChangeStatus = useCallback(() => {
        openActionModalChangeStatus(item.id);
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
                {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.CHANGE_STATUS_CASHBOX) && (
                    <DropdownMenuItem onClick={handleChangeStatus}>Cambiar Estado</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <StatusCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];