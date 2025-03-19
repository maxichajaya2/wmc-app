import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components";
import { DocumentType, Customer as Entity, MapDocumentType } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Contact, MoreHorizontal, Phone } from "lucide-react";
import { useCustomersStore } from '../../store/customers.store';
import { useCheckPermission } from '@/utils';
import { ActionRoles, ModulesRoles } from '@/constants';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        {item.person.documentType === DocumentType.DNI ? item.person.givenNames + ' ' + item.person.lastName : item.person.legalName}
    </div>
));

const PersonDataCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        <div className='flex flex-row gap-2 items-start'>
            <Contact className="w-4 h-4 mt-1" />
            <div className='flex flex-col'>
                <span className="font-medium text-sm">{MapDocumentType[item.person.documentType]}</span>
                <span className="font-light text-sm">{item.person.documentNumber}</span>
            </div>
        </div>
        <div className='flex flex-row gap-2 items-center'>
            <Phone className="w-4 h-4" />
            <span className="font-light text-sm">{item.person.phone}</span>
        </div>
    </div>
));

const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = useCustomersStore(state => state.openActionModal);

    // const handleEdit = useCallback(() => {
    //     openActionModal(item.id, 'edit');
    // }, [item]);

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
                {/* {useCheckPermission(ModulesRoles.DASHBOARD, ActionRoles.UPDATE) && (
                    <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
                )} */}
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
    {
        accessorKey: "person",
        header: "Datos",
        cell: ({ row }) => <PersonDataCell item={row.original} />,
    },
    // actions
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];