import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components";
import { Topic as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTopicStore } from '../../store/topic.store';
import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.name}
    </div>
));
const CategoryCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.category?.name || ''}
    </div>
));
const DateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {formatDate(item.updatedAt ?? item.createdAt)}
    </div>
));


const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useTopicStore(state => state.openActionModal);
    // const openActionModalUsers = useTopicStore(state => state.openActionModalUsers);

    const handleEdit = useCallback(() => {
        openActionModal(item.id, 'edit');
    }, [item]);

    const handleRemove = useCallback(() => {
        openActionModal(item.id, 'delete');
    }, [item]);

    // const handleReviewers = useCallback(() => {
    //     openActionModalUsers(item.id, 'view-reviewers');
    // }, [item]);



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
        accessorKey: "title",
        header: "Nombre",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => <CategoryCell item={row.original
        } />,
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