
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Skeleton,
} from "@/components"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export function DataTableSkeleton<TData, TValue>({
    columns,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data: [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {[...Array(10)].map(() => (
                        table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id + 'headergroup'}>
                                {headerGroup.headers.map((_a, index) => {
                                    return (
                                        <TableCell key={index + 'headers'}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}