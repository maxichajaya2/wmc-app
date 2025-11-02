import React from 'react';
import { ProductItem as Entity } from "@/models";
import { ColumnDef } from "@tanstack/react-table";

const ProductCell = React.memo(({ item }: { item: Entity }) => (
    <div className='flex flex-row gap-2 items-start justify-start'>
        <div className='h-8 w-8 bg-gray-400 rounded-full aspect-square bg-cover bg-center'
            style={{
                backgroundImage: `url(${item.product.image ?? '/img/placeholders/product.png'})`
            }}
        ></div>
        <div className="flex flex-col">
            <span className="font-bold text-sm">{item.product.name}</span>
            <span className="font-light text-sm">Cód.: {item.product.code}</span>
            <span className="font-light text-sm">P. Venta: S/ {item.salePrice}</span>
        </div>
    </div>
));

const QuantityCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-row gap-2 items-center">
        <span className="font-medium text-base">{item.quantity}</span>
    </div>
));

const AmountCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-row gap-2 items-center">
        <span className="font-medium text-base">S/ {item.salePrice}</span>
    </div>
));

const RemarksCell = React.memo(({ item }: { item: Entity }) => (
    <div className="flex flex-row gap-2 items-center">
        <span className="font-medium text-base">{item.remarks}</span>
    </div>
));

// Definición de las columnas con más información
export const columnsDetailSale: ColumnDef<Entity>[] = [
    {
        accessorKey: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
        accessorKey: "products",
        header: "Producto",
        cell: ({ row }) => <ProductCell item={row.original} />,
    },
    {
        accessorKey: "quantity",
        header: "Cantidad",
        cell: ({ row }) => <QuantityCell item={row.original} />,
    },
    {
        accessorKey: "amount",
        header: "Monto",
        cell: ({ row }) => <AmountCell item={row.original} />,
    },
    {
        accessorKey: "remarks",
        header: "Observaciones",
        cell: ({ row }) => <RemarksCell item={row.original} />,
    },
];
