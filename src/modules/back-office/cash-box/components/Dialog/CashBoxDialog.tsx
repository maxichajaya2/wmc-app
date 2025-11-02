import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useCashBoxesStore } from '../../store/cash-boxes.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSubsidiaryStore } from '@/modules/back-office/subsidiary/store/subsidiary.store';

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Producto debe tener al menos 2 caracteres",
    }),
    responsableId: z.string().min(1, {
        message: "Responsable es requerido",
    }),
})

function CashBoxDialog() {

    const action = useCashBoxesStore(state => state.action);
    const selected = useCashBoxesStore(state => state.selected);
    const loading = useCashBoxesStore(state => state.loading);
    const isOpenDialog = useCashBoxesStore(state => state.isOpenDialog);
    const closeActionModal = useCashBoxesStore(state => state.closeActionModal);
    const create = useCashBoxesStore(state => state.create);
    const update = useCashBoxesStore(state => state.update);
    const remove = useCashBoxesStore(state => state.remove);

    // sucursales
    const subsidiaries = useSubsidiaryStore(state => state.data);
    // users
    // const users = useUsersStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Caja'
            case 'delete':
                return 'Eliminar Caja'
            case 'create':
                return 'Crear Caja'
            default:
                return 'Caja'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            responsableId: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
            })
        }
    }, [selected])

    useEffect(() => {
        if (subsidiaries.length > 0) {
            form.reset({
                ...form.getValues(),
            })
        }
    }, [subsidiaries])


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
                        {action === 'delete' && (
                            <div>
                                <TypographyH4 className="">
                                    ¿Estás seguro de eliminar a {selected?.name}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el nombre de la caja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* <FormField
                                    control={form.control}
                                    name="responsableId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Responsable"
                                                    isDisabled={loading}
                                                    options={
                                                        users.map((key) => ({
                                                            value: key.id,
                                                            label: key.person.legalName ? `${key.person.legalName}` : `${key.person.givenNames} ${key.person.lastName}`,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        users.map((key) => ({
                                                            value: key.id,
                                                            label: key.person.legalName ? `${key.person.legalName}` : `${key.person.givenNames} ${key.person.lastName}`,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('responsableId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione el responsable de la caja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
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

export default CashBoxDialog