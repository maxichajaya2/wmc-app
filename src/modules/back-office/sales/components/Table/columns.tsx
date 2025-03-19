import React, { useCallback } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components";
import { Sale as Entity, MapPaymentMethod } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useSalesStore } from '../../store/sale.store';

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
const ProductsCell = React.memo(({ item }: { item: Entity }) => {

    // mostrar hasta 4 productos
    const products = item.data.items.slice(0, 4);
    const totalProducts = item.data.items.length;

    return (

        <div className="flex flex-row items-start relative">
            {products.map(({ product, salePrice, quantity }, index) => (
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                key={index + product.id}
                                className='h-8 w-8 bg-gray-400 rounded-full aspect-square bg-cover bg-center'
                                style={{
                                    marginLeft: index === 0 ? 0 : -10,
                                    backgroundImage: `url(${product.image ?? '/img/placeholders/product.png'})`
                                }}
                            ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <h2 className="font-semibold text-center">{product?.name}</h2>
                            <p className="text-sm text-center">Cant: {quantity} - P.V.: S/ {salePrice}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
            {totalProducts > 4 && (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full aspect-square bg-cover bg-center text-white font-bold">
                    +{totalProducts - 4}
                </div>
            )}
        </div>
    );
});

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
    const openActionModal = useSalesStore(state => state.openActionModal);

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
    {
        accessorKey: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
        accessorKey: "products",
        header: "Productos Vendidos",
        cell: ({ row }) => <ProductsCell item={row.original} />,
    },
    {
        accessorKey: "total",
        header: "Total Venta",
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
