import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { Gallery as Entity, MapGalleryType } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useGalleryStore } from '../../store/gallery.store';
import { formatDate } from '../../../../../utils/format-date';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const TitleEsCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.titleEs}
    </div>
));
const TitleEnCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.titleEn}
    </div>
));
const UrlKeyCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.urlKey}
    </div>
));
const UpdateDateCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {formatDate(item.updatedAt ?? item.createdAt)}
    </div>
));
const TypeCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {MapGalleryType[item.type]}
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useGalleryStore(state => state.openActionModal);

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
        accessorKey: "titleEs",
        header: "Titulo ES",
        cell: ({ row }) => <TitleEsCell item={row.original} />,
    },
    {
        accessorKey: "titleEn",
        header: "Titulo EN",
        cell: ({ row }) => <TitleEnCell item={row.original} />,
    },
    {
        accessorKey: "urlKey",
        header: "URL Key",
        cell: ({ row }) => <UrlKeyCell item={row.original} />,
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <TypeCell item={row.original} />,
    },
    {
        accessorKey: "updatedAt",
        header: "Fecha Actualización",
        cell: ({ row }) => <UpdateDateCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];