import React from 'react';
import { Unit as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from '@/components';
import { cn } from '@/lib/utils';

const NameCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <Badge variant="outline" className='w-fit'>{item.code}</Badge>
        <span className="font-semibold text-base">{item.name}</span>
    </div>
));

const ActiveCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <Badge
        variant={item.isActive ? 'outline' : 'destructive'}
        className={cn('w-fit',
            item.isActive ? 'bg-green-500 text-white hover:bg-opacity-80' : ''
        )}
        >
            {item.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
    </div>
));

const ExistSunatCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-1">
        <Badge
        variant={item.existsInSunat ? 'outline' : 'destructive'}
        className={cn('w-fit',
            item.existsInSunat ? 'bg-blue-500 hover:bg-opacity-80 text-white' : ''
        )}
        >
            {item.existsInSunat ? 'Existe' : 'No existe'}
        </Badge>
    </div>
));

// const ActionsCell = React.memo(({ unit }: { unit: Unit }) => {
//     const dispatch = useDispatch<Dispatch<Action>>();

//     const handleEdit = useCallback(() => {
//         dispatch(updateunitAction(unit));
//     }, [dispatch, unit]);

//     const handleRemove = useCallback(() => {
//         dispatch(deleteunitAction(unit));
//     }, [dispatch, unit]);

//     return (
//         <DropdownMenu modal={false}>
//             <DropdownMenuTrigger>
//                 <MoreHorizontal className="w-5 h-5" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//                 <DropdownMenuLabel>Acciones</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// });

export const columns: ColumnDef<Entity>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <NameCell item={row.original} />,
    },
    {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => <ActiveCell item={row.original} />,
    },
    {
        accessorKey: "existsInSunat",
        header: "Existe en Sunat",
        cell: ({ row }) => <ExistSunatCell item={row.original} />,
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => <ActionsCell unit={row.original} />,
    // },
];