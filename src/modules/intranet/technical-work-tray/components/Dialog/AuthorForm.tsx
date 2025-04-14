// import type { UseFormReturn } from "react-hook-form"
import { Button, Select, SelectContent, SelectItem, SelectSearch, SelectTrigger, SelectValue } from "@/components/ui"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store"
import { CountryItem } from "@/modules/back-office/speakers/components/Dialog/CountryItem"
import { AuthorType, MapAuthorType } from "@/models"
import { usePaperStore } from "../../store/papers.store"
// import type { PaperFormData } from "./schemas"

interface AuthorFormProps {
    form: any
    index: number
    onRemove: () => void
}

export function AuthorForm({ form, index, onRemove }: AuthorFormProps) {
    // LOGIC COUNTRIES
    const countries = useSpeakerStore(state => state.countries);
    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: country.name, // Usamos el nombre del país como label
    }));

    const action = usePaperStore(state => state.action);
    const loading = usePaperStore(state => state.loading);

    const selectedValue = form.watch(`authors.${index}.countryCode`) && countries.find((c) => c.code === form.watch(`authors.${index}.countryCode`));
    // END LOGIC COUNTRIES
    return (
        <div className="space-y-4 border p-4 rounded-md mb-4">
            <FormField
                name={`authors.${index}.name`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.middle`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellido Paterno</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.last`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.remissive`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.institution`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.countryCode`}
                control={form.control}
                render={(_) => (
                    <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                            <SelectSearch
                                placeholder="Seleccione el país"
                                // isDisabled={loading}
                                options={countryOptions}
                                isDisabled={action === 'view'}
                                value={selectedValue ? {
                                    value: selectedValue.code,
                                    label: selectedValue.name,
                                } : null}
                                onChange={(option: any) => {
                                    form.setValue(`authors.${index}.countryCode`, option.value);
                                }}
                                filterOption={(option, inputValue) => {
                                    return option.label.toLowerCase().includes(inputValue.toLowerCase());
                                }}
                                formatOptionLabel={(option: any) => (
                                    <CountryItem countryCode={option.value} />
                                )}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.emailCorp`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Corporativo</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} type="emailCorp" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.email`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} type="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name={`authors.${index}.cellphone`}
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`authors.${index}.type`}
                render={({ field }) => (
                    <FormItem className="">
                        <FormLabel>Tipo de Autor</FormLabel>
                        <Select
                            disabled={loading || action === 'view'}
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value?.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {/* <SelectItem value={AuthorType.AUTOR}>{MapAuthorType[AuthorType.AUTOR]}</SelectItem>
                                Solo mostrar cuado exista más de un autor */}
                                {index === 0 ? (
                                    <SelectItem value={AuthorType.AUTOR}>{MapAuthorType[AuthorType.AUTOR]}</SelectItem>
                                ) : (
                                    <SelectItem value={AuthorType.COAUTOR}>{MapAuthorType[AuthorType.COAUTOR]}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {index > 0 && (
                <Button disabled={loading || action === 'view'} type="button" variant="destructive" onClick={onRemove}>
                    Eliminar Co autor
                </Button>
            )}
        </div>
    )
}

