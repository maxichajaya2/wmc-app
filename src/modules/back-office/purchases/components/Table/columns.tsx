import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components";
import { Purchase as Entity, MapPaymentMethod } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShoppingBag } from "lucide-react";
import { usePurchasesStore } from '../../store/purchase.store';

// Nombre de la persona
// const NameCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-1">
//         <span className="font-semibold text-base">{item.person.givenNames} {item.person.lastName}</span>
//     </div>
// ));

// Datos de contacto de la persona
// const PersonDataCell = React.memo(({ item }: { item: Entity }) => (
//     <div className="flex flex-col gap-2">
//         <div className='flex flex-row gap-2 items-start'>
//             <Contact className="w-4 h-4 mt-1" />
//             <div className='flex flex-col'>
//                 <span className="font-medium text-sm">{MapDocumentType[item.person.documentType]}</span>
//                 <span className="font-light text-sm">{item.person.documentNumber}</span>
//             </div>
//         </div>
//         <div className='flex flex-row gap-2 items-center'>
//             <Phone className="w-4 h-4" />
//             <span className="font-light text-sm">{item.person.phone}</span>
//         </div>
//     </div>
// ));

// Información de productos vendidos
const ProductsCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {item.data.items.map((product, index) => (
            <div key={index} className="flex flex-row gap-2 items-start">
                <ShoppingBag className="w-4 h-4 mt-1" />
                <div className="flex flex-col">
                    <span className="font-medium text-sm">Producto ID: {product.productId}</span>
                    <span className="font-light text-sm">Cantidad: {product.quantity}</span>
                    <span className="font-light text-sm">Precio: S/ {product.purchasePrice}</span>
                </div>
            </div>
        ))}
    </div>
));

// Información del total de la venta
const TotalCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-row gap-2 items-center">
        <span className="font-medium text-base">S/ {item.data.total}</span>
    </div>
));

// Método de pago
const PaymentMethodCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-col gap-2">
        {item.data.paymentItems?.map((payment, index) => (
            <div key={index} className="flex flex-row gap-2 items-center">
                <span className="font-medium text-sm">{MapPaymentMethod[payment.paymentMethod as keyof typeof MapPaymentMethod]}</span>
                <span className="font-light text-sm">S/ {payment.amount}</span>
            </div>
        ))}
    </div>
));

// Acciones sobre la venta
const ActionsCell = React.memo(({ item }: { item: Entity }) => {
    const openActionModal = usePurchasesStore(state => state.openActionModal);

    // const handleEdit = useCallback(() => {
    //     openActionModal(item.id, 'edit');
    // }, [item, openActionModal]);

    // const handleRemove = useCallback(() => {
    //     openActionModal(item.id, 'delete');
    // }, [item, openActionModal]);

    const handleDetail = useCallback(() => {
        openActionModal(item.id, 'view');
    }, [item, openActionModal])

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleDetail}>Ver detalle</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleRemove}>Eliminar</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

// Definición de las columnas con más información
export const columns: ColumnDef<Entity>[] = [
    // {
    //     accessorKey: "id",
    //     header: "Identificador",
    //     cell: ({ row }) => <span>{row.original.id}</span>,
    // },
    // {
    //     accessorKey: "person",
    //     header: "Datos",
    //     cell: ({ row }) => <PersonDataCell item={row.original} />,
    // },
    /* Numero de fila */
    {
        accessorKey: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
        accessorKey: "products",
        header: "Productos Comprados",
        cell: ({ row }) => <ProductsCell item={row.original} />,
    },
    {
        accessorKey: "total",
        header: "Total Compra",
        cell: ({ row }) => <TotalCell item={row.original} />,
    },
    {
        accessorKey: "paymentMethod",
        header: "Método de Pago",
        cell: ({ row }) => <PaymentMethodCell item={row.original} />,
    },
    // Columna de acciones
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
];
