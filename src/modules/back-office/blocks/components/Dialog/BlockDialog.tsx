import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useBlockStore } from '../../store/blocks.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { RichEditor } from '@/components/shared/';

const FormSchema = z.object({
    titleEn: z.string().min(3, {
        message: 'El titulo EN debe tener al menos 3 caracteres',
    }).max(255, {
        message: 'El titulo EN debe tener como máximo 255 caracteres',
    }),
    titleEs: z.string().min(3, {
        message: 'El titulo ES debe tener al menos 3 caracteres',
    }).max(255, {
        message: 'El titulo ES debe tener como máximo 255 caracteres',
    }),
    urlKey: z.string().min(3, {
        message: 'La urlKey debe tener al menos 3 caracteres',
    }).max(255, {
        message: 'La urlKey debe tener como máximo 255 caracteres',
    }),
    contentEn: z.string().min(3, {
        message: 'El Contenido EN debe tener al menos 3 caracteres',
    }),
    contentEs: z.string().min(3, {
        message: 'El Contenido ES debe tener al menos 3 caracteres',
    }),
})

function BlocksDialog() {

    const action = useBlockStore(state => state.action);
    const selected = useBlockStore(state => state.selected);
    const loading = useBlockStore(state => state.loading);
    const isOpenDialog = useBlockStore(state => state.isOpenDialog);
    const closeActionModal = useBlockStore(state => state.closeActionModal);
    const create = useBlockStore(state => state.create);
    const update = useBlockStore(state => state.update);
    const remove = useBlockStore(state => state.remove);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Bloque'
            case 'delete':
                return 'Eliminar Bloque'
            case 'create':
                return 'Crear Bloque'
            default:
                return 'Bloque'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            titleEn: '',
            titleEs: '',
            urlKey: '',
            contentEn: '',
            contentEs: '',
        },
    })

    // LOGIC WYSIWYG
    const [contentEs, setContentEs] = useState(selected?.contentEs || '')
    const [contentEn, setContentEn] = useState(selected?.contentEn || '')
    const onHandleContentEs = (value: string) => {
        setContentEs(value)
        form.setValue("contentEs", value);
    };
    const onHandleContentEn = (value: string) => {
        setContentEn(value)
        form.setValue("contentEn", value);
    };
    // END LOGIC WYSIWYG

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
            })
            setContentEs(selected.contentEs)
            setContentEn(selected.contentEn)
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
                                    ¿Estás seguro de eliminar a {selected?.titleEs}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    name="urlKey"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Url Key</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Url Key"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Tabs defaultValue="spanish" className="w-full">
                                    <TabsList className="w-full">
                                        <TabsTrigger value="spanish" className="w-full">Español</TabsTrigger>
                                        <TabsTrigger value="english" className="w-full">Inglés</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="spanish" className='flex flex-col gap-2'>
                                        <FormField
                                            name="titleEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Titulo Bloque (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Titulo Bloque"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="contentEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <div className="w-full">
                                                        <RichEditor initialContent={contentEs} onChange={(html) => onHandleContentEs(html)} />
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="hidden"
                                                                className='hidden'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                    <TabsContent value="english" className='flex flex-col gap-2'>
                                        <FormField
                                            name="titleEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Titulo Bloque (Inglés)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Titulo Bloque"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="contentEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <div className="w-full">
                                                        <RichEditor initialContent={contentEn} onChange={(html) => onHandleContentEn(html)} />
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="hidden"
                                                                className='hidden'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </Tabs>
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

export default BlocksDialog