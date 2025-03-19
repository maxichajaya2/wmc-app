import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useSuppliersStore } from '../../store/suppliers.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useUsersStore } from '@/modules/back-office/users/store/users.store';
import { DocumentType, MapDocumentType, MapPersonType, PersonType } from '@/models';
import { namesCutterObject } from '@/utils/names-cutter-object';

const FormSchema = z.object({
    person: z.object({
        givenNames: z.string().optional(),
        lastName: z.string().optional(),
        legalName: z.string().optional(),
        address: z.string().min(1, {
            message: "Dirección es un campo requerido.",
        }),
        email: z.string().min(1, {
            message: "Correo electrónico es un campo requerido.",
        }).email({
            message: "Correo electrónico debe ser un email válido",
        }),
        phone: z.string()
            .min(9, { message: "El número de teléfono debe tener al menos 9 caracteres" })
            .max(14, { message: "El número de teléfono no debe exceder 14 caracteres" })
            .regex(/^(\+\d{1,3})?[0-9]{9}$/, {
                message: "Formato de número de teléfono inválido"
            }),
        documentType: z.nativeEnum(DocumentType),
        type: z.nativeEnum(PersonType),
        documentNumber: z.string()
    }).superRefine((val, ctx) => {
        if (val.documentType === DocumentType.DNI && val.documentNumber.length !== 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["documentNumber"],
                message: "El número de documento debe tener 8 caracteres",
            });
        }
        if (val.type === PersonType.JURIDICAL && val.documentNumber.length !== 11) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["documentNumber"],
                message: "El número de documento debe tener 11 caracteres",
            });
        }

        // Si el tipo es 'JURIDICAL'
        if (val.type === PersonType.JURIDICAL) {
            if (!val.legalName || val.legalName.trim().length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["legalName"],
                    message: "Razón Social es un campo requerido.",
                });
            }
        } else {
            if (!val.givenNames || val.givenNames.trim().length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["givenNames"],
                    message: "Nombres es un campo requerido.",
                });
            }
            if (!val.lastName || val.lastName.trim().length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["lastName"],
                    message: "Apellidos es un campo requerido.",
                });
            }
        }

    }),
})

