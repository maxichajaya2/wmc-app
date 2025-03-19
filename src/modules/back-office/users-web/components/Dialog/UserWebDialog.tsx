import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useUserWebStore } from '../../store/users-web.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { DocumentType } from '@/models';

const FormSchema = z.object({
    email: z.string().email().min(1, {
        message: 'Email es requerido',
    }),
    password: z.string().min(1, {
        message: 'Password es requerido',
    }),
    name: z.string().min(1, {
        message: 'Nombre es requerido',
    }),
    lastName: z.string().min(1, {
        message: 'Apellido es requerido',
    }),
    documentType: z.nativeEnum(DocumentType),
    documentNumber: z.string(),
}).superRefine((val, ctx) => {
    if (val.documentType === DocumentType.DNI && val.documentNumber.length !== 8) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["documentNumber"],
            message: 'El DNI debe tener 8 dígitos',
        });
    }
    if (val.documentType === DocumentType.CE && val.documentNumber.length < 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["documentNumber"],
            message: 'Este campo es requerido',
        });
    }
}).transform((val) => {
    return {
        email: val.email,
        name: val.name,
        lastName: val.lastName,
        documentNumber: val.documentNumber,
        documentType: val.documentType,
        password: val.password || undefined,
    }
});

function UserWebDialog() {
    const [showPassword, setShowPassword] = useState(false);
    const action = useUserWebStore(state => state.action);
    const selected = useUserWebStore(state => state.selected);
    const loading = useUserWebStore(state => state.loading);
    const isOpenDialog = useUserWebStore(state => state.isOpenDialog);
    const closeActionModal = useUserWebStore(state => state.closeActionModal);
    const create = useUserWebStore(state => state.create);
    const update = useUserWebStore(state => state.update);
    const remove = useUserWebStore(state => state.remove);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Usuario Web'
            case 'delete':
                return 'Eliminar Usuario Web'
            case 'create':
                return 'Crear Usuario Web'
            default:
                return 'Usuario Web'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            documentType: DocumentType.DNI,
            name: '',
            lastName: '',
            email: '',
            documentNumber: '',
            password: '',
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
                                            <FormLabel>{'Nombres'}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={'Nombres'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Apellidos'}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={'Apellidos'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Email'}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={'Email'} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Contraseña'}</FormLabel>
                                            <FormControl>
                                                <div className='relative'>
                                                    <Input type={showPassword ? 'text' : 'password'} placeholder={'Contraseña'} {...field} />
                                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeIcon size={24} className='pb-1 m-0' /> : <EyeOffIcon size={24} className='pb-1 m-0' />}

                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="documentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Tipo Documento'}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={'Tipo Documento'} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                                                    <SelectItem value={DocumentType.CE}>CE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Nro Documento'}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={'Nro Documento'} {...field} />
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

export default UserWebDialog