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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
    Progress,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components"
import { TypographyH4 } from "@/shared/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { Expand, LoaderCircle, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useRef, useState } from "react"
import { useGalleryStore } from "../../store/gallery.store"
import { DialogDescription } from "@radix-ui/react-dialog"
import { GalleryType, ImageSize, MapGalleryType, MapImageSize, type PayloadGallery } from "@/models"
import { CommonService } from "@/shared/services"
import { ImageModal } from "./ImageDialog"
import { DateClass } from "../../../../../lib/date"
import { getFileSize } from "@/lib"

// PayloadGallery
const FormSchema = z
    .object({
        urlKey: z
            .string()
            .min(3, {
                message: "La urlKey debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "La urlKey debe tener como máximo 255 caracteres",
            }),
        titleEn: z
            .string()
            .min(3, {
                message: "El titulo EN debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "El titulo EN debe tener como máximo 255 caracteres",
            }),
        titleEs: z
            .string()
            .min(3, {
                message: "El titulo ES debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "El titulo ES debe tener como máximo 255 caracteres",
            }),
        descriptionEn: z
            .string()
            .min(3, {
                message: "La descripción EN debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "La descripción EN debe tener como máximo 255 caracteres",
            }),
        descriptionEs: z
            .string()
            .min(3, {
                message: "La descripción ES debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "La descripción ES debe tener como máximo 255 caracteres",
            }),
        contentEn: z
            .string()
            .min(3, {
                message: "El Contenido EN debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "El Contenido ES debe tener como máximo 255 caracteres",
            }),
        contentEs: z
            .string()
            .min(3, {
                message: "El Contenido ES debe tener al menos 3 caracteres",
            })
            .max(255, {
                message: "El Contenido ES debe tener como máximo 255 caracteres",
            }),
        type: z.nativeEnum(GalleryType).default(GalleryType.SLIDER),
        size: z.nativeEnum(ImageSize).default(ImageSize.LARGE),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        images: z.array(
            z.object({
                id: z.number().optional(),
                valueEs: z
                    .string()
                    .url({
                        message: "Url no válida (https://example.com)",
                    })
                    .min(1, {
                        message: "La url debe ser obligatoria",
                    }),
                valueEn: z
                    .string()
                    .url({
                        message: "Url no válida (https://example.com)",
                    })
                    .min(1, {
                        message: "La url debe ser obligatoria",
                    }),
                urlEs: z.string().optional(),
                urlEn: z.string().optional(),
                isTargetBlank: z.boolean().default(false),
                sort: z.number().default(0),
            }),
        ),
    })
    .superRefine((val, ctx) => {
        if (val.type === GalleryType.BANNER && !val.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["startDate"],
                message: "Este campo es requerido",
            })
        }
        if (val.type === GalleryType.BANNER && !val.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "Este campo es requerido",
            })
        }
    })
    .transform((data) => ({
        ...data,
        startDate: data.startDate ? DateClass.DateToISOString(data.startDate) : undefined,
        endDate: data.endDate ? DateClass.DateToISOString(data.endDate) : undefined,
    }))

