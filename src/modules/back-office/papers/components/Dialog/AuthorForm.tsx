// import type { UseFormReturn } from "react-hook-form"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectSearch,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store";
import { CountryItem } from "@/modules/back-office/speakers/components/Dialog/CountryItem";
import { AuthorType, MapAuthorType } from "@/models";
import { usePaperStore } from "../../store/papers.store";
// import type { PaperFormData } from "./schemas"

interface AuthorFormProps {
  form: any;
  index: number;
  onRemove: () => void;
}

export function AuthorForm({ form, index, onRemove }: AuthorFormProps) {
  // LOGIC COUNTRIES
  const countries = useSpeakerStore((state) => state.countries);
  const countryOptions = countries.map((country) => ({
    value: country.code,
    label: country.name, // Usamos el nombre del país como label
  }));

  const action = usePaperStore((state) => state.action);
  const loading = usePaperStore((state) => state.loading);

  const selectedValue =
    form.watch(`authors.${index}.countryCode`) &&
    countries.find(
      (c) => c.code === form.watch(`authors.${index}.countryCode`),
    );

  // 1. Lista de opciones fijas
  const fixedOptions = [
    "Doctorado",
    "Maestria",
    "Licenciatura",
    "Bachiller",
    "Egresado",
    "Tecnico",
  ];

  // 2. Observamos el valor del Select
  const selectedDesignation = form.watch(
    `authors.${index}.professionalDesignation`,
  );

  return (
    <div className="space-y-4 border p-4 rounded-md mb-4">
      <FormField
        control={form.control}
        name={`authors.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`authors.${index}.middle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lastname</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`authors.${index}.institution`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`authors.${index}.address`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Address <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
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
            <FormLabel>Country</FormLabel>
            <FormControl>
              <SelectSearch
                placeholder="Seleccione el país"
                isDisabled={loading || action === "view"}
                options={countryOptions}
                value={
                  selectedValue
                    ? {
                        value: selectedValue.code,
                        label: selectedValue.name,
                      }
                    : null
                }
                onChange={(option: any) => {
                  form.setValue(`authors.${index}.countryCode`, option.value);
                }}
                filterOption={(option, inputValue) => {
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
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
        name={`authors.${index}.city`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              City <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`authors.${index}.state`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              State <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
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
            <FormLabel>
              Job Title <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`authors.${index}.professionalDesignation`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Designation *</FormLabel>
            <Select
              disabled={action === "view"}
              onValueChange={(val) => {
                field.onChange(val);
                // Si cambia a algo que no es "Otro", limpiamos el campo manual
                if (val !== "Otro") {
                  form.setValue(
                    `authors.${index}.other`,
                    null,
                  );
                }
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Doctorado">Doctorate</SelectItem>
                <SelectItem value="Maestria">Master</SelectItem>
                <SelectItem value="Licenciatura">Bachelor</SelectItem>
                <SelectItem value="Bachiller">Graduate</SelectItem>
                <SelectItem value="Egresado">Pending Degree</SelectItem>
                <SelectItem value="Tecnico">Technical Degree</SelectItem>
                <SelectItem value="Otro">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CLAVE 2: Mostramos el input si el valor es "Otro" O si el valor actual no está en la lista fija */}
      {/* CAMPO NUEVO Y SIMPLE: Solo aparece si el Select es "Otro" */}
      {selectedDesignation === "Otro" && (
        <FormField
          name={`authors.${index}.other`}
          control={form.control}
          render={({ field }) => (
            <FormItem className="animate-in fade-in slide-in-from-top-1">
              <FormLabel>Specify Other Designation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""} // Si es null, muestra vacío
                  placeholder="Ej: PhD, Post-Doc..."
                  readOnly={action === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name={`authors.${index}.email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`authors.${index}.cellphone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact phone </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
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
            <FormLabel>Author Type</FormLabel>
            <Select
              disabled={loading || action === "view"}
              onValueChange={(value) => field.onChange(value)}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {index === 0 ? (
                  <SelectItem value={AuthorType.AUTOR}>
                    {MapAuthorType[AuthorType.AUTOR]}
                  </SelectItem>
                ) : (
                  <SelectItem value={AuthorType.COAUTOR}>
                    {MapAuthorType[AuthorType.COAUTOR]}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {index > 0 && (
        <Button
          disabled={loading || action === "view"}
          type="button"
          variant="destructive"
          onClick={onRemove}
        >
          Remove Co-author
        </Button>
      )}
    </div>
  );
}
