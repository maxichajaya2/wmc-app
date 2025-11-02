import React, { useCallback } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useUsersStore } from '../../store/users.store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';
import { User as Entity } from '@/models';

const UserCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <span className="font-semibold text-base">{item.name}</span>
        <span className="font-light text-sm">{item.email}</span>
    </div>
));
const CategoryCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.category?.name || ''}
    </div>
));
const PersonRolCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col">
        <span className="font-light text-sm">{item.role.name}</span>
    </div>
));

// const IsActiveCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-1">
//         <span className="font-semibold text-base">{item.isActive ? 'Activo' : 'Inactivo'}</span>
//     </div>
// ));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openUserActionModal = useUsersStore(state => state.openActionModal)

    const handleEdit = useCallback(() => {
        openUserActionModal(item.id, 'edit');
    }, [item]);

    const handleRemove = useCallback(() => {
        openUserActionModal(item.id, 'delete');
    }, [item]);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                {useCheckPermission(ModulesRoles.USERS, ActionRoles.UPDATE) && (
                    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
                )}
                {useCheckPermission(ModulesRoles.USERS, ActionRoles.DELETE) && (
                    <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "username",
        header: "Usuario",
        cell: ({ row }) => <UserCell item={row.original} />,
    },
    {
        accessorKey: "roleName",
        header: "Rol",
        cell: ({ row }) => <PersonRolCell item={row.original} />,
    },
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => <CategoryCell item={row.original
        } />,
    },
    // {
    //     accessorKey: "isActive",
    //     header: "Estado",
    //     cell: ({ row }) => <IsActiveCell item={row.original} />,
    // },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];