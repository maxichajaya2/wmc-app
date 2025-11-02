"use client"

import type React from "react"

import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    SelectSearch,
    Switch,
} from "@/components"
import { TypographyH4 } from "@/shared/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { Expand, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useConferenceStore } from "../../store/conference.store"
import { DialogDescription } from "@radix-ui/react-dialog"
import { DateClass } from "@/lib"
import { useRoomStore } from "@/modules/back-office/room/store/room.store"
import { CommonService } from "@/shared/services"
import { Link } from "react-router-dom"
import { ImageModal } from "@/modules/back-office/galleries/components/Dialog/ImageDialog"
import SpeakerSelect from "./SpeakerSelect"

const FormSchema = z
    .object({
        nameEs: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
        nameEn: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
        startDate: z.string().min(3, { message: "La fecha de inicio es requerida" }),
        endDate: z.string().min(3, { message: "La fecha de fin es requerida" }),
        roomId: z.number().int().positive().min(1, { message: "Sala es requerida" }),
        resumeEn: z.string().optional(),
        resumeEs: z.string().optional(),
        liveLink: z.string().optional(),
        liveImage: z.string().nullable().optional(),
        googleLink: z.string().optional(),
        outlookLink: z.string().optional(),
        speakers: z
            .array(
                z.object({
                    id: z.number(),
                    speakerTypeId: z.number(),
                }),
            )
            .optional(),
        calendarLink: z.string().optional(),
        isActive: z.boolean().optional().default(true),
    })
    .superRefine((val, ctx) => {
        if (val.liveLink !== "" && val.liveLink && !val.liveLink.includes("https://")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["liveLink"],
                message: "Ingrese una Url válida https://example.com",
            })
        }
        if (val.googleLink !== "" && val.googleLink && !val.googleLink.includes("https://")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["googleLink"],
                message: "Ingrese una Url válida https://example.com",
            })
        }
        if (val.outlookLink !== "" && val.outlookLink && !val.outlookLink.includes("https://")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["outlookLink"],
                message: "Ingrese una Url válida https://example.com",
            })
        }
    })
    .transform((data) => ({
        ...data,
        startDate: DateClass.DateToISOString(data.startDate),
        endDate: DateClass.DateToISOString(data.endDate),
        liveImage: data.liveImage || "",
    }))

