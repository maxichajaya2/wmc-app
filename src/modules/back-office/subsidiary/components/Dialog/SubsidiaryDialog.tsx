import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useSubsidiaryStore } from '../../store/subsidiary.store';
import { DialogDescription } from '@radix-ui/react-dialog';

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Producto debe tener al menos 2 caracteres",
    }),
    address: z.string().min(1, {
        message: "Este campo es requerido.",
    }),
    ruc: z.string().min(1, {
        message: "Este campo es requerido.",
    }).length(11, {
        message: "El RUC debe tener 11 dígitos.",
    })
})

function SubsidiaryDialog() {

    const action = useSubsidiaryStore(state => state.action);
    const selected = useSubsidiaryStore(state => state.selected);
    const loading = useSubsidiaryStore(state => state.loading);
    const isOpenDialog = useSubsidiaryStore(state => state.isOpenDialog);
    const closeActionModal = useSubsidiaryStore(state => state.closeActionModal);
    const create = useSubsidiaryStore(state => state.create);
    const update = useSubsidiaryStore(state => state.update);
    const remove = useSubsidiaryStore(state => state.remove);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Sucursal'
            case 'delete':
                return 'Eliminar Sucursal'
            case 'create':
                return 'Crear Sucursal'
            default:
                return 'Sucursal'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            address: '',
            ruc: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
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
                                {JSON.stringify({
                                    form: form.watch(), action, errors: form.formState.errors

                                }, null, 4)}
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
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dirección" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese la dirección de la caja
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ruc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RUC</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="RUC" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el RUC de la caja
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

export default SubsidiaryDialog