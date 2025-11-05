import { DocumentType } from "@/models";
import { z } from "zod";
import { useAuthIntranetStore, UserBodyRequest } from "../auth/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { LoaderCircle } from "lucide-react";

function ProfilePage() {

  const FormSchema = z.object({
    email: z.string().email().min(1, {
      message: 'Campo requerido',
    }),
    // password: z.string().optional(),
    name: z.string().min(1, {
      message: 'Campo requerido',
    }),
    lastName: z.string().min(1, {
      message: 'Campo requerido',
    }),
    maternalLastName: z.string().min(1, {
      message: 'Campo requerido',
    }),
    documentType: z.nativeEnum(DocumentType),
    documentNumber: z.string(),
  }).superRefine((val, ctx) => {
    if (val.documentType === DocumentType.DNI && val.documentNumber.length !== 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["documentNumber"],
        message: 'Campo debe tener 8 dígitos',
      });
    }
    if (val.documentType === DocumentType.CE && val.documentNumber.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["documentNumber"],
        message: 'Campo requerido',
      });
    }
  }).transform((val) => {
    return {
      email: val.email,
      name: val.name,
      lastName: val.lastName,
      maternalLastName: val.maternalLastName,
      documentNumber: val.documentNumber,
      documentType: val.documentType,
      // password: val.password || undefined,
    }
  });

  const user = useAuthIntranetStore(state => state.user);
  const loading = useAuthIntranetStore(state => state.loading);
  // const showPassword = useAuthIntranetStore(state => state.showPassword)
  // const setShowPassword = useAuthIntranetStore(state => state.setShowPassword)
  const updateDataUser = useAuthIntranetStore(state => state.updateDataUser);
  const getUserByToken = useAuthIntranetStore(state => state.getUserByToken);
  const hasHydrated = useAuthIntranetStore(state => state._hasHydrated);
  const form = useForm<UserBodyRequest>({
    resolver: zodResolver(FormSchema), defaultValues: {
      documentType: DocumentType.DNI,
      name: '',
      lastName: '',
      maternalLastName: '',
      email: '',
      documentNumber: '',
    }
  })

  useEffect(() => {
    if (!user) return
    if (hasHydrated && user) {
      console.log({user})
      form.reset({
        ...user,
      })
    }
  }, [user, hasHydrated])

  useEffect(() => {
    getUserByToken();
  }, [])

  async function onSubmit(data: UserBodyRequest) {
    if (!user) return;
    await updateDataUser({ ...data, email: undefined }, user.id);
  }

  if (!user) return <></>;

  return (
    <div className={`px-5 bg-white dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-lg`}>
      <div className="space-y-10 sm:space-y-12 pb-5">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-black pt-6 mx-auto">
          Update Profile
        </h2>
        <pre className='bg-gray-100 p-4 hidden'>
          {JSON.stringify({ form: form.watch() }, null, 2)}
        </pre>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" bg-white flex flex-col gap-3 !mt-4 p-2 sm:p-4 rounded-5 shadow-accordion dark:shadow-accordion-dark">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Nombres'}</FormLabel>
                  <FormControl>
                    <Input placeholder={'Nombres'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Apellido Paterno'}</FormLabel>
                  <FormControl>
                    <Input placeholder={'Apellido Paterno'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maternalLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Apellido Materno'}</FormLabel>
                  <FormControl>
                    <Input placeholder={'Apellido Materno'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Correo electrónico'}</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder={'Correo electrónico'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Contraseña'}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input type={showPassword ? 'text' : 'password'} placeholder={'Contraseña'} {...field} />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeIcon size={24} className='pb-1 m-0' /> : <EyeOffIcon size={24} className='pb-1 m-0' />}

                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Tipo Documento'}</FormLabel>
                  <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={'Tipo Documento'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                      <SelectItem value={DocumentType.CE}>CE</SelectItem>
                      <SelectItem value={DocumentType.NO_DOMICILIADO}>No Domiciliado</SelectItem>
                      <SelectItem value={DocumentType.PASSPORT}>Pasaporte</SelectItem>
                      <SelectItem value={DocumentType.RUC}>RUC</SelectItem>
                      <SelectItem value={DocumentType.CREDENCIAL_DIPLOMATICA}>Credencial Diplomática</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Nro Documento'}</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder={'Nro Documento'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoaderCircle size={24} className="animate-spin text-white" />
                </div>
              ) : 'Actualizar'}
            </Button>
          </form>
        </Form>
      </div >
    </div >
  )
}

export default ProfilePage