import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components';
import { TypographyH4 } from '@/shared/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useFeeStore } from '../../store/fees.store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Currency, MapCurrency } from '@/models';
import { useCourseStore } from '@/modules/back-office/courses/store/course.store';
import { DateClass } from '@/lib';

const FormSchema = z.object({
    nameEs: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    nameEn: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    sieCode: z.string().min(1, { message: 'El código SIE es requerido' }),
    courseId: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Debe seleccionar un curso"
    })),
    memberFlag: z.boolean().optional().default(false),
    flagFile: z.boolean().optional().default(false),
    startDate: z.string().min(3, { message: "La fecha de inicio es requerida" }),
    endDate: z.string().min(3, { message: "La fecha de fin es requerida" }),
    currency: z.nativeEnum(Currency, { message: "Debe seleccionar una moneda" }),
    amount: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Debe ingresar un monto"
    })),
    noteEs: z.string().optional(),
    noteEn: z.string().optional(),
    isActive: z.boolean().optional().default(true),
}).transform((data) => ({
    ...data,
    startDate: DateClass.DateToISOString(data.startDate),
    endDate: DateClass.DateToISOString(data.endDate),
}))

function FeesDialog() {

    const action = useFeeStore(state => state.action);
    const selected = useFeeStore(state => state.selected);
    const loading = useFeeStore(state => state.loading);
    const isOpenDialog = useFeeStore(state => state.isOpenDialog);
    const closeActionModal = useFeeStore(state => state.closeActionModal);
    const create = useFeeStore(state => state.create);
    const update = useFeeStore(state => state.update);
    const remove = useFeeStore(state => state.remove);
    const courses = useCourseStore(state => state.data);

    const title = () => {
        switch (action) {
            case 'edit':
                return 'Editar Tarifa'
            case 'delete':
                return 'Eliminar Tarifa'
            case 'create':
                return 'Crear Tarifa'
            default:
                return 'Tarifa'
        }
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nameEs: '',
            nameEn: '',
            courseId: 0,
            isActive: true,
            amount: 0,
            currency: Currency.PEN,
            memberFlag: false,
            flagFile: false,
            sieCode: '',
            startDate: '',
            endDate: '',
            noteEs: '',
            noteEn: '',
        },
    })


    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
                amount: Number(selected.amount),
                startDate: DateClass.DateToFormat(selected.startDate, DateClass.FORMAT_INPUT_SHORT),
                endDate: DateClass.DateToFormat(selected.endDate, DateClass.FORMAT_INPUT_SHORT),
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
                                    ¿Estás seguro de eliminar a {selected?.nameEs}?
                                </TypographyH4>
                            </div>
                        )}
                        {(action === 'create' || action === 'edit') && (
                            <div className='space-y-6'>
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
                                    name="sieCode"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Código SIE</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Código SIE"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="memberFlag"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                                            <div className="space-y-0.5">
                                                <FormLabel>Socio</FormLabel>
                                                <FormDescription>
                                                    Si el monto es para socios, active esta opción.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="flagFile"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-2 col-span-2">
                                            <div className="space-y-0.5">
                                                <FormLabel>Archivo requerido</FormLabel>
                                                <FormDescription>
                                                    Si la tarifa requiere un archivo, active esta opción.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="courseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{'Curso'}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={'Seleccione un curso'} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courses.map((type) => (
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
                                    name="startDate"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Fecha de Inicio</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" placeholder="Fecha de Inicio" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="endDate"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Fecha de Fin</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" placeholder="Fecha de Fin" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Currency & Amount */}
                                <FormField
                                    name="currency"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Moneda</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={'Seleccione una moneda'} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(Currency).map((currency) => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {MapCurrency[currency]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="amount"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Monto</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" placeholder="Monto" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="noteEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Nota (ES)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Nota (ES)"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="noteEn"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Note (EN)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Note (EN)"
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

export default FeesDialog