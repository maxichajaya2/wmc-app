"use client"

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components"
import { TypographyH4 } from "@/shared/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { Briefcase, Currency, FileText, LoaderCircle, Mail, MapPin, Phone, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useEnrollmentStore } from "../../store/enrollments.store"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Link } from "react-router-dom"
import { DocumentType, MapCurrency, PaymentMethodEnrollMent } from "@/models"

// Actualizar el FormSchema para incluir todos los campos adicionales
const FormSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    paternalName: z.string().min(3, { message: "El apellido paterno debe tener al menos 3 caracteres" }),
    maternalName: z.string().min(3, { message: "El apellido materno debe tener al menos 3 caracteres" }),
    documentType: z.nativeEnum(DocumentType),
    documentNumber: z.string().min(3, { message: "El número de documento debe tener al menos 3 caracteres" }),
    email: z.string().email({ message: "El email no es válido" }),
    phoneNumber: z.string().min(6, { message: "El número de teléfono debe tener al menos 6 caracteres" }),
    // Campos adicionales
    nationality: z.string().min(2, { message: "La nacionalidad debe tener al menos 2 caracteres" }),
    company: z.string().optional(),
    position: z.string().optional(),
    countryCode: z.string().optional(),
    address: z.string().optional(),
    amount: z.string().optional(),
    fileUrl: z.string().optional(),
    factType: z.string().optional(),
    factRuc: z.string().optional(),
    factRazonSocial: z.string().optional(),
    factAddress: z.string().optional(),
    factPerson: z.string().optional(),
    factPhone: z.string().optional(),
    paymentMethod: z.nativeEnum(PaymentMethodEnrollMent).optional(),
    paymentFile: z.string().optional(),
    departmentId: z.number().optional(),
    provinceId: z.number().optional(),
    districtId: z.number().optional(),
    feeId: z.number().optional(),
})

