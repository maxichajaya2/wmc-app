import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, SelectSearch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useProductsStore } from '../../store/products.store';
import { useCategoryStore } from '@/modules/back-office/category/store/category.store';
import { useUnitsStore } from '@/modules/back-office/units/store/units.store';
import { DialogDescription } from '@radix-ui/react-dialog';

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Producto debe tener al menos 2 caracteres",
    }),
    description: z.string().min(2, {
        message: "Descripción debe tener al menos 2 caracteres",
    }),
    purchasePrice: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Precio de compra debe ser mayor a 0",
    })),
    salePrice: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Precio de venta debe ser mayor a 0",
    })),
    unitId: z.string().min(1, {
        message: "Unidad de medida es requerida",
    }),
    categoryId: z.string().min(1, {
        message: "Categoría es requerida",
    }),
})

function ProductDialog() {

    const action = useProductsStore(state => state.action);
    const selected = useProductsStore(state => state.selected);
    const loading = useProductsStore(state => state.loading);
    const isOpenDialog = useProductsStore(state => state.isOpenDialog);
    const closeActionModal = useProductsStore(state => state.closeActionModal);
    const create = useProductsStore(state => state.create);
    const update = useProductsStore(state => state.update);
    const remove = useProductsStore(state => state.remove);

    // categories
    const categories = useCategoryStore(state => state.data);
    // units
    const units = useUnitsStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Producto'
            case 'delete':
                return 'Eliminar Producto'
            case 'create':
                return 'Crear Producto'
            default:
                return 'Producto'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            categoryId: '',
            description: '',
            purchasePrice: 0,
            salePrice: 0,
            unitId: '',
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
            })
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
                            <div className='space-y-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el nombre del producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Descripción" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese la descripción del producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="purchasePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio de compra</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Precio de compra" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el precio de compra del producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="salePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio de venta</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Precio de venta" disabled={loading} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Ingrese el precio de venta del producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={(_) => (
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
                                                    defaultValue={[]}
                                                    onChange={(option: any) => form.setValue('categoryId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione la categoría del producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="unitId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unidad</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Unidad"
                                                    isDisabled={loading}
                                                    options={
                                                        units.map((key) => ({
                                                            value: key.id,
                                                            label: key.name,
                                                        }))
                                                    }
                                                    defaultValue={
                                                        units.map((key) => ({
                                                            value: key.id,
                                                            label: key.name,
                                                        })).find((option) => option.value === field.value)
                                                    }
                                                    onChange={(option: any) => form.setValue('unitId', option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione la unidad del producto
                                            </FormDescription>
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

export default ProductDialog