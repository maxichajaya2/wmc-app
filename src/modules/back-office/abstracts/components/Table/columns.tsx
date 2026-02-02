import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components";
import { Abstract as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useAbstractStore } from '../../store/abstract.store';
// import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const CodigoCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.codigo}
    </div>
));

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.name}
    </div>
));

const LastNameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.lastname}
    </div>
));

const EmailCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.email}
    </div>
));

const TitleCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.title}
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useAbstractStore(state => state.openActionModal);
    // const openActionModalUsers = useAbstractStore(state => state.openActionModalUsers);

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
                {useCheckPermission(ModulesRoles.TOPICS, ActionRoles.UPDATE) && (
                    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
                )}
                {useCheckPermission(ModulesRoles.TOPICS, ActionRoles.DELETE) && (
                    <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
                )}

                {/* <DropdownMenuItem onClick={handleReviewers}>Revisores</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

export const columns: ColumnDef<Entity>[] = [
   {
        accessorKey: "codigo",
        header: "Código",
        cell: ({ row }) => <CodigoCell item={row.original
        } />,
   },
    {   
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    {
        accessorKey: "lastname",
        header: "Apellido",
        cell: ({ row }) => <LastNameCell item={row.original} />,
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({ row }) => <EmailCell item={row.original} />,
    },
    {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => <TitleCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];