function EnrollmentDialog() {
    const action = useEnrollmentStore((state) => state.action)
    const selected = useEnrollmentStore((state) => state.selected)
    const loading = useEnrollmentStore((state) => state.loading)
    const isOpenDialog = useEnrollmentStore((state) => state.isOpenDialog)
    const closeActionModal = useEnrollmentStore((state) => state.closeActionModal)
    const create = useEnrollmentStore((state) => state.create)
    const update = useEnrollmentStore((state) => state.update)
    const remove = useEnrollmentStore((state) => state.remove)

    const [activeTab, setActiveTab] = useState("personal")

    const title = () => {
        switch (action) {
            case "edit":
                return "Editar Inscripción"
            case "delete":
                return "Eliminar Inscripción"
            case "create":
                return "Crear Inscripción"
            case "view":
                return "Ver Inscripción"
            default:
                return "Inscripción"
        }
    }

    // Actualizar los defaultValues en useForm
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            paternalName: "",
            maternalName: "",
            documentType: DocumentType.DNI,
            documentNumber: "",
            email: "",
            phoneNumber: "",
            // Campos adicionales
            nationality: "",
            company: "",
            position: "",
            countryCode: "",
            address: "",
            amount: "",
            fileUrl: "",
            factType: "",
            factRuc: "",
            factRazonSocial: "",
            factAddress: "",
            factPerson: "",
            factPhone: "",
            paymentMethod: undefined,
            paymentFile: "",
            departmentId: undefined,
            provinceId: undefined,
            districtId: undefined,
            feeId: undefined,
        },
    })

    // Actualizar el useEffect para cargar los datos del enrollment seleccionado
    useEffect(() => {
        if (selected) {
            form.reset({
                name: selected.name,
                paternalName: selected.paternalName,
                maternalName: selected.maternalName,
                documentType: selected.documentType,
                documentNumber: selected.documentNumber,
                email: selected.email,
                phoneNumber: selected.phoneNumber,
                // Campos adicionales
                nationality: selected.nationality,
                company: selected.company,
                position: selected.position,
                countryCode: selected.countryCode,
                address: selected.address,
                amount: selected.amount,
                fileUrl: selected.fileUrl || "",
                factType: selected.factType,
                factRuc: selected.factRuc || "",
                factRazonSocial: selected.factRazonSocial || "",
                factAddress: selected.factAddress,
                factPerson: selected.factPerson,
                factPhone: selected.factPhone,
                paymentMethod: selected.paymentMethod,
                paymentFile: selected.paymentFile,
                departmentId: selected.departmentId,
                provinceId: selected.provinceId,
                districtId: selected.districtId,
                feeId: selected.feeId,
            })
        }
    }, [selected, form])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [form])

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (action === "create") {
            return create(data)
        }
        if (action === "edit") {
            return update(data)
        }
        if (action === "delete") {
            return remove()
        }
    }

    // For view mode, make all fields read-only
    const isViewMode = action === "view"
    const renderField = (name: any, label: string, icon: React.ReactNode, type = "text") => (
        <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input {...field} type={type} placeholder={label} className="pl-10 w-full" readOnly={isViewMode} />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )

    return (
        <Dialog
            open={isOpenDialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeActionModal()
                }
            }}
        >
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <DialogDescription />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {action === "delete" ? (
                            <TypographyH4>
                                ¿Estás seguro de eliminar la inscripción de {selected?.name} {selected?.paternalName}{" "}
                                {selected?.maternalName}?
                            </TypographyH4>
                        ) : (
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="contact">Contacto</TabsTrigger>
                                    <TabsTrigger value="course">Curso</TabsTrigger>
                                    <TabsTrigger value="payment">Pago</TabsTrigger>
                                </TabsList>
                                <TabsContent value="personal" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("name", "Nombre", <User className="h-5 w-5 text-gray-400" />)}
                                        {renderField("paternalName", "Apellido Paterno", <User className="h-5 w-5 text-gray-400" />)}
                                        {renderField("maternalName", "Apellido Materno", <User className="h-5 w-5 text-gray-400" />)}
                                        <FormField
                                            name="documentType"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Documento</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isViewMode}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione tipo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                                                            <SelectItem value={DocumentType.CE}>CE</SelectItem>
                                                            <SelectItem value={DocumentType.PASSPORT}>Pasaporte</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {renderField(
                                            "documentNumber",
                                            "Número de Documento",
                                            <FileText className="h-5 w-5 text-gray-400" />,
                                        )}
                                        {renderField("nationality", "Nacionalidad", <MapPin className="h-5 w-5 text-gray-400" />)}
                                    </div>
                                </TabsContent>
                                <TabsContent value="contact" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("email", "Email", <Mail className="h-5 w-5 text-gray-400" />, "email")}
                                        {renderField("phoneNumber", "Teléfono", <Phone className="h-5 w-5 text-gray-400" />)}
                                        {renderField("company", "Empresa", <Briefcase className="h-5 w-5 text-gray-400" />)}
                                        {renderField("position", "Cargo", <Briefcase className="h-5 w-5 text-gray-400" />)}
                                        {renderField("address", "Dirección", <MapPin className="h-5 w-5 text-gray-400" />)}
                                        {/* Add fields for department, province, and district here */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                name="departmentId"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem className="">
                                                        <FormLabel>Departamento</FormLabel>
                                                        {isViewMode ? (
                                                            <Input value={selected?.department?.name || ""} readOnly className="w-full" />
                                                        ) : (
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccione departamento" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {/* Aquí deberías mapear los departamentos disponibles */}
                                                                    <SelectItem value="1">Lima</SelectItem>
                                                                    <SelectItem value="2">Arequipa</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="provinceId"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem className="">
                                                        <FormLabel>Provincia</FormLabel>
                                                        {isViewMode ? (
                                                            <Input value={selected?.province?.name || ""} readOnly className="w-full" />
                                                        ) : (
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccione provincia" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {/* Aquí deberías mapear las provincias disponibles */}
                                                                    <SelectItem value="1">Lima</SelectItem>
                                                                    <SelectItem value="2">Callao</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                name="districtId"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem className="">
                                                        <FormLabel>Distrito</FormLabel>
                                                        {isViewMode ? (
                                                            <Input value={selected?.district?.name || ""} readOnly className="w-full" />
                                                        ) : (
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                                defaultValue={field.value?.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccione distrito" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {/* Aquí deberías mapear los distritos disponibles */}
                                                                    <SelectItem value="1">Miraflores</SelectItem>
                                                                    <SelectItem value="2">San Isidro</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="course" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4">{/* Add fields for feeId and amount here */}
                                        <FormField
                                            name="feeId"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Tarifa</FormLabel>
                                                    {isViewMode ? (
                                                        <Input value={selected?.fee?.nameEs || ""} readOnly className="w-full" />
                                                    ) : (
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                            defaultValue={field.value?.toString()}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccione tarifa" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {/* Aquí deberías mapear las tarifas disponibles */}
                                                                <SelectItem value="1">Tarifa Regular</SelectItem>
                                                                <SelectItem value="2">Tarifa Miembro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {renderField("amount", `Monto ${MapCurrency[selected?.fee.currency!]}`, <Currency className="h-5 w-5 text-gray-400" />, "number")}
                                        <Input value={selected?.fee?.course?.nameEs || ""} readOnly className="w-full" />
                                    </div>
                                </TabsContent>
                                <TabsContent value="payment" className="mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("factType", "Tipo de Facturación", <FileText className="h-5 w-5 text-gray-400" />)}
                                        {renderField("factRuc", "RUC", <FileText className="h-5 w-5 text-gray-400" />)}
                                        {renderField("factRazonSocial", "Razón Social", <Briefcase className="h-5 w-5 text-gray-400" />)}
                                        {renderField(
                                            "factAddress",
                                            "Dirección de Facturación",
                                            <MapPin className="h-5 w-5 text-gray-400" />,
                                        )}
                                        {renderField("factPerson", "Persona de Contacto", <User className="h-5 w-5 text-gray-400" />)}
                                        {renderField("factPhone", "Teléfono de Contacto", <Phone className="h-5 w-5 text-gray-400" />)}
                                        <FormField
                                            name="paymentMethod"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Método de Pago</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isViewMode}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione método" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={PaymentMethodEnrollMent.DEPOSIT}>Depósito</SelectItem>
                                                            <SelectItem value={PaymentMethodEnrollMent.VISA}>Visa</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {renderField("paymentFile", "Archivo de Pago", <FileText className="h-5 w-5 text-gray-400" />)}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}

                        {isViewMode && selected && (
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-lg font-medium mb-4">Información Adicional</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel>Estado de Pago</FormLabel>
                                        <Input
                                            value={
                                                selected.paymentStatus === 1
                                                    ? "Pagado"
                                                    : selected.paymentStatus === 2
                                                        ? "Pendiente"
                                                        : "Rechazado"
                                            }
                                            readOnly
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <FormLabel>Estado de Registro</FormLabel>
                                        <Input
                                            value={
                                                selected.registrationStatus === 0
                                                    ? "Registrado"
                                                    : selected.registrationStatus === 1
                                                        ? "Enviado a SIE"
                                                        : "Anulado"
                                            }
                                            readOnly
                                            className="w-full"
                                        />
                                    </div>
                                    {selected.registrationNumber && (
                                        <div>
                                            <FormLabel>Número de Registro</FormLabel>
                                            <Input value={selected.registrationNumber} readOnly className="w-full" />
                                        </div>
                                    )}
                                    {selected.fileUrl && (
                                        <div>
                                            <FormLabel>Archivo Adjunto</FormLabel>
                                            <div className="flex items-center space-x-2">
                                                <Link to={selected.fileUrl} target="_blank" className="text-blue-500 underline">
                                                    Ver archivo adjunto
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {(action === "create" || action === "edit" || action === "delete") && (
                                <Button type="submit" disabled={loading || isViewMode} className="w-full sm:w-auto">
                                    {loading ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : action === "delete" ? (
                                        "Confirmar Eliminación"
                                    ) : (
                                        "Guardar"
                                    )}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeActionModal}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {isViewMode ? "Cerrar" : "Cancelar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EnrollmentDialog