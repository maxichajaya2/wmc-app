import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useTopicStore } from '../../store/topic.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useCategoryStore } from '@/modules/back-office/category/store/category.store';

const FormSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    categoryId: z.number().int().positive({ message: 'Categoría es requerida' }),
})

function TopicsDialog() {

    const action = useTopicStore(state => state.action);
    const selected = useTopicStore(state => state.selected);
    const selectedReviewer = useTopicStore(state => state.selectedReviewer);
    const loading = useTopicStore(state => state.loading);
    const isOpenDialog = useTopicStore(state => state.isOpenDialog);
    const closeActionModal = useTopicStore(state => state.closeActionModal);
    const create = useTopicStore(state => state.create);
    const update = useTopicStore(state => state.update);
    const remove = useTopicStore(state => state.remove);
    const unassignUser = useTopicStore(state => state.unassignUser);
    const categories = useCategoryStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Tema'
            case 'delete':
                return 'Eliminar Tema'
            case 'create':
                return 'Crear Tema'
            case 'delete-reviewer':
                return 'Eliminar Revisor'
            default:
                return 'Tema'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
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
        if (action === 'delete-reviewer') {
            if (!selectedReviewer) return
            return unassignUser(selectedReviewer.id)
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
                        {action === 'delete-reviewer' && (
                            <div>
                                <TypographyH4 className="">
                                    ¿Estás seguro de eliminar a {selectedReviewer?.name}?
                                </TypographyH4>
                            </div>
                        )}
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
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Nombre"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="categoryId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Categoría"
                                                    isDisabled={loading}
                                                    options={
                                                        categories.map((key) => ({
                                                            value: key.id,
                                                            label: key.name,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        categories.map((key) => ({
                                                            value: key.id,
                                                            label: key.name,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('categoryId', option.value)}
                                                />
                                            </FormControl>
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

export default TopicsDialog