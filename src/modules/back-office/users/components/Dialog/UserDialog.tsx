import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useUsersStore } from '../../store/users.store';
import { useRoleStore } from '@/modules/back-office/roles/store/roles.store';
import { useCategoryStore } from '@/modules/back-office/category/store/category.store';

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Usuario debe tener al menos 2 caracteres",
    }),
    password: z.string().optional().default(''),
    email: z.string().min(1, {
        message: "Correo electrónico es un campo requerido.",
    }).email({
        message: "Correo electrónico debe ser un email válido",
    }),
    roleId: z.number().min(1, {
        message: "Rol es un campo requerido",
    }),
    categoryId: z.number().min(1, {
        message: "Rol es un campo requerido",
    })
}).transform((val) => {
    return {
        ...val,
        password: val.password || undefined,
    }
});

function UserDialog() {
    const create = useUsersStore(state => state.create)
    const update = useUsersStore(state => state.update)
    const remove = useUsersStore(state => state.remove)

    const action = useUsersStore(state => state.action)
    const selected = useUsersStore(state => state.selected)
    const loading = useUsersStore(state => state.loading)
    const isOpenDialog = useUsersStore(state => state.isOpenDialog)
    const closeActionModal = useUsersStore(state => state.closeActionModal)
    const categories = useCategoryStore(state => state.data)
    // roles
    const roles = useRoleStore(state => state.data)

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Usuario'
            case 'delete':
                return 'Eliminar Usuario'
            case 'create':
                return 'Crear Usuario'
            default:
                return 'Usuario'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema), defaultValues: {
            name: '',
            password: '',
            roleId: 0,
            email: '',
        }
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
                roleId: +selected.role.id,
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
            const password = data.password;
            if (!password || password === '') {
                return form.setError('password', {
                    type: 'required',
                    message: 'La contraseña es requerida',
                });
            }
            return create({
                ...data,
                password,
            })
        }
        if (action === 'edit') {
            return update({
                ...data,
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-1 md:grid-cols-1 gap-0 md:gap-8 space-y-6">
                        <pre className="text-xs hidden">
                            <code>
                                {JSON.stringify({ form: form.watch(), action }, null, 4)}
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
                            <>
                                <div className='space-y-6'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombres</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombres" disabled={loading} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese sus Nombres
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" disabled={loading} {...field} />
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Contraseña"
                                                        disabled={loading}
                                                        {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese su contraseña
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="roleId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rol</FormLabel>
                                                <FormControl>
                                                    <SelectSearch
                                                        placeholder="Rol"
                                                        isDisabled={loading}
                                                        options={
                                                            roles.map((role) => ({
                                                                value: role.id,
                                                                label: role.name,
                                                            }))
                                                        }
                                                        value={
                                                            roles.map((role) => ({
                                                                value: role.id,
                                                                label: role.name,
                                                            })).find((option) => +option.value === +field.value)
                                                        }
                                                        onChange={(option: any) => form.setValue('roleId', option.value)}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Ingrese el rol del usuario
                                                </FormDescription>
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
                            </>
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

export default UserDialog