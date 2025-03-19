"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStandStore } from "@/modules/back-office/stands/store/stand.store";
import Creatable from "react-select/creatable";
import { StandLabel } from "./StandLabel";

interface StandSelectionProps {
    form: any;
    loading: boolean;
}

const StandSelect = ({ form, loading }: StandSelectionProps) => {
    const stands = useStandStore((state) => state.filtered);

    // Guardar los standIds iniciales en una referencia
    const initialStandIdsRef = useRef<number[]>(form.getValues("standIds") || []);

    useEffect(() => {
        if (!form.getValues("standIds")) {
            form.setValue("standIds", []);
        }
    }, [form]);

    // Estado para manejar las opciones del selector
    const [availableStands, setAvailableStands] = useState<{ value: number; label: string }[]>([]);

    // Obtener los IDs seleccionados actualmente en el formulario
    const selectedStandIds = form.watch("standIds") || [];

    // Generar las opciones iniciales
    const initialOptions = useMemo(() => {
        const selectedStands = stands.filter((stand) => selectedStandIds.includes(stand.id));
        const unassignedStands = stands.filter((stand) => stand.exhibitor === null);

        // Combinar stands seleccionados + stands disponibles sin duplicados
        return Array.from(new Map([...selectedStands, ...unassignedStands].map(s => [s.id, s])).values())
            .map((stand) => ({
                value: stand.id,
                label: stand.name,
            }));
    }, [stands, selectedStandIds]);

    // Efecto para restaurar stands eliminados si estaban en los valores iniciales
    useEffect(() => {
        setAvailableStands((prev) => {
            // Obtener los stands eliminados
            const removedStandIds = initialStandIdsRef.current.filter(id => !selectedStandIds.includes(id));

            if (removedStandIds.length === 0) {
                return initialOptions; // Restaurar opciones iniciales si no hay eliminaciones
            }

            const removedStands = stands
                .filter((stand) => removedStandIds.includes(stand.id))
                .map((stand) => ({ value: stand.id, label: stand.name }));

            // Usar un Set para evitar duplicados y mantener consistencia
            const uniqueOptions = new Map([...prev, ...removedStands].map(s => [s.value, s]));
            return Array.from(uniqueOptions.values());
        });
    }, [selectedStandIds, stands, initialOptions]);

    return (
        <div className="space-y-4">
            <FormField
                name="standIds"
                control={form.control}
                render={(_) => (
                    <FormItem>
                        <FormLabel>Stands</FormLabel>
                        <FormControl>
                            <Creatable
                                closeMenuOnSelect={false}
                                isMulti
                                options={availableStands}
                                isDisabled={loading}
                                className="w-full col-span-3 z-[99]"
                                value={availableStands.filter(option => selectedStandIds.includes(option.value))}
                                onChange={(options) => {
                                    const selectedIds = options.map((option: any) => option.value);
                                    form.setValue("standIds", selectedIds);
                                }}
                                filterOption={(option, inputValue) => {
                                    return option.label.toLowerCase().includes(inputValue.toLowerCase());
                                }}
                                formatOptionLabel={(option: any) => <StandLabel standId={option.value} />}
                            />
                        </FormControl>
                        <FormDescription>
                            Seleccione los stands que desea asignar al exhibidor.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default StandSelect;