function SupplierDialog() {

    const action = useSuppliersStore(state => state.action);
    const selected = useSuppliersStore(state => state.selected);
    const loading = useSuppliersStore(state => state.loading);
    const isOpenDialog = useSuppliersStore(state => state.isOpenDialog);
    const closeActionModal = useSuppliersStore(state => state.closeActionModal);
    const create = useSuppliersStore(state => state.create);
    const update = useSuppliersStore(state => state.update);
    const remove = useSuppliersStore(state => state.remove);

    const loadingSearch = useUsersStore(state => state.loading)
    const personFound = useUsersStore(state => state.personFound)

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Proveedor'
            case 'delete':
                return 'Eliminar Proveedor'
            case 'create':
                return 'Crear Proveedor'
            default:
                return 'Proveedor'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            person: {
                documentType: DocumentType.DNI,
                type: PersonType.NATURAL,
                address: '',
                documentNumber: '',
                email: '',
                givenNames: '',
                lastName: '',
                legalName: '',
                phone: '',
            },
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
        console.log('first')
        if (personFound && form.getValues('person.documentType') === DocumentType.DNI) {
            form.reset({
                ...form.getValues(),
                person: {
                    ...personFound,
                    documentType: DocumentType.DNI,
                    type: PersonType.NATURAL,
                    address: personFound?.address || form.getValues('person.address'),
                }
            })
        }
        // if (personFound && form.getValues('person.documentType') === DocumentType.RUC) {
        //     form.reset({
        //         ...form.getValues(),
        //         person: {
        //             documentType: DocumentType.RUC,
        //             type: PersonType.JURIDICAL,
        //             legalName: personFound?.fullName || form.getValues('person.legalName'),
        //             address: personFound?.address || form.getValues('person.address'),
        //             documentNumber: personFound?.documentNumber || form.getValues('person.documentNumber'),
        //         }
        //     })
        // }
    }, [personFound])

    function handleSearchDocumentNumber() {
    }

    useEffect(() => {
        if (form.watch('person.type') === PersonType.JURIDICAL) {
            // form.setValue('person.documentType', DocumentType.RUC)
        }
        if (form.watch('person.type') === PersonType.NATURAL) {
            form.setValue('person.documentType', DocumentType.DNI)
        }
    }, [form.watch('person.type')])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const names = namesCutterObject(data.person)
        if (action === 'create') {
            return create({
                ...data,
                person: {
                    ...data.person,
                    ...names
                }
            })
        }
        if (action === 'edit') {
            return update({
                ...data,
                person: {
                    ...data.person,
                    ...names
                }
            })
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
                                    ¿Estás seguro de eliminar a {selected?.person.givenNames} {selected?.person.lastName}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="person.type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Persona</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Tipo de Persona"
                                                    isDisabled={loading || loadingSearch}
                                                    options={
                                                        Object.values(PersonType).map((key) => ({
                                                            value: key,
                                                            label: MapPersonType[key],
                                                        }))
                                                    }
                                                    value={
                                                        Object.values(PersonType).map((key) => ({
                                                            value: key,
                                                            label: MapPersonType[key],
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('person.type', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el tipo de persona
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="person.documentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Documento</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Rol"
                                                    isDisabled={loading || loadingSearch}
                                                    options={
                                                        Object.values(DocumentType).map((key) => {
                                                            if (form.watch('person.type') === PersonType.JURIDICAL && key === DocumentType.DNI) {
                                                                return {
                                                                    value: null,
                                                                    label: null,
                                                                }
                                                            }
                                                            if (form.watch('person.type') === PersonType.JURIDICAL && key === DocumentType.CE) {
                                                                return {
                                                                    value: null,
                                                                    label: null,
                                                                }
                                                            }
                                                            if (form.watch('person.type') === PersonType.JURIDICAL && key === DocumentType.PASSPORT) {
                                                                return {
                                                                    value: null,
                                                                    label: null,
                                                                }
                                                            }
                                                            // if (form.watch('person.type') === PersonType.NATURAL && key === DocumentType.RUC) {
                                                            //     return {
                                                            //         value: null,
                                                            //         label: null,
                                                            //     }
                                                            // }
                                                            return {
                                                                value: key,
                                                                label: MapDocumentType[key],
                                                            }
                                                        }).filter((option) => option.value !== null)
                                                    }
                                                    value={
                                                        Object.values(DocumentType).map((key) => ({
                                                            value: key,
                                                            label: MapDocumentType[key],
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('person.documentType', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el tipo de documento
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="person.documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de documento</FormLabel>
                                            <FormControl>
                                                <div className='flex justify-between gap-x-2'>
                                                    <Input placeholder="Número de documento" type='number' disabled={loading || loadingSearch} {...field} />
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={100}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    type='button'
                                                                    onClick={handleSearchDocumentNumber}
                                                                    variant={'default'} className='p-0 m-0 h-10 w-11 rounded-full' disabled={loading || loadingSearch}>
                                                                    <SearchIcon strokeWidth={3} size={20} className='text-white' />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <span className='text-xs'>
                                                                    Búsqueda SUNAT
                                                                </span>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese su número de documento
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch('person.type') === PersonType.NATURAL && (
                                    <FormField
                                        control={form.control}
                                        name="person.givenNames"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombres</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombres" disabled={loading || loadingSearch} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese sus Nombres
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {form.watch('person.type') === PersonType.NATURAL && (
                                    <FormField
                                        control={form.control}
                                        name="person.lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Apellidos</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Apellidos" disabled={loading || loadingSearch} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese sus Apellidos
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {form.watch('person.type') === PersonType.JURIDICAL && (
                                    <FormField
                                        control={form.control}
                                        name="person.legalName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Razón Social</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Razón Social" disabled={loading || loadingSearch} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese sus Razón Social
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="person.email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" disabled={loading || loadingSearch} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese su Email
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="person.address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dirección" disabled={loading || loadingSearch} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese su Dirección
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="person.phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Teléfono" disabled={loading || loadingSearch} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese su Teléfono
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        <DialogFooter className='col-span-1 md:col-span-2 ml-auto flex flex-row gap-2'>
                            <Button
                                disabled={loading || loadingSearch}
                                type="submit"
                                className="font-bold py-2 px-4 rounded duration-300 text-white">
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : "Guardar"}
                            </Button>
                            <Button
                                disabled={loading || loadingSearch}
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

export default SupplierDialog