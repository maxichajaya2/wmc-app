import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useSalesStore } from '../../store/sale.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useCustomersStore } from '@/modules/back-office/customers/store/customers.store';
import { DataTable } from '@/shared';
import { columnsDetailSale } from '../Table/detail-sale-columns';

const FormSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        salePrice: z.number(),
    })),
    total: z.number(),
    paymentItems: z.array(z.object({
        amount: z.number(),
        paymentMethod: z.string(),
    })),
    customerId: z.string(),
})

function SaleDialog() {

    const action = useSalesStore(state => state.action);
    const selected = useSalesStore(state => state.selected);
    const loading = useSalesStore(state => state.loading);
    const isOpenDialog = useSalesStore(state => state.isOpenDialog);
    const closeActionModal = useSalesStore(state => state.closeActionModal);
    const create = useSalesStore(state => state.create);
    const update = useSalesStore(state => state.update);
    const remove = useSalesStore(state => state.remove);

    // customers
    const customers = useCustomersStore(state => state.data);


    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Venta'
            case 'delete':
                return 'Eliminar Venta'
            case 'create':
                return 'Crear Venta'
            case 'view':
                return 'Detalle de Venta'
            default:
                return 'Venta'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
            total: 0,
            paymentItems: [],
            customerId: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                customerId: selected.data.customerId,
                items: selected.data.items,
                total: selected.data.total,
                paymentItems: selected.data.paymentItems,
            })
        }
    }, [selected])



    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (action === 'create') {
            return create(data)
        }
        if (action === 'edit') {
            return update(data)
        }
        if (action === 'delete') {
            return remove()
        }
    }

    return (
        <Dialog open={isOpenDialog} onOpenChange={(open) => {
            if (!open) {
                closeActionModal()
            }
        }}>
            <DialogContent
                onPointerDownOutside={e => {
                    e.preventDefault()
                }}>
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <DialogDescription />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6">
                        <pre className="text-xs col-span-2 hidden">
                            <code>
                                {JSON.stringify({ form: form.watch(), action }, null, 4)}
                            </code>
                        </pre>
                        {action === 'view' && (
                            <div className='space-y-6'>
                                {/* Tabla con los productos */}
                                <DataTable columns={columnsDetailSale} data={selected?.data.items ?? []} />

                                {/* Total de venta, metodo de pago, y datos del customer */}
                                <div className='flex flex-col gap-4'>
                                    <TypographyH4 className="font-bold">Total: S/ {selected?.data.total}</TypographyH4>

                                    <TypographyH4 className="font-bold">Método de Pago</TypographyH4>

                                    <TypographyH4 className="font-bold">Cliente</TypographyH4>

                                </div>
                            </div>
                        )}
                        {action === 'delete' && (
                            <div>
                                <TypographyH4 className="">
                                    ¿Estás seguro de eliminar a {selected?.id}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="customerId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cliente</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Cliente"
                                                    isDisabled={loading}
                                                    options={
                                                        customers.map((key) => ({
                                                            value: key.id,
                                                            label: `${key.person.givenNames} {key.person.givenNames}`,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        customers.map((key) => ({
                                                            value: key.id,
                                                            label: `${key.person.givenNames} {key.person.givenNames}`,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('customerId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el Cliente
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Total" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese Total
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        <DialogFooter className='col-span-1 md:col-span-2 ml-auto flex flex-row gap-2'>
                            <Button
                                disabled={loading}
                                type="submit"
                                className="font-bold py-2 px-4 rounded duration-300 text-white">
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : "Guardar"}
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={closeActionModal}
                                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300">
                                Cancelar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default SaleDialog