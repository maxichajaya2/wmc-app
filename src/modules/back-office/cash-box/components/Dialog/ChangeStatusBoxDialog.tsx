import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useCashBoxesStore } from '../../store/cash-boxes.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CashBoxStatus, MapCashBoxStatus } from '@/models';
import { cn } from '@/lib/utils';

// PayloadChangeStatusCashBox
const FormSchema = z.object({
    status: z.nativeEnum(CashBoxStatus, {
        message: "Estado es requerido",
    }),
    items: z.array(z.object({
        amount: z.preprocess((val) => Number(val), z.number().min(1, {
            message: "Monto debe ser mayor a 0",
        })),
        remarks: z.string().optional(),
    })),
    remarks: z.string().optional(),
})

function ChangeStatusBoxDialog() {

    const action = useCashBoxesStore(state => state.action);
    const selected = useCashBoxesStore(state => state.selected);
    const loading = useCashBoxesStore(state => state.loading);
    const isOpenDialog = useCashBoxesStore(state => state.isOpenDialogChangeStatus);
    const closeActionModal = useCashBoxesStore(state => state.closeActionModal);
    const changeStatus = useCashBoxesStore(state => state.changeStatus);

    const title = () => {
        switch (action) {
            case 'changeStatus':
                return 'Cambiar Estado de Caja'
            default:
                return 'Caja'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            status: CashBoxStatus.OPEN,
            items: [],
            remarks: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                status: selected.status,
                items: []
            })
        }
    }, [selected])


    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (action === 'changeStatus') {
            return changeStatus({
                ...data,
                total: Number(form.getValues('items').reduce((acc, item) => acc + item.amount, 0)),
            })
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
                        {(action === 'changeStatus') && (
                            <div className='space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Estado"
                                                    isDisabled={loading}
                                                    options={
                                                        Object.values(CashBoxStatus).map((key) => ({
                                                            value: key,
                                                            label: MapCashBoxStatus[key],
                                                        }))
                                                    }
                                                    defaultValue={
                                                        Object.values(CashBoxStatus).map((key) => ({
                                                            value: key,
                                                            label: MapCashBoxStatus[key],
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('status', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione el Estado de la caja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* items */}
                                <div className={cn(
                                    "space-y-6",
                                    form.getValues('status') === CashBoxStatus.CLOSED && 'hidden'
                                )}>
                                    <div className='flex justify-between'>
                                        <TypographyH4>Montos de Apertura</TypographyH4>
                                        {/* Botón para añadir un item */}
                                        <Button
                                            onClick={() => form.setValue('items', [...form.getValues('items'), { amount: 0, remarks: '' }])}
                                            disabled={loading}
                                            type='button'
                                            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300">
                                            Añadir Item
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {form.getValues('items').map((_item, index) => (
                                            <div key={index} className="grid grid-cols-1 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.amount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Monto</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Monto"
                                                                    disabled={loading}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Ingrese el monto
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.remarks`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Observaciones</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Observaciones"
                                                                    disabled={loading}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Ingrese las observaciones
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
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

export default ChangeStatusBoxDialog