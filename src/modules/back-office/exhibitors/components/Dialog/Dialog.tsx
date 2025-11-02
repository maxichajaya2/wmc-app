import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Switch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useExhibitorStore } from '../../store/exhibitor.store';
import { DialogDescription } from '@radix-ui/react-dialog';

const FormSchema = z.object({
    enterprise: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    ruc: z.string().min(11, { message: 'El RUC debe tener mínimo 11 caracteres' }),
    web: z.string().url({ message: 'Debe ser una URL válida' }),
    isActive: z.boolean().optional().default(true),
})

function ExhibitorsDialog() {

    const action = useExhibitorStore(state => state.action);
    const selected = useExhibitorStore(state => state.selected);
    const loading = useExhibitorStore(state => state.loading);
    const isOpenDialog = useExhibitorStore(state => state.isOpenDialog);
    const closeActionModal = useExhibitorStore(state => state.closeActionModal);
    const create = useExhibitorStore(state => state.create);
    const update = useExhibitorStore(state => state.update);
    const remove = useExhibitorStore(state => state.remove);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Exhibidor'
            case 'delete':
                return 'Eliminar Exhibidor'
            case 'create':
                return 'Crear Exhibidor'
            default:
                return 'Exhibidor'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            enterprise: '',
            ruc: '',
            web: '',
            isActive: true,
        },
    })


    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
            })
        }
    }, [selected])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])


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
                                {JSON.stringify({
                                    form: form.watch(), action,
                                    errors: form.formState.errors

                                }, null, 4)}
                            </code>
                        </pre>
                        {action === 'delete' && (
                            <div>
                                <TypographyH4 className="">
                                    ¿Estás seguro de eliminar a {selected?.enterprise}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    name="enterprise"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Empresa</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Empresa"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="ruc"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>RUC</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="RUC"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="web"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Web Url</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="url"
                                                    placeholder="Web Url"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="isActive"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                                            <div className="space-y-0.5">
                                                <FormLabel>Activar</FormLabel>
                                                <FormDescription>
                                                    Si lo oculta, no se mostrará en la lista.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
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

export default ExhibitorsDialog