import React, { useCallback } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components";
import { Speaker as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSpeakerStore } from '../../store/speaker.store';
import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameESCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {/* Foto */}
        <div className='flex gap-1 items-center justify-start'>
            <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={item.photoUrl} alt="Avatar" />
                <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{item.name}</span>
        </div>
        <span className="text-xs text-gray-500 flex items-center justify-start">
            <img src={item.country.icon} alt="country" className='w-4 h-4 mr-1' />
            {item.country.name} - {item.speakerType.nameEs}</span>
    </div>
));

const DateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {formatDate(item.updatedAt ?? item.createdAt)}
    </div>
));


const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useSpeakerStore(state => state.openActionModal);

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
        header: "Nombre",
        cell: ({ row }) => <NameESCell item={row.original} />,
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