import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Switch, toast } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRoleStore } from '../../store/roles.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { ActionRoles, MapActionRoles, ModulesRoles } from '@/constants';
import { useCheckPermission } from '@/utils';
import { RoleName } from '@/models';

const FormSchema = z.object({
    name: z.string().min(3, {
        message: 'El nombre debe tener al menos 3 caracteres',
    }).max(255, {
        message: 'El nombre debe tener como máximo 255 caracteres',
    }),
})

function RolesDialog() {

    const ROLES_PERMISSIONS = useRoleStore(state => state.rolesPermissions);
    const action = useRoleStore(state => state.action);
    const selected = useRoleStore(state => state.selected);
    const loading = useRoleStore(state => state.loading);
    const isOpenDialog = useRoleStore(state => state.isOpenDialog);
    const closeActionModal = useRoleStore(state => state.closeActionModal);
    const create = useRoleStore(state => state.create);
    const update = useRoleStore(state => state.update);
    const remove = useRoleStore(state => state.remove);
    const addPermission = useRoleStore(state => state.addPermission);
    const deletePermission = useRoleStore(state => state.deletePermission);

    const hasAssignPermission = selected?.name !== RoleName.ADMIN && useCheckPermission(
        ModulesRoles.ROLES,
        ActionRoles.ASSIGN_PERMISSION
    );
    const hasDeniedPermission = selected?.name !== RoleName.ADMIN && useCheckPermission(
        ModulesRoles.ROLES,
        ActionRoles.UNASSIGN_PERMISSION
    );

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Rol'
            case 'delete':
                return 'Eliminar Rol'
            case 'create':
                return 'Crear Rol'
            case 'view-permissions':
                return `Permisos del Rol ${selected?.name}`
            default:
                return 'Rol'
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
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese Nombre del Rol
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        {action === 'view-permissions' && (
                            <div className="space-y-6">
                                {ROLES_PERMISSIONS.map((group, groupIndex) => (
                                    <div key={groupIndex}>
                                        <h3 className="text-lg font-semibold">{group.name}</h3>
                                        <div className="space-y-2 mt-2">
                                            {group.modules.map((modulePerm, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <Switch
                                                        checked={modulePerm.enabled}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                // Si está activado y el usuario tiene permiso para asignar
                                                                if (hasAssignPermission) {
                                                                    addPermission({
                                                                        module: modulePerm.module,
                                                                        action: modulePerm.action,
                                                                    });
                                                                } else {
                                                                    toast({
                                                                        title: "Permisos insuficientes",
                                                                        description: "No tienes permisos para asignar permisos a roles",
                                                                    });
                                                                }
                                                            } else {
                                                                // Si está desactivado y el usuario tiene permiso para eliminar
                                                                if (hasDeniedPermission) {
                                                                    deletePermission(modulePerm.id!);
                                                                } else {
                                                                    toast({
                                                                        title: "Permisos insuficientes",
                                                                        description: "No tienes permisos para eliminar permisos de roles",
                                                                    });
                                                                }
                                                            }
                                                        }}
                                                        disabled={loading}
                                                    />
                                                    <span>{`${MapActionRoles[modulePerm.action]}`}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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

export default RolesDialog