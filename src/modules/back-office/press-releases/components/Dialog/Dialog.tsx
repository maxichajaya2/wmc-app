import { Button, Card, CardContent, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Expand, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { usePressReleaseStore } from '../../store/press-releases.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { PressReleaseType, MapPressReleasesType } from '@/models';
import { DateClass } from '@/lib';
import { CommonService } from '@/shared/services';
import { Link } from 'react-router-dom';
import { ImageModal } from '@/modules/back-office/galleries/components/Dialog/ImageDialog';
import { RichEditor } from '@/components/shared';

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
    subtitleEs: z.string().optional(),
    subtitleEn: z.string().optional(),
    textEn: z.string().min(3, {
        message: 'El Contenido EN debe tener al menos 3 caracteres',
    }),
    textEs: z.string().min(3, {
        message: 'El Contenido ES debe tener al menos 3 caracteres',
    }),
    date: z.string().min(1, {
        message: 'La fecha es requerida',
    }),
    photo: z.string().optional(),
    video: z.string().optional(),
    type: z.nativeEnum(PressReleaseType, { message: 'Tipo inválido' }),
    isActive: z.boolean().optional().default(true),
})
    .superRefine((val, ctx) => {
        if ((val.type === PressReleaseType.NEWSLETTERS || val.type === PressReleaseType.PRESS_RELEASES) && val.photo !== "" && val.photo && !val.photo.includes("https://")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["photo"],
                message: "Ingrese una Url válida https://example.com",
            })
        }
        if ((val.type === PressReleaseType.INTERVIEWS) && val.video !== "" && val.video && !val.video.includes("https://")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["video"],
                message: "Ingrese una Url válida https://example.com",
            })
        }
    })
    .transform((data) => ({
        ...data,
        date: DateClass.DateToISOString(data.date),
    }))

function PressReleasesDialog() {

    const action = usePressReleaseStore(state => state.action);
    const selected = usePressReleaseStore(state => state.selected);
    const loading = usePressReleaseStore(state => state.loading);
    const isOpenDialog = usePressReleaseStore(state => state.isOpenDialog);
    const closeActionModal = usePressReleaseStore(state => state.closeActionModal);
    const create = usePressReleaseStore(state => state.create);
    const update = usePressReleaseStore(state => state.update);
    const remove = usePressReleaseStore(state => state.remove);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Prensa'
            case 'delete':
                return 'Eliminar Prensa'
            case 'create':
                return 'Crear Prensa'
            default:
                return 'Prensa'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: '',
            photo: '',
            video: '',
            type: PressReleaseType.PRESS_RELEASES,
            textEn: '',
            textEs: '',
            subtitleEs: '',
            subtitleEn: '',
            titleEn: '',
            titleEs: '',
            isActive: true,
        },
    })

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])

    // LOGIC WYSIWYG
    const [contentEs, setContentEs] = useState(selected?.textEs || '')
    const [contentEn, setContentEn] = useState(selected?.textEn || '')
    const onHandleContentEs = (value: string) => {
        setContentEs(value)
        form.setValue("textEs", value);
    };
    const onHandleContentEn = (value: string) => {
        setContentEn(value)
        form.setValue("textEn", value);
    };
    // END LOGIC WYSIWYG

    /* START LOGIC FILE UPLOAD */
    const [uploading, setUploading] = useState(false)
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const handleFileUpload = async (
        inputName: "photo" | "video",
        event: React.ChangeEvent<HTMLInputElement>,
        index?: number,
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploading(true)
            try {
                const fileUrl = await CommonService.uploadFile(file)

                if (index !== undefined) {
                    // Reemplazar el file existente
                    form.setValue(inputName, fileUrl)
                } else {
                    // Agregar una nueva imagen
                    form.setValue(inputName, fileUrl)
                }
            } catch (error) {
                console.error("Error al subir el archivo:", error)
            } finally {
                setUploading(false)
                event.target.value = ""
            }
        }
    }
    /* END LOGIC FILE UPLOAD */


    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
                date: DateClass.DateToFormat(selected.date, DateClass.FORMAT_INPUT_SHORT),
            })
            setContentEs(selected.textEs)
            setContentEn(selected.textEn)

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
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Tipo'}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={'Tipo'} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={PressReleaseType.PRESS_RELEASES}>{MapPressReleasesType[PressReleaseType.PRESS_RELEASES]}</SelectItem>
                                                    <SelectItem value={PressReleaseType.NEWSLETTERS}>{MapPressReleasesType[PressReleaseType.NEWSLETTERS]}</SelectItem>
                                                    <SelectItem value={PressReleaseType.INTERVIEWS}>{MapPressReleasesType[PressReleaseType.INTERVIEWS]}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {(form.watch('type') === PressReleaseType.PRESS_RELEASES || form.watch('type') === PressReleaseType.NEWSLETTERS) && (
                                    <FormField
                                        name="photo"
                                        control={form.control}
                                        render={(_) => (
                                            <FormItem className="">
                                                <FormLabel>Imagen</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => handleFileUpload("photo", e)}
                                                        disabled={uploading}
                                                        accept="image/*"
                                                        className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                                                    />
                                                </FormControl>
                                                {uploading && (
                                                    <div className="flex items-center space-x-2">
                                                        <LoaderCircle size={24} className="animate-spin text-blue-500" />
                                                        <span className="text-blue-500">Subiendo...</span>
                                                    </div>
                                                )}
                                                {form.watch("photo") && (
                                                    // Visor de archivo
                                                    // <div className="flex items-center space-x-2">
                                                    //     <Link to={form.watch('photo') || ''} target="_blank" className="text-blue-500 underline">
                                                    //         Ver archivo
                                                    //     </Link>
                                                    // </div>
                                                    <Card className="relative overflow-hidden group">
                                                        <CardContent className="p-2">
                                                            <div className="relative">
                                                                <img
                                                                    src={form.watch("photo") || "/placeholder.svg"}
                                                                    alt={`Image`}
                                                                    className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setExpandedImage(form.watch("photo") || "")}
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                                >
                                                                    <Expand className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {(form.watch('type') === PressReleaseType.INTERVIEWS) && (
                                    <FormField
                                        name="video"
                                        control={form.control}
                                        render={(_) => (
                                            <FormItem className="">
                                                <FormLabel>Video</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => handleFileUpload("video", e)}
                                                        disabled={uploading}
                                                        accept='video/*'
                                                        className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                                                    />
                                                </FormControl>
                                                {uploading && (
                                                    <div className="flex items-center space-x-2">
                                                        <LoaderCircle size={24} className="animate-spin text-blue-500" />
                                                        <span className="text-blue-500">Subiendo...</span>
                                                    </div>
                                                )}
                                                {form.watch("video") && (
                                                    // Visor de archivo
                                                    <div className="flex items-center space-x-2">
                                                        <Link to={form.watch('video') || ''} target="_blank" className="text-blue-500 underline">
                                                            Ver video
                                                        </Link>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    name="date"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Fecha</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" placeholder="Fecha de Inicio" className="w-full" />
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
                                                    <FormLabel>Titulo (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Titulo"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="subtitleEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Subitulo (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Subitulo (Español)"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="textEs"
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
                                                    <FormLabel>Titulo (Inglés)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Titulo"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="subtitleEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Subtitle (EN)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Subtitle (EN)"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="textEn"
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
                        <ImageModal
                            isOpen={!!expandedImage}
                            onClose={() => setExpandedImage(null)}
                            imageUrl={expandedImage || ""}
                        />
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

export default PressReleasesDialog