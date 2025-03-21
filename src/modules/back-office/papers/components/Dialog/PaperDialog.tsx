import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Switch, Textarea } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import Creatable from 'react-select/creatable';
import { useEffect, useMemo, useState } from 'react';
import { usePaperStore } from '../../store/papers.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { AuthorType, MapTypePaper, PrimaryRoles, StatePaper, TypePaper, User } from '@/models';
import { CommonService } from '@/shared/services';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTopicStore } from '@/modules/back-office/topics/store/topic.store';
import { AuthorForm } from './AuthorForm';
import { AuthorFormData, PaperFormData, paperSchema } from './schemas';
import { PaperService } from '../../services/papers.service';
import { useUsersStore } from '@/modules/back-office/users/store/users.store';
import { useCategoryStore } from '@/modules/back-office/category/store/category.store';
import { useUserWebStore } from '@/modules/back-office/users-web/store/users-web.store';
import { DateClass } from '@/lib';

function PapersDialog() {

    const action = usePaperStore(state => state.action);
    const selected = usePaperStore(state => state.selected);
    const loading = usePaperStore(state => state.loading);
    const isOpenDialog = usePaperStore(state => state.isOpenDialog);
    const closeActionModal = usePaperStore(state => state.closeActionModal);
    const create = usePaperStore(state => state.create);
    const update = usePaperStore(state => state.update);
    const deletePaper = usePaperStore(state => state.remove);
    const topics = useTopicStore(state => state.data);
    const categories = useCategoryStore(state => state.data);
    const webUsers = useUserWebStore(state => state.data);


    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Trabajo Técnico'
            case 'delete':
                return 'Eliminar Trabajo Técnico'
            case 'create':
                return 'Crear Trabajo Técnico'
            case 'receive-paper':
                return 'Cambiar estado a: RECIBIDO'
            case 'send-paper':
                return 'Cambiar estado a: ENVIADO'
            case 'assign-paper':
                return 'Cambiar estado a: ASIGNADO'
            case 'review-paper':
                return 'Cambiar estado a: EN REVISIÓN'
            case 'approve-paper':
                return 'Cambiar estado a: APROBADO'
            case 'dismiss-paper':
                return 'Cambiar estado a: DESESTIMADO'
            default:
                return 'Trabajo Técnico'
        }
    };

    const form = useForm<PaperFormData>({
        resolver: zodResolver(paperSchema),
        defaultValues: {
            title: '',
            resume: '',
            file: '',
            categoryId: undefined,
            topicId: undefined,
            webUserId: undefined,
            flagEvent: false,
            eventDate: '',
            eventWhere: '',
            eventWhich: '',
            keywords: [],
            language: '',
            authors: [{
                type: AuthorType.AUTOR,
            }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "authors",
    })

    /* START LOGIC CHANGE STATUS */
    const changeStatusPaper = usePaperStore(state => state.changeStatusPaper);
    const users = useUsersStore(state => state.data);


    const leadersUsers = users.filter((user) => user.role.id === PrimaryRoles.LEADER)
    const reviewersUsers = users.filter((user) => user.role.id === PrimaryRoles.REVIEWER)
    const leaders = useMemo(() => {
        if (!selected) {
            return []
        }
        return leadersUsers.filter((user) => user.categoryId === selected.categoryId)
    }, [selected, leadersUsers])
    const reviewers = useMemo(() => {
        if (!selected) {
            return []
        }
        return reviewersUsers.filter((user) => user.categoryId === selected.categoryId)
    }, [selected, reviewersUsers])
    const [selectedLeader, setSelectedLeader] = useState<User | null>(null)
    const [selectedReviewer, setSelectedReviewer] = useState<User | null>(null)

    const paperTypes = [
        { id: TypePaper.ORAL, name: MapTypePaper[TypePaper.ORAL] },
        { id: TypePaper.POSTER, name: MapTypePaper[TypePaper.POSTER] },
        { id: TypePaper.PRESENTACION_INTERACTIVA, name: MapTypePaper[TypePaper.PRESENTACION_INTERACTIVA] },
    ]
    const [selectedTypePaper, setSelectedTypePaper] = useState<TypePaper | null>(null)
    const handleChangeStatus = () => {
        let status: StatePaper = StatePaper.RECEIVED;
        switch (action) {
            case 'receive-paper':
                status = StatePaper.RECEIVED;
                break;
            case 'send-paper':
                status = StatePaper.SENT;
                break;
            case 'assign-paper':
                status = StatePaper.ASSIGNED;
                break;
            case 'review-paper':
                status = StatePaper.UNDER_REVIEW;
                break;
            case 'approve-paper':
                status = StatePaper.APPROVED;
                break;
            case 'dismiss-paper':
                status = StatePaper.DISMISSED;
                break;
        }
        if (selected) {
            changeStatusPaper({
                state: status,
                leaderId: (status === StatePaper.SENT && selectedLeader) ? selectedLeader.id : undefined,
                reviewerUserId: (status === StatePaper.ASSIGNED && selectedReviewer) ? selectedReviewer.id : undefined,
                type: (status === StatePaper.APPROVED && selectedTypePaper) ? selectedTypePaper : undefined,
            });
        }
    }
    /* END   LOGIC CHANGE STATUS */

    /* START LOGIC FILE UPLOAD */
    const [uploading, setUploading] = useState(false);
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const fileUrl = await CommonService.uploadFile(file);

                if (index !== undefined) {

                    // Reemplazar el file existente
                    form.setValue('file', fileUrl);
                } else {
                    // Agregar una nueva imagen
                    form.setValue('file', fileUrl);
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

    // LOGIC AUTHORS
    useEffect(() => {
        (
            async () => {
                if (selected) {
                    form.reset({
                        ...selected,
                        file: selected.file || '',
                        categoryId: selected.categoryId || undefined,
                        topicId: selected.topicId || undefined,
                        webUserId: selected.webUserId || undefined,
                        eventDate: selected.eventDate ? DateClass.DateToFormat(selected.eventDate, DateClass.FORMAT_INPUT_SHORT) : undefined,
                    })
                    try {
                        const authors = await PaperService.findAuthorsByPaper(selected.id);
                        form.reset({
                            ...form.watch(),
                            authors: authors
                        })
                    } catch (error) {
                        form.reset({
                            ...form.watch(),
                            authors: [{}]
                        })
                    }
                }
            }
        )
            ()
    }, [selected])
    // END LOGIC AUTHORS

    // LOGIC CATEGORIES
    const listTopics = useMemo(() => {
        if (!form.watch('categoryId')) {
            return []
        }
        return topics.filter((topic) => topic.categoryId == form.watch('categoryId'))
    }, [form.watch('categoryId'), topics, selected])

    // Efecto que resetea el campo de temas cuando se cambia la categoría
    useEffect(() => {
        // if (selected) {
        //     form.setValue('topicId', selected.topicId)
        // } else {
        // }
        form.setValue('topicId', undefined as unknown as number)
    }, [form.watch('categoryId')])
    // END LOGIC CATEGORIES

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])


    function onSubmit(data: PaperFormData) {
        if (action === 'create') {
            return create(data)
        }
        if (action === 'edit') {
            return update(data)
        }
        if (action === 'delete') {
            return deletePaper()
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6 min-h-52">
                        <pre className="text-xs col-span-2 hidden">
                            <code>
                                {JSON.stringify({
                                    form: form.watch(), action,
                                    // errors: form.formState.errors

                                }, null, 4)}
                            </code>
                        </pre>
                        {action === 'delete' && (
                            <div>
                                <TypographyH4 className="">
                                    ¿Estás seguro de eliminar a {selected?.title}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    name="webUserId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Usuario Web</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={'Escoge un usuario de la web'} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {webUsers.map((webUser) => (
                                                            <SelectItem key={webUser.id} value={webUser.id.toString()}>
                                                                {webUser.name} {webUser.lastName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="title"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Título</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Título"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="resume"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Resumen</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Resumen"
                                                    className="w-full resize-y"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="file"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem className="">
                                            <FormLabel>Archivo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload(e)}
                                                    disabled={uploading}
                                                    className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                                                />
                                            </FormControl>
                                            {uploading && (
                                                <div className="flex items-center space-x-2">
                                                    <LoaderCircle size={24} className="animate-spin text-blue-500" />
                                                    <span className="text-blue-500">Subiendo...</span>
                                                </div>
                                            )}
                                            {form.watch('file') && (
                                                // Visor de archivo
                                                <div className="flex items-center space-x-2">
                                                    <Link to={form.watch('file') || ''} target="_blank" className="text-blue-500 underline">
                                                        Ver archivo
                                                    </Link>
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="categoryId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Categoría</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={'Escoge una categoría'} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="topicId"
                                    control={form.control}
                                    disabled={form.watch('categoryId') === undefined}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Tema</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={'Escoge un tema'} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {listTopics
                                                            .map((topic) => (
                                                                <SelectItem key={topic.id} value={topic.id.toString()}>
                                                                    {topic.name}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="language"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Idioma</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Idioma"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='keywords'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Palabras clave</FormLabel>
                                            <FormControl>
                                                <Creatable
                                                    isMulti
                                                    {...field}
                                                    placeholder="Palabras clave"
                                                    className="w-full"
                                                    value={form.watch('keywords') as any &&
                                                        form.watch('keywords')?.map(tag =>
                                                            ({ value: tag, label: tag }))}
                                                    onChange={(options) => {
                                                        const map = options.map((option: any) => option.value)
                                                        form.setValue('keywords', map)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="flagEvent"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                                            <div className="space-y-0.5">
                                                <FormLabel>¿El trabajo fue presentado en este evento o  en otro similar?</FormLabel>
                                                <FormDescription>
                                                    Si marca esta casilla, se le pedirá información adicional.
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
                                {form.watch('flagEvent') && (
                                    <>
                                        <FormField
                                            name="eventWhere"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>{"Dónde?"}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Dónde?"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="eventWhich"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>En qué evento?</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="En qué evento?"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="eventDate"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>En qué fecha?</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="date"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                                <Separator />
                                <h1 className='text-xl font-bold'>Autores</h1>
                                {fields.map((field, index) => (
                                    <AuthorForm key={field.id} form={form} index={index} onRemove={() => remove(index)} />
                                ))}
                                <div className="flex flex-col gap-4">
                                    <Button type="button" onClick={() => append({
                                        type: form.watch('authors')[0]?.type === AuthorType.AUTOR ? AuthorType.COAUTOR : AuthorType.AUTOR
                                    } as AuthorFormData)}>
                                        Añadir Autor
                                    </Button>
                                    {/* <Button type="submit">Save</Button> */}
                                </div>
                            </div>
                        )}
                        {(action === 'receive-paper' || action === 'send-paper' || action === 'assign-paper' || action === 'review-paper' || action === 'approve-paper' || action === 'dismiss-paper') && (
                            <div className='flex flex-row gap-3 p-3 rounded-md mb-3'>
                                {action === 'send-paper' && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                                                {selectedLeader ? `${selectedLeader.name}` : "Asigna un líder"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar líder..." />
                                                <CommandList>
                                                    <CommandEmpty>Líder no encontrado.</CommandEmpty>
                                                    <CommandGroup>
                                                        {leaders.map((leader) => (
                                                            <CommandItem
                                                                key={leader.id}
                                                                onSelect={() => {
                                                                    setSelectedLeader(selectedLeader?.id === leader.id ? null : leader)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", selectedLeader?.id === leader.id ? "opacity-100" : "opacity-0")}
                                                                />
                                                                {`${leader.name}`}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {action === 'assign-paper' && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                                                {selectedReviewer ? `${selectedReviewer.name}` : "Asigna un revisor"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar revisor..." />
                                                <CommandList>
                                                    <CommandEmpty>Revisor no encontrado.</CommandEmpty>
                                                    <CommandGroup>
                                                        {reviewers.map((reviewer) => (
                                                            <CommandItem
                                                                key={reviewer.id}
                                                                onSelect={() => {
                                                                    setSelectedReviewer(selectedReviewer?.id === reviewer.id ? null : reviewer)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", selectedReviewer?.id === reviewer.id ? "opacity-100" : "opacity-0")}
                                                                />
                                                                {`${reviewer.name}`}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {action === 'approve-paper' && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                                                {selectedTypePaper ? `${paperTypes.find((type) => type.id === selectedTypePaper)?.name
                                                    }` : "Asigna un tipo de paper"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar tipo de paper..." />
                                                <CommandList>
                                                    <CommandEmpty>Tipo no encontrado.</CommandEmpty>
                                                    <CommandGroup>
                                                        {paperTypes.map((typePaper) => (
                                                            <CommandItem
                                                                key={typePaper.id}
                                                                onSelect={() => {
                                                                    setSelectedTypePaper(selectedTypePaper === typePaper.id ? null : typePaper.id)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", selectedTypePaper === typePaper.id ? "opacity-100" : "opacity-0")}
                                                                />
                                                                {`${typePaper.name}`}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                <Button
                                    disabled={loading || (action === 'assign-paper' && !selectedReviewer) || (action === 'send-paper' && !selectedLeader) || (action === 'approve-paper' && !selectedTypePaper)}
                                    type="button"
                                    onClick={handleChangeStatus}
                                    className="font-bold py-2 px-4 rounded duration-300 text-white">
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <LoaderCircle size={24} className="animate-spin text-white" />
                                        </div>
                                    ) : "Cambiar estado"}
                                </Button>
                            </div>
                        )}

                        {(action === 'create' || action === 'edit' || action === 'delete') && (
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
                        )}
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default PapersDialog