function ConferencesDialog() {
    const action = useConferenceStore((state) => state.action)
    const selected = useConferenceStore((state) => state.selected)
    const loading = useConferenceStore((state) => state.loading)
    const isOpenDialog = useConferenceStore((state) => state.isOpenDialog)
    const closeActionModal = useConferenceStore((state) => state.closeActionModal)
    const create = useConferenceStore((state) => state.create)
    const update = useConferenceStore((state) => state.update)
    const remove = useConferenceStore((state) => state.remove)

    // List of rooms
    const rooms = useRoomStore((state) => state.data)

    const title = () => {
        switch (action) {
            case "edit":
                return "Editar Conferencia"
            case "delete":
                return "Eliminar Conferencia"
            case "create":
                return "Crear Conferencia"
            default:
                return "Conferencia"
        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nameEs: "",
            nameEn: "",
            isActive: true,
        },
    })

    useEffect(() => {
        if (selected) {
            form.reset({
                ...selected,
                startDate: DateClass.DateToFormat(selected.startDate, DateClass.FORMAT_INPUT),
                endDate: DateClass.DateToFormat(selected.endDate, DateClass.FORMAT_INPUT),
                speakers: selected.conferenceSpeakers?.map(spk => ({
                    id: spk.speakerId,
                    speakerTypeId: spk.speakerTypeId,
                })) || [],
            })
        }
    }, [selected])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [])

    /* START LOGIC FILE UPLOAD */
    const [uploading, setUploading] = useState(false)
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const handleFileUpload = async (
        inputName: "liveImage" | "googleLink" | "outlookLink" | "calendarLink",
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

    return (
        <Dialog
            open={isOpenDialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeActionModal()
                }
            }}
        >
            <DialogContent
                onPointerDownOutside={(e) => {
                    e.preventDefault()
                }}
            >
                <DialogHeader>
                    <DialogTitle>{title()}</DialogTitle>
                </DialogHeader>

                <DialogDescription />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-1 gap-0 md:gap-8 space-y-6">
                        <pre className="text-xs col-span-2 hidden">
                            <code>
                                {JSON.stringify(
                                    {
                                        form: form.watch(),
                                        action,
                                        errors: form.formState.errors,
                                    },
                                    null,
                                    4,
                                )}
                            </code>
                        </pre>
                        {action === "delete" && (
                            <div>
                                <TypographyH4 className="">¿Estás seguro de eliminar a {selected?.nameEs}?</TypographyH4>
                            </div>
                        )}
                        {(action === "create" || action === "edit") && (
                            <div className="space-y-6">
                                <FormField
                                    name="nameEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Nombre (ES)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" placeholder="Nombre (ES)" className="w-full" />
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
                                                <Input {...field} type="text" placeholder="Name (EN)" className="w-full" />
                                            </FormControl>
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
                                                <Input {...field} type="datetime-local" placeholder="Fecha de Inicio" className="w-full" />
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
                                                <Input {...field} type="datetime-local" placeholder="Fecha de Fin" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="roomId"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sala</FormLabel>
                                            <FormControl>
                                                <SelectSearch
                                                    placeholder="Sala"
                                                    isDisabled={loading}
                                                    options={rooms.map((key) => ({
                                                        value: key.id,
                                                        label: key.nameEs,
                                                    }))}
                                                    defaultValue={rooms
                                                        .map((key) => ({
                                                            value: key.id,
                                                            label: key.nameEs,
                                                        }))
                                                        .find((option) => option.value === field.value)}
                                                    onChange={(option: any) => form.setValue("roomId", option.value)}
                                                />
                                            </FormControl>
                                            <FormDescription>Seleccione la sala de la conferencia.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    name="speakerIds"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem>
                                            <FormLabel>Conferencistas</FormLabel>
                                            <FormControl>
                                                <Creatable
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    options={speakers.map(sp => ({ value: sp.id, label: sp.name }))}
                                                    value={form.watch('speakerIds') as any &&
                                                        form.watch('speakerIds')?.map(tag =>
                                                        ({
                                                            value: tag,
                                                            label: (
                                                                <span className="text-bold flex gap-1">
                                                                    <img src={speakers.find((c) => c.id === tag)?.photoUrl || ''} alt={speakers.find((c) => c.id === tag)?.name} className="w-6 h-6" />
                                                                    {speakers.find((c) => c.id === tag)?.name}
                                                                </span>
                                                            ),
                                                        }))}
                                                    isDisabled={loading}
                                                    className="w-full col-span-3 z-[99]"
                                                    onChange={(options) => {
                                                        const map = options.map((option: any) => option.value)
                                                        form.setValue('speakerIds', map)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Seleccione los conferencistas de la conferencia.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                                <SpeakerSelect form={form} loading={loading} />
                                <FormField
                                    name="resumeEs"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Resumen (ES)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" placeholder="Resumen (ES)" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="resumeEn"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Resume (EN)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" placeholder="Resume (EN)" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="liveLink"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Live Link</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" placeholder="Live Link" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="liveImage"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem className="">
                                            <FormLabel>Imagen Live</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload("liveImage", e)}
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
                                            {form.watch("liveImage") && (
                                                // Visor de archivo
                                                // <div className="flex items-center space-x-2">
                                                //     <Link to={form.watch('liveImage') || ''} target="_blank" className="text-blue-500 underline">
                                                //         Ver archivo
                                                //     </Link>
                                                // </div>
                                                <Card className="relative overflow-hidden group">
                                                    <CardContent className="p-2">
                                                        <div className="relative">
                                                            <img
                                                                src={form.watch("liveImage") || "/placeholder.svg"}
                                                                alt={`Image`}
                                                                className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => setExpandedImage(form.watch("liveImage") || "")}
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
                                    name="googleLink"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Google Link </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" placeholder="Google Link" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="outlookLink"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Outlook Link </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" placeholder="Outlook Link" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="calendarLink"
                                    control={form.control}
                                    render={(_) => (
                                        <FormItem className="">
                                            <FormLabel>Invitación .ics</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload("calendarLink", e)}
                                                    disabled={uploading}
                                                    // accept .ics
                                                    accept="text/calendar"
                                                    className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-none py-0"
                                                />
                                            </FormControl>
                                            {uploading && (
                                                <div className="flex items-center space-x-2">
                                                    <LoaderCircle size={24} className="animate-spin text-blue-500" />
                                                    <span className="text-blue-500">Subiendo...</span>
                                                </div>
                                            )}
                                            {form.watch("calendarLink") && (
                                                // Visor de archivo
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={form.watch("calendarLink") || ""}
                                                        target="_blank"
                                                        className="text-blue-500 underline"
                                                    >
                                                        Ver archivo
                                                    </Link>
                                                </div>
                                            )}
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
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <DialogFooter className="col-span-1 md:col-span-2 ml-auto flex flex-row gap-2">
                            <Button disabled={loading} type="submit" className="font-bold py-2 px-4 rounded duration-300 text-white">
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : (
                                    "Guardar"
                                )}
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={closeActionModal}
                                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded duration-300"
                            >
                                Cancelar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ConferencesDialog

