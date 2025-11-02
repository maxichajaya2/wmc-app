import { Button, Card, CardContent, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch, Switch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Expand, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useSpeakerStore } from '../../store/speaker.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSpeakerTypeStore } from '@/modules/back-office/speaker-type/store/speaker-type.store';
import { CommonService } from '@/shared/services';
import { ImageModal } from '@/modules/back-office/galleries/components/Dialog/ImageDialog';
import { CountryItem } from './CountryItem';
import { RichEditor } from '@/components/shared';

const FormSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    jobEn: z.string().min(3, { message: 'Cargo (EN) debe tener al menos 3 caracteres' }),
    jobEs: z.string().min(3, { message: 'Cargo (ES) debe tener al menos 3 caracteres' }),
    cvEs: z.string().min(3, { message: 'CV (ES) debe tener al menos 3 caracteres' }),
    cvEn: z.string().min(3, { message: 'CV (EN) debe tener al menos 3 caracteres' }),
    photoUrl: z.string().url({ message: 'URL de la foto no válida' }),
    countryCode: z.string().min(2, { message: 'País es requerido' }),
    speakerTypeId: z.number().int().positive({ message: 'Tipo de conferencia es requerido' }),
    isActive: z.boolean().optional().default(true),
})

function SpeakersDialog() {

    const action = useSpeakerStore(state => state.action);
    const selected = useSpeakerStore(state => state.selected);
    const loading = useSpeakerStore(state => state.loading);
    const isOpenDialog = useSpeakerStore(state => state.isOpenDialog);
    const closeActionModal = useSpeakerStore(state => state.closeActionModal);
    const create = useSpeakerStore(state => state.create);
    const update = useSpeakerStore(state => state.update);
    const remove = useSpeakerStore(state => state.remove);
    const speakerTypes = useSpeakerTypeStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Conferencista'
            case 'delete':
                return 'Eliminar Conferencista'
            case 'create':
                return 'Crear Conferencista'
            default:
                return 'Conferencista'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            jobEn: '',
            jobEs: '',
            cvEs: '',
            cvEn: '',
            photoUrl: '',
            countryCode: '',
            speakerTypeId: 0,
            isActive: true,
        },
    })

    // LOGIC COUNTRIES
    const countries = useSpeakerStore(state => state.countries);
    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: country.name, // Usamos el nombre del país como label
    }));

    const selectedValue = form.watch('countryCode') && countries.find((c) => c.code === form.watch('countryCode'));
    // END LOGIC COUNTRIES

    // LOGIC WYSIWYG
    const [contentEs, setContentEs] = useState(selected?.cvEs || '')
    const [contentEn, setContentEn] = useState(selected?.cvEn || '')
    const onHandleContentEs = (value: string) => {
        setContentEs(value)
        form.setValue("cvEs", value);
    };
    const onHandleContentEn = (value: string) => {
        setContentEn(value)
        form.setValue("cvEn", value);
    };
    // END LOGIC WYSIWYG

    /* START LOGIC FILE UPLOAD */
    const [uploading, setUploading] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const handleFileUpload = async (inputName: 'photoUrl', event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const fileUrl = await CommonService.uploadFile(file);

                if (index !== undefined) {

                    // Reemplazar el file existente
                    form.setValue(inputName, fileUrl);
                } else {
                    // Agregar una nueva imagen
                    form.setValue(inputName, fileUrl);
                }
            } catch (error) {
                console.error('Error al subir el archivo:', error);
            } finally {
                setUploading(false);
                event.target.value = '';
            }
        }
    };
    /* END LOGIC FILE UPLOAD */


    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
            })
            setContentEs(selected.cvEs)
            setContentEn(selected.cvEn)
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
                                    name="photoUrl"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem className="">
                                            <FormLabel>Foto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload('photoUrl', e)}
                                                    disabled={uploading}
                                                    accept='image/*'
                                                    className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                                                />
                                            </FormControl>
                                            {uploading && (
                                                <div className="flex items-center space-x-2">
                                                    <LoaderCircle size={24} className="animate-spin text-blue-500" />
                                                    <span className="text-blue-500">Subiendo...</span>
                                                </div>
                                            )}
                                            {form.watch('photoUrl') && (
                                                // Visor de archivo
                                                // <div className="flex items-center space-x-2">
                                                //     <Link to={form.watch('photoUrl') || ''} target="_blank" className="text-blue-500 underline">
                                                //         Ver archivo
                                                //     </Link>
                                                // </div>
                                                <Card className="relative overflow-hidden group">
                                                    <CardContent className="p-2">
                                                        <div className="relative">
                                                            <img
                                                                src={form.watch('photoUrl') || "/placeholder.svg"}
                                                                alt={`Image`}
                                                                className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => setExpandedImage(form.watch('photoUrl') || '')}
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
                                    name="jobEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Cargo (ES)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Cargo (ES)"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="jobEn"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Job (EN)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Job (EN)"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="cvEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>CV (ES)</FormLabel>
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
                                <FormField
                                    name="cvEn"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>CV (EN)</FormLabel>
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
                                <FormField
                                    name="countryCode"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem>
                                            <FormLabel>País</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Seleccione el país"
                                                    isDisabled={loading}
                                                    options={countryOptions}
                                                    value={selectedValue ? {
                                                        value: selectedValue.code,
                                                        label: selectedValue.name,
                                                    } : null}
                                                    onChange={(option: any) => {
                                                        form.setValue('countryCode', option.value);
                                                    }}
                                                    filterOption={(option, inputValue) => {
                                                        return option.label.toLowerCase().includes(inputValue.toLowerCase());
                                                    }}
                                                    formatOptionLabel={(option: any) => (
                                                        <CountryItem countryCode={option.value} />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione el país
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="speakerTypeId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Tipo"
                                                    isDisabled={loading}
                                                    options={
                                                        speakerTypes.map((key) => ({
                                                            value: key.id,
                                                            label: key.nameEs,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        speakerTypes.map((key) => ({
                                                            value: key.id,
                                                            label: key.nameEs,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('speakerTypeId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione el tipo de conferencista
                                            </FormDescription>
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
                        <ImageModal isOpen={!!expandedImage} onClose={() => setExpandedImage(null)} imageUrl={expandedImage || ""} />
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

export default SpeakersDialog