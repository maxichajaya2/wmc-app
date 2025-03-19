import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { Role as Entity, PrimaryRoles } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRoleStore } from '../../store/roles.store';
import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.name}
    </div>
));

const UpdateDateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {formatDate(item.updatedAt ?? item.createdAt)}
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useRoleStore(state => state.openActionModal);

    const handleEdit = useCallback(() => {
        openActionModal(item.id, 'edit');
    }, [item]);

    const handleRemove = useCallback(() => {
        openActionModal(item.id, 'delete');
    }, [item]);

    const handleViewPermissions = useCallback(() => {
        openActionModal(item.id, 'view-permissions');
    }, [item]);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                {!Object.values(PrimaryRoles).includes(item.id as PrimaryRoles) && useCheckPermission(ModulesRoles.ROLES, ActionRoles.UPDATE) && (
                    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
                )}
                {!Object.values(PrimaryRoles).includes(item.id as PrimaryRoles) && useCheckPermission(ModulesRoles.ROLES, ActionRoles.DELETE) && (
                    <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleViewPermissions}>Ver Permisos</DropdownMenuItem>
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
        accessorKey: "updatedAt",
        header: "Fecha Actualización",
        cell: ({ row }) => <UpdateDateCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) =>
            // Object.values(PrimaryRoles).includes(row.original.id as PrimaryRoles) ? null :
            <ActionsCell item={row.original} />,
    },
];