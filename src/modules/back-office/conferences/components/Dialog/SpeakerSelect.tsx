"use client"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Button,
    SelectSearch,
} from "@/components"
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store"
import { useSpeakerTypeStore } from "@/modules/back-office/speaker-type/store/speaker-type.store"
import { SpeakerLabel } from "./SpeakerLabel"
import { Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"

interface SpeakerSelectProps {
    form: any
    loading: boolean
}

const SpeakerSelect = ({ form, loading }: SpeakerSelectProps) => {
    const speakers = useSpeakerStore((state) => state.filtered)
    const speakerTypes = useSpeakerTypeStore((state) => state.data)

    // Inicializar el array de speakers si no existe
    useEffect(() => {
        if (!form.getValues("speakers")) {
            form.setValue("speakers", [])
        }

        // Si existe speakerIds pero no speakers, migrar los datos
        const speakerIds = form.getValues("speakerIds")
        if (speakerIds?.length > 0 && (!form.getValues("speakers") || form.getValues("speakers").length === 0)) {
            const speakersArray = speakerIds.map((id: number) => ({
                id,
                speakerTypeId: undefined, // Valor por defecto, ajustar según sea necesario
            }))
            form.setValue("speakers", speakersArray)
        }
    }, [form])

    const addSpeaker = () => {
        const currentSpeakers = form.getValues("speakers") || []
        form.setValue("speakers", [...currentSpeakers, { id: 0, speakerTypeId: 0 }])
    }

    const removeSpeaker = (index: number) => {
        const currentSpeakers: Array<Object> = form.getValues("speakers") || []
        form.setValue(
            "speakers",
            currentSpeakers.filter((_, i) => i !== index),
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <FormLabel className="text-base">Conferencistas</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addSpeaker} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Agregar conferencista
                </Button>
            </div>

            <FormDescription>Seleccione los conferencistas y su tipo para esta conferencia.</FormDescription>

            {form.watch("speakers")?.map((_: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpeaker(index)}
                        className="absolute top-2 right-2 h-8 w-8 text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <FormField
                        name={`speakers.${index}.id`}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conferencista</FormLabel>
                                <FormControl>
                                    <SelectSearch
                                        placeholder="Seleccionar conferencista"
                                        isDisabled={loading}
                                        options={speakers.map((speaker) => ({
                                            value: speaker.id,
                                            label: speaker.name,
                                        }))}
                                        defaultValue={speakers
                                            .map((speaker) => ({
                                                value: speaker.id,
                                                label: speaker.name,
                                            }))
                                            .find((option) => option.value === field.value)}
                                        onChange={(option: any) => form.setValue(`speakers.${index}.id`, option.value)}
                                        formatOptionLabel={(option: any) => <SpeakerLabel speakerId={option.value} />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={`speakers.${index}.speakerTypeId`}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de conferencista</FormLabel>
                                <FormControl>
                                    <SelectSearch
                                        placeholder="Seleccionar tipo"
                                        isDisabled={loading}
                                        options={speakerTypes.map((type) => ({
                                            value: type.id,
                                            label: type.nameEs,
                                        }))}
                                        defaultValue={speakerTypes
                                            .map((type) => ({
                                                value: type.id,
                                                label: type.nameEs,
                                            }))
                                            .find((option) => option.value === field.value)}
                                        onChange={(option: any) => form.setValue(`speakers.${index}.speakerTypeId`, option.value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ))}

            {(!form.watch("speakers") || form.watch("speakers").length === 0) && (
                <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No hay conferencistas agregados</p>
                </div>
            )}
        </div>
    )
}

export default SpeakerSelect

