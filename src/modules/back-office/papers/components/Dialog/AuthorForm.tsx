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
      (c) => c.code === form.watch(`authors.${index}.countryCode`)
    );
  // END LOGIC COUNTRIES
  return (
    <div className="space-y-4 border p-4 rounded-md mb-4">
      <FormField
        control={form.control}
        name={`authors.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
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
            <FormLabel>Apellidos</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
                control={form.control}
                name={`authors.${index}.last`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
      <FormField
        control={form.control}
        name={`authors.${index}.institution`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de empresa</FormLabel>
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
              Direccion <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name={`authors.${index}.remissive`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      {/* <FormField
                control={form.control}
                name={`authors.${index}.countryCode`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly={action === 'view'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
      <FormField
        name={`authors.${index}.countryCode`}
        control={form.control}
        render={(_) => (
          <FormItem>
            <FormLabel>País</FormLabel>
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
      {/* <FormField
        control={form.control}
        name={`authors.${index}.emailCorp`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Corporativo</FormLabel>
            <FormControl>
              <Input {...field} readOnly={action === "view"} type="emailCorp" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      <FormField
        name={`authors.${index}.city`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Ciudad <span className="text-red-500">*</span>
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
              Estado  <span className="text-red-500">*</span>
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
              Puesto <span className="text-red-500">*</span>
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
                Designación profesional <span className="text-red-500">*</span>
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
                  {/* Professional Designation*/}
                  <SelectItem value="Doctorado">Doctorate</SelectItem>
                  <SelectItem value="Maestria">Master</SelectItem>
                  <SelectItem value="Licenciatura">Bachelor</SelectItem>
                  <SelectItem value="Bachiller">Graduate</SelectItem>
                  <SelectItem value="Egresado">Pending Degree</SelectItem>
                  <SelectItem value="Tecnico">Technical Degree</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`authors.${index}.email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo Electronico</FormLabel>
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
            <FormLabel>Teléfono de contacto </FormLabel>
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
            <FormLabel>Tipo de Autor</FormLabel>
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
          Eliminar Co autor
        </Button>
      )}
    </div>
  );
}
