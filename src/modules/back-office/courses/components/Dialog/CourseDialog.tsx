import { Button, Card, CardContent, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Expand, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useCourseStore } from '../../store/course.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useConferenceTypeStore } from '@/modules/back-office/conference-type/store/conference-type.store';
import { CommonService } from '@/shared/services';
import { ImageModal } from '@/modules/back-office/galleries/components/Dialog/ImageDialog';
import { PayloadCourse } from '@/models';

const FormSchema = z.object({
    nameEs: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    nameEn: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    code: z.string().min(2, { message: 'El código debe tener al menos 2 caracteres' }),
    backgroundImageUrl: z.string().optional(),
    conferenceTypeId: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Debe seleccionar un tipo de conferencia"
    })),
    // positionX: z.preprocess((val) => Number(val), z.string().optional()),
    positionX: z.string().optional(),
    // positionY: z.preprocess((val) => Number(val), z.string().optional()),
    positionY: z.string().optional(),
    isActive: z.boolean().optional().default(true),
}).transform(data => ({
    ...data,
    isActive: data.isActive || false,
    positionX: undefined,
    positionY: undefined,
}))

function CoursesDialog() {

    const action = useCourseStore(state => state.action);
    const selected = useCourseStore(state => state.selected);
    const loading = useCourseStore(state => state.loading);
    const isOpenDialog = useCourseStore(state => state.isOpenDialog);
    const closeActionModal = useCourseStore(state => state.closeActionModal);
    const create = useCourseStore(state => state.create);
    const update = useCourseStore(state => state.update);
    const remove = useCourseStore(state => state.remove);
    const conferenceTypes = useConferenceTypeStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Curso'
            case 'delete':
                return 'Eliminar Curso'
            case 'create':
                return 'Crear Curso'
            default:
                return 'Curso'
        }
    };

    const form = useForm<PayloadCourse>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nameEs: '',
            nameEn: '',
            code: '',
            positionX: '',
            positionY: '',
            conferenceTypeId: undefined,
            isActive: true,
        },
    })


    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
                conferenceTypeId: selected.conferenceTypeId,
            })
        }
    }, [selected])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset({
                nameEs: '',
                nameEn: '',
                code: '',
                conferenceTypeId: undefined,
                isActive: true,
                positionX: '',
                positionY: ''
            })
        }
    }, [])

    /* START LOGIC FILE UPLOAD */
    const [uploading, setUploading] = useState(false)
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const handleFileUpload = async (
        inputName: "backgroundImageUrl",
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


    function onSubmit(data: PayloadCourse) {
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
                                    ¿Estás seguro de eliminar a {selected?.nameEs}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    name="code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Código</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Código"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="nameEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Nombre (ES)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Nombre (ES)"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="nameEn"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Name (EN)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Name (EN)"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="conferenceTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Tipo'}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={'Tipo de Conferencia'} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {conferenceTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.nameEs}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="backgroundImageUrl"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem className="">
                                            <FormLabel>Fondo Certificado</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload("backgroundImageUrl", e)}
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
                                            {form.watch("backgroundImageUrl") && (
                                                <Card className="relative overflow-hidden group">
                                                    <CardContent className="p-2">
                                                        <div className="relative">
                                                            <img
                                                                src={form.watch("backgroundImageUrl") || "/placeholder.svg"}
                                                                alt={`Image`}
                                                                className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => setExpandedImage(form.watch("backgroundImageUrl") || "")}
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
                                <FormField
                                    name="positionX"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Posición X</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Posición X"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="positionY"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Posición Y</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Posición Y"
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

export default CoursesDialog