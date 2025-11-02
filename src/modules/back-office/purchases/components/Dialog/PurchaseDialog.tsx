import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { usePurchasesStore } from '../../store/purchase.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSuppliersStore } from '@/modules/back-office/suppliers/store/suppliers.store';

const FormSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number(),
        purchasePrice: z.number(),
    })),
    total: z.number(),
    paymentItems: z.array(z.object({
        amount: z.number(),
        paymentMethod: z.string(),
    })),
    supplierId: z.string(),
    transactionDocumentId: z.string(),
    generateCashFlow: z.boolean(),
})

function PurchaseDialog() {

    const action = usePurchasesStore(state => state.action);
    const selected = usePurchasesStore(state => state.selected);
    const loading = usePurchasesStore(state => state.loading);
    const isOpenDialog = usePurchasesStore(state => state.isOpenDialog);
    const closeActionModal = usePurchasesStore(state => state.closeActionModal);
    const create = usePurchasesStore(state => state.create);
    const update = usePurchasesStore(state => state.update);
    const remove = usePurchasesStore(state => state.remove);

    // suppliers
    const suppliers = useSuppliersStore(state => state.data);


    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Compra'
            case 'delete':
                return 'Eliminar Compra'
            case 'create':
                return 'Crear Compra'
            default:
                return 'Compra'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
            total: 0,
            paymentItems: [],
            supplierId: '',
            generateCashFlow: true,
            transactionDocumentId: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                supplierId: selected.data.supplierId,
                items: selected.data.items,
                total: selected.data.total,
                transactionDocumentId: selected.data.transactionDocumentId,
                paymentItems: selected.data.paymentItems,
                generateCashFlow: selected.data.generateCashFlow,
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
                        <pre className="text-xs col-span-2">
                            <code>
                                {JSON.stringify({ form: form.watch(), action }, null, 4)}
                            </code>
                        </pre>
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
                                    name="supplierId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proveedor</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Proveedor"
                                                    isDisabled={loading}
                                                    options={
                                                        suppliers.map((key) => ({
                                                            value: key.id,
                                                            label: `${key.person.givenNames} ${key.person.givenNames}`,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        suppliers.map((key) => ({
                                                            value: key.id,
                                                            label: `${key.person.givenNames} ${key.person.givenNames}`,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('supplierId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el Proveedor
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

export default PurchaseDialog