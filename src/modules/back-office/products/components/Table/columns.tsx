import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { Product as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useProductsStore } from '../../store/products.store';
import { formatPrice } from '../../../../../utils/price';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <span className="font-semibold text-base">{item.name}</span>
        <span className="text-sm text-gray-500">{item.code}</span>
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useProductsStore(state => state.openActionModal);

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
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    // description
    {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => <span>{row.original.description}</span>,
    },
    // purchasePrice
    {
        accessorKey: "purchasePrice",
        header: "Precio de compra",
        cell: ({ row }) => <span>{formatPrice(row.original.purchasePrice)}</span>,
    },
    // salePrice
    {
        accessorKey: "salePrice",
        header: "Precio de venta",
        cell: ({ row }) => <span>{formatPrice(row.original.salePrice)}</span>,
    },
    // stock
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => <span>{row.original.stock}</span>,
    },
    // category
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => <span>{row.original.category.name}</span>,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];