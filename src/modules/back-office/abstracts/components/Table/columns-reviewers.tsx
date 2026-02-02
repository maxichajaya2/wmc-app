import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { UserWeb as Entity, MapDocumentType } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useAbstractStore } from '../../store/abstract.store';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.name}
    </div>
));
const LastNameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.lastName}
    </div>
));
const DocumentNumberCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {MapDocumentType[item.documentType]} {item.documentNumber}
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const selected = useAbstractStore(state => state.selected);
    const openActionModal = useAbstractStore(state => state.openActionModal);
    const setSelectedReviewer = useAbstractStore(state => state.setSelectedReviewer);

    const handleRemove = useCallback(() => {
        if (!selected) return;
        setSelectedReviewer(item);
        openActionModal(selected.id, 'delete-reviewer');
    }, [item]);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "name",
        header: "Nombres",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    {
        accessorKey: "lastName",
        header: "Apellidos",
        cell: ({ row }) => <LastNameCell item={row.original} />,
    },
    {
        accessorKey: "document",
        header: "Documento",
        cell: ({ row }) => <DocumentNumberCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];