function GalleryActionDialog() {
    const action = useGalleryStore((state) => state.action)
    const selected = useGalleryStore((state) => state.selected)
    const loading = useGalleryStore((state) => state.loading)
    const isOpenDialog = useGalleryStore((state) => state.isOpenDialog)
    const closeActionModal = useGalleryStore((state) => state.closeActionModal)
    const create = useGalleryStore((state) => state.create)
    const update = useGalleryStore((state) => state.update)
    const remove = useGalleryStore((state) => state.remove)

    const title = () => {
        switch (action) {
            case "edit":
                return "Editar Galería"
            case "delete":
                return "Eliminar Galería"
            case "create":
                return "Crear Galería"
            default:
                return "Galería"
        }
    }

    const form = useForm<PayloadGallery>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            titleEn: "",
            titleEs: "",
            urlKey: "",
            contentEn: "",
            contentEs: "",
            descriptionEn: "",
            descriptionEs: "",
            endDate: undefined,
            startDate: undefined,
            type: GalleryType.SLIDER,
            size: undefined,
            images: [],
        },
    })

    useEffect(() => {
        if (selected) {
            // Map the old structure to the new one
            const mappedImages = selected.images.map((img) => ({
                ...img,
                valueEs: img.urlEs || "",
                valueEn: img.urlEn || "",
            }))

            form.reset({
                ...selected,
                images: mappedImages,
                startDate: selected.startDate ? DateClass.DateToFormat(selected.startDate, DateClass.FORMAT_INPUT) : undefined,
                endDate: selected.endDate ? DateClass.DateToFormat(selected.endDate, DateClass.FORMAT_INPUT) : undefined,
            })
        }
    }, [selected, form])

    // Reset form when dialog is closed
    useEffect(() => {
        return () => {
            form.reset()
        }
    }, [form])

    // Actualizar la función onSubmit para asegurar que los datos se mapeen correctamente
    function onSubmit(data: PayloadGallery) {
        // Map the new structure back to the expected API format
        const mappedData = {
            ...data,
            images: data.images.map((img) => ({
                ...img,
                urlEs: img.valueEs,
                urlEn: img.valueEn,
            })),
        }

        if (action === "create") {
            return create(mappedData)
        }
        if (action === "edit") {
            return update(mappedData)
        }
        if (action === "delete") {
            return remove()
        }
    }

    // START UPLOAD FILE LOGIC
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
    const [progress, setProgress] = useState(0)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]) // Array de referencias
    const [expandedImage, setExpandedImage] = useState<string | null>(null)
    const MAX_IMAGES = 10 // Límite máximo de imágenes

    // Modificar la función handleImageUpload para aceptar el parámetro de idioma
    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        index?: number,
        language?: "es" | "en",
    ) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        // Verificar si se excede el límite de imágenes
        const currentImages = form.getValues("images")
        if (currentImages.length + files.length > MAX_IMAGES && index === undefined) {
            alert(`No puedes subir más de ${MAX_IMAGES} imágenes.`)
            return
        }

        setUploading(true)
        setProgress(0)
        const totalFiles = files.length
        const uploadPromises = Array.from(files).map((file, i) => {
            const fileKey = `${file.name}-${i}`
            setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }))

            return CommonService.uploadFile(file, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                setUploadProgress((prev) => ({ ...prev, [fileKey]: percentCompleted }))
            }).then((imageUrl) => {
                setUploadProgress((prev) => {
                    const newProgress = { ...prev }
                    delete newProgress[fileKey]
                    return newProgress
                })
                // aumentar el numero de progreso segun el total de archivos entre 100
                setProgress((prev) => prev + 100 / totalFiles)
                return imageUrl
            })
        })

        try {
            const imageUrls = await Promise.all(uploadPromises)
            const currentImages = form.getValues("images")

            if (index !== undefined) {
                // Reemplazar la imagen existente
                const newImages = [...currentImages]

                // Si se especifica un idioma, solo actualizar ese valor
                if (language === "es") {
                    newImages[index].valueEs = imageUrls[0]
                    newImages[index].urlEs = imageUrls[0]
                } else if (language === "en") {
                    newImages[index].valueEn = imageUrls[0]
                    newImages[index].urlEn = imageUrls[0]
                } else {
                    // Si no se especifica idioma, actualizar ambos (compatibilidad)
                    newImages[index].valueEs = imageUrls[0]
                    newImages[index].valueEn = imageUrls[0]
                    newImages[index].urlEs = imageUrls[0]
                    newImages[index].urlEn = imageUrls[0]
                }

                form.setValue("images", newImages)
            } else {
                // Agregar nuevas imágenes
                const newImages = imageUrls.map((url, i) => ({
                    valueEs: url, // Establecer la misma URL para ambos idiomas inicialmente
                    valueEn: url,
                    urlEs: url,
                    urlEn: url,
                    sort: currentImages.length + i,
                    isTargetBlank: false,
                }))
                form.setValue("images", [...currentImages, ...newImages])
            }
        } catch (error) {
            console.error("Error al subir las imágenes:", error)
            alert("Hubo un error al subir las imágenes. Inténtalo de nuevo.")
        } finally {
            setUploading(false)
            event.target.value = "" // Resetear el input de archivo
        }
    }

    const handleRemoveImage = (index: number) => {
        const currentImages = form.getValues("images")
        const newImages = currentImages.filter((_, i) => i !== index)
        form.setValue("images", newImages)
    }

    const handleSortChange = (index: number, newSort: number) => {
        const currentImages = form.getValues("images")
        const newImages = [...currentImages]
        newImages[index].sort = newSort
        form.setValue("images", newImages)
    }

    const handleValueEsChange = (index: number, newUrl: string) => {
        const currentImages = form.getValues("images")
        const newImages = [...currentImages]
        newImages[index].valueEs = newUrl
        form.setValue("images", newImages)
    }

    const handleValueEnChange = (index: number, newUrl: string) => {
        const currentImages = form.getValues("images")
        const newImages = [...currentImages]
        newImages[index].valueEn = newUrl
        form.setValue("images", newImages)
    }

    // END UPLOAD FILE LOGIC

    // START LOGIC TO GET FILE SIZE
    const [fileSizes, setFileSizes] = useState<{
        [key: string]: {
            es: string;
            en: string;
        }
    }>({})
    const images = form.getValues("images")

    // Estado con valores anteriores para evitar renders innecesarios
    const previousValuesRef = useRef<{
        es: string;
        en: string;
    }[]>([])

    useEffect(() => {
        const imageValues = images.map((img) => ({
            es: img.valueEs,
            en: img.valueEn,
        }))

        // Comparar valores anteriores con los nuevos
        if (JSON.stringify(previousValuesRef.current) === JSON.stringify(imageValues)) {
            return // No hacer nada si los valores no cambiaron
        }

        // Actualizar la referencia con los nuevos valores
        previousValuesRef.current = imageValues

        const fetchFileSizes = async () => {
            const sizes: {
                [key: string]: {
                    es: string;
                    en: string;
                }
            } = {}
            for (const value of imageValues) {
                if (value) {
                    if (value.es && value.en) {
                        const sizeEs = await getFileSize(value.es)
                        const sizeEn = await getFileSize(value.en)
                        sizes[value.es] = {
                            es: sizeEs,
                            en: sizeEn,
                        }
                        sizes[value.en] = {
                            es: sizeEs,
                            en: sizeEn,
                        }
                    }
                }
            }
            setFileSizes(
                sizes,
            )
        }

        fetchFileSizes()
    }, [images]) // El efecto solo se ejecuta cuando cambia "images"
    // END LOGIC TO GET FILE SIZE

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
                        {action === "delete" && (
                            <div>
                                <TypographyH4 className="">¿Estás seguro de eliminar a {selected?.titleEs}?</TypographyH4>
                            </div>
                        )}
                        {(action === "create" || action === "edit") && (
                            <div className="space-y-6">
                                <FormField
                                    name="urlKey"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Url Key</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" placeholder="Url Key" className="w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{"Tipo"}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={"Tipo"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={GalleryType.SLIDER}>{MapGalleryType[GalleryType.SLIDER]}</SelectItem>
                                                    <SelectItem value={GalleryType.CARRUSEL}>{MapGalleryType[GalleryType.CARRUSEL]}</SelectItem>
                                                    <SelectItem value={GalleryType.BANNER}>{MapGalleryType[GalleryType.BANNER]}</SelectItem>
                                                    <SelectItem value={GalleryType.STATIC}>{MapGalleryType[GalleryType.STATIC]}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch("type") === GalleryType.BANNER && (
                                    <>
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
                                    </>
                                )}
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{"Tamaño"}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={"Tamaño"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={ImageSize.SMALL}>{MapImageSize[ImageSize.SMALL]}</SelectItem>
                                                    <SelectItem value={ImageSize.MEDIUM}>{MapImageSize[ImageSize.MEDIUM]}</SelectItem>
                                                    <SelectItem value={ImageSize.LARGE}>{MapImageSize[ImageSize.LARGE]}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Tabs defaultValue="spanish" className="w-full">
                                    <TabsList className="w-full">
                                        <TabsTrigger value="spanish" className="w-full">
                                            Español
                                        </TabsTrigger>
                                        <TabsTrigger value="english" className="w-full">
                                            Inglés
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="spanish" className="flex flex-col gap-2">
                                        <FormField
                                            name="titleEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Titulo Galería (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Titulo Galería" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="descriptionEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Descripción Galería (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Descripción Galería" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="contentEs"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Contenido (Español)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Contenido" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                    <TabsContent value="english" className="flex flex-col gap-2">
                                        <FormField
                                            name="titleEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Titulo Galería (Inglés)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Titulo Galería" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="descriptionEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Descripción Galería (Inglés)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Descripción Galería" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="contentEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="">
                                                    <FormLabel>Contenido (Inglés)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="text" placeholder="Contenido" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-4">
                                    <Label htmlFor="image-upload">Imágenes (Máximo {MAX_IMAGES})</Label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        onChange={(e) => handleImageUpload(e)}
                                        disabled={uploading}
                                        multiple // Permitir múltiples archivos
                                        accept="image/*"
                                        className="cursor-pointer block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100 border-none py-0"
                                    />
                                    <Progress value={progress} />
                                    {uploading && (
                                        <div className="space-y-2">
                                            {Object.entries(uploadProgress).map(([fileKey, progress]) => (
                                                <div key={fileKey} className="text-sm text-muted-foreground">
                                                    Subiendo {fileKey.split("-")[0]}... {progress}%
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {form
                                        .watch("images")
                                        .sort((a, b) => a.sort - b.sort)
                                        .map((image, index) => (
                                            <Card key={index + "images-gallery"} className="relative overflow-hidden group">
                                                <CardContent className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={image.sort}
                                                        onChange={(e) => handleSortChange(index, Number.parseInt(e.target.value))}
                                                        className="w-full mb-2"
                                                        min="0"
                                                    />

                                                    {/* Tabs para URLs en español e inglés */}
                                                    <Tabs defaultValue="es" className="w-full">
                                                        <TabsList className="w-full">
                                                            <TabsTrigger value="es" className="w-full">
                                                                Español
                                                            </TabsTrigger>
                                                            <TabsTrigger value="en" className="w-full">
                                                                Inglés
                                                            </TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="es" className="space-y-2">
                                                            <div className="relative">
                                                                <img
                                                                    src={image.valueEs || "/placeholder.svg"}
                                                                    alt={`Image ES ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                                />
                                                                <Label className="block mt-1">Size: {fileSizes[image.valueEs]?.es || "Cargando"}</Label>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setExpandedImage(image.valueEs)}
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                                >
                                                                    <Expand className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`valueEs-${index}`}>Value ES</Label>
                                                                <Input
                                                                    id={`valueEs-${index}`}
                                                                    type="string"
                                                                    placeholder="Value ES"
                                                                    value={image.valueEs}
                                                                    onChange={(e) => handleValueEsChange(index, e.target.value)}
                                                                    className="w-full"
                                                                />
                                                                {form.formState.errors.images?.[index]?.valueEs && (
                                                                    <FormMessage>{form.formState.errors.images[index].valueEs.message}</FormMessage>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`urlEs-${index}`}>URL ES</Label>
                                                                <Input
                                                                    id={`urlEs-${index}`}
                                                                    type="string"
                                                                    placeholder="URL ES"
                                                                    value={image.urlEs}
                                                                    onChange={(e) => {
                                                                        const currentImages = form.getValues("images")
                                                                        const newImages = [...currentImages]
                                                                        newImages[index].urlEs = e.target.value
                                                                        form.setValue("images", newImages)
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                ref={(el) => (fileInputRefs.current[index * 2] = el)}
                                                                onChange={(e) => handleImageUpload(e, index, "es")}
                                                                className="hidden"
                                                                multiple={false}
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => fileInputRefs.current[index * 2]?.click()}
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                            >
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                Cargar imagen ES
                                                            </Button>
                                                        </TabsContent>
                                                        <TabsContent value="en" className="space-y-2">
                                                            <div className="relative">
                                                                <img
                                                                    src={image.valueEn || "/placeholder.svg"}
                                                                    alt={`Image EN ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                                                                />
                                                                <Label className="block mt-1">Size: {fileSizes[image.valueEn]?.en || "Cargando"}</Label>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setExpandedImage(image.valueEn)}
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                                >
                                                                    <Expand className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`valueEn-${index}`}>Value EN</Label>
                                                                <Input
                                                                    id={`valueEn-${index}`}
                                                                    type="string"
                                                                    placeholder="Value EN"
                                                                    value={image.valueEn}
                                                                    onChange={(e) => handleValueEnChange(index, e.target.value)}
                                                                    className="w-full"
                                                                />
                                                                {form.formState.errors.images?.[index]?.valueEn && (
                                                                    <FormMessage>{form.formState.errors.images[index].valueEn.message}</FormMessage>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`urlEn-${index}`}>URL EN</Label>
                                                                <Input
                                                                    id={`urlEn-${index}`}
                                                                    type="string"
                                                                    placeholder="URL EN"
                                                                    value={image.urlEn}
                                                                    onChange={(e) => {
                                                                        const currentImages = form.getValues("images")
                                                                        const newImages = [...currentImages]
                                                                        newImages[index].urlEn = e.target.value
                                                                        form.setValue("images", newImages)
                                                                    }}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                ref={(el) => (fileInputRefs.current[index * 2 + 1] = el)}
                                                                onChange={(e) => handleImageUpload(e, index, "en")}
                                                                className="hidden"
                                                                multiple={false}
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => fileInputRefs.current[index * 2 + 1]?.click()}
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                            >
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                Cargar imagen EN
                                                            </Button>
                                                        </TabsContent>
                                                    </Tabs>

                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Switch
                                                            id={`Target_blank_${index}`}
                                                            checked={image.isTargetBlank}
                                                            onCheckedChange={(checked) => {
                                                                const currentImages = form.getValues("images")
                                                                const newImages = [...currentImages]
                                                                newImages[index].isTargetBlank = checked
                                                                form.setValue("images", newImages)
                                                            }}
                                                        />
                                                        <Label htmlFor={`Target_blank_${index}`}>Target _blank</Label>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </div>
                        )}
                        <ImageModal
                            isOpen={!!expandedImage}
                            onClose={() => setExpandedImage(null)}
                            imageUrl={expandedImage || ""}
                        />
                        <DialogFooter className="col-span-1 md:col-span-2 ml-auto flex flex-row gap-2">
                            <Button
                                disabled={loading || uploading}
                                type="submit"
                                className="font-bold py-2 px-4 rounded duration-300 text-white"
                            >
                                {loading || uploading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle size={24} className="animate-spin text-white" />
                                    </div>
                                ) : (
                                    "Guardar"
                                )}
                            </Button>
                            <Button
                                disabled={loading || uploading}
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

export default GalleryActionDialog

