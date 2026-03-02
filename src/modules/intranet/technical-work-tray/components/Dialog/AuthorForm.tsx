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
  const selectedDesignation = form.watch(
    `authors.${index}.professionalDesignation`,
  );
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
  // END LOGIC COUNTRIES

  // 1. Buscamos el valor actual del campo para saber si mostrar el input manual
  // const currentDesignation = form.watch(
  //   `authors.${index}.professionalDesignation`,
  // );

  // // 2. Definimos una lista de las opciones fijas
  // const fixedDesignations = [
  //   "Doctorado",
  //   "Maestria",
  //   "Licenciatura",
  //   "Bachiller",
  //   "Egresado",
  //   "Tecnico",
  // ];

  // 3. Determinamos si el valor actual es uno "Personalizado"
  // const isCustom =
  //   currentDesignation &&
  //   !fixedDesignations.includes(currentDesignation) &&
  //   currentDesignation !== "Otro";

  return (
    <div className="space-y-4 border p-4 rounded-md mb-4">
      <FormField
        name={`authors.${index}.name`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
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
            <FormLabel>
              Last Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
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
            <FormLabel>
              Company Name <span className="text-red-500">*</span>
            </FormLabel>
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
            <FormLabel>
              Country <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <SelectSearch
                placeholder="Select Country"
                // isDisabled={loading}
                options={countryOptions}
                isDisabled={action === "view"}
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
          <FormItem className="">
            <FormLabel>
              <p>
                Professional Designation <span className="text-red-500">*</span>
              </p>
              <span className="text-xs text-gray-500 mt-1">
                (e.g., PhD, MSc, P.Eng, Ing, MBA)
              </span>
            </FormLabel>
            <FormControl>
              <Select
                disabled={action === "view"}
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={"Select a professional designation"}
                    />
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedDesignation === "Otro" && (
        <FormField
          name={`authors.${index}.customDesignation`} // Usamos un campo temporal o el mismo
          control={form.control}
          render={({ field }) => (
            <FormItem className="animate-in fade-in slide-in-from-top-1">
              <FormLabel>Specify Designation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ej: Post-Doc, Architect, etc."
                  readOnly={action === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

    
      <FormField
        name={`authors.${index}.email`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <p>
                Email <span className="text-red-500">*</span>
              </p>
              <span className="text-xs text-gray-500 mt-1">
                (will be used for all communications during the process):
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} type="email" />
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
            <FormLabel>
              Contact phone <span className="text-red-500">*</span>
            </FormLabel>
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
              {/* <SelectContent>
                 <SelectItem value={AuthorType.AUTOR}>{MapAuthorType[AuthorType.AUTOR]}</SelectItem>
                               
                {index === 0 ? (
                  <SelectItem value={AuthorType.AUTOR}>
                    {MapAuthorType[AuthorType.AUTOR]}
                  </SelectItem>
                ) : (
                  <SelectItem value={AuthorType.COAUTOR}>
                    {MapAuthorType[AuthorType.COAUTOR]}
                  </SelectItem>
                )}
              </SelectContent> */}
              <SelectContent>
                {index === 0 ? (
                  // Solo una opción para el primer autor
                  <SelectItem value={AuthorType.AUTOR}>
                    {MapAuthorType[AuthorType.AUTOR]}
                  </SelectItem>
                ) : (
                  // Para los demás autores sí mostramos ambas opciones
                  <>
                    <SelectItem value={AuthorType.AUTOR}>
                      {MapAuthorType[AuthorType.AUTOR]}
                    </SelectItem>
                    <SelectItem value={AuthorType.COAUTOR}>
                      {MapAuthorType[AuthorType.COAUTOR]}
                    </SelectItem>
                  </>
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
