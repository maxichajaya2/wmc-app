import { useEffect } from "react"
import { Button ,} from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 , EyeIcon,EyeOffIcon} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ROUTES_PATHS } from "@/constants"
import { PayloadPreRegister, useAuthIntranetStore } from "../store"
import { z } from "zod"
import { DocumentType } from "@/models"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"

export default function Registro() {
  const FormSchema = z.object({
    email: z.string().email().min(1, {
      message: 'Campo requerido',
    }),
    password: z.string().min(1, {
      message: 'Campo requerido',
    }),
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
    // mostrar mensaje para la contraseña tenga al menos 8 digitos
    if (val.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: 'Campo debe tener al menos 8 dígitos',
      });
    }
  });
  const form = useForm<PayloadPreRegister>({
    resolver: zodResolver(FormSchema), defaultValues: {
      documentType: DocumentType.DNI,
      name: '',
      lastName: '',
      maternalLastName: '',
      email: '',
      documentNumber: '',
      password: '',
    }
  })
  const router = useNavigate();
  const loading = useAuthIntranetStore(state => state.loading)
  const isSended = useAuthIntranetStore(state => state.isSended)
  // const sendVerificationCode = useAuthIntranetStore(state => state.sendVerificationCode)
  const registerUser = useAuthIntranetStore(state => state.registerUser)
  const showPassword = useAuthIntranetStore(state => state.showPassword)
  const setShowPassword = useAuthIntranetStore(state => state.setShowPassword)
  const setError = useAuthIntranetStore(state => state.setError)
  const token = useAuthIntranetStore(state => state.token)

  useEffect(() => {
    setError('')
    return () => {
      setError('')
    }
  }, [])

  async function onSubmit(data: PayloadPreRegister) {
    await registerUser(data)
    const nodeEnv = process.env.NODE_ENV || "development";
    if (nodeEnv === "development") {
      router(`${ROUTES_PATHS.CONFIRM_REGISTER}?token=${token}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#004d58] to-[#003540] p-4">
      <div className="w-full max-w-md">

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex items-center justify-center bg-white">
                <img src="/logo-wmc.png" className="w-80" alt="Perumin Logo" />
              </div>
            </div>
            <CardTitle className="text-center">
              <h1 className="text-2xl font-bold text-[#004d58]">
                <span className="text-black"> Crear cuenta</span>
              </h1>
            </CardTitle>
            <CardDescription className="text-center">
              Completa el formulario para registrarte en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  </div>
                  <div className="space-y-2">
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
                  </div>
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{'Correo electrónico'}</FormLabel>
                        <FormControl>
                          <Input placeholder={'Correo electrónico'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{'Tipo Doc'}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={'Tipo Doc'} />
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
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{'Nro Documento'}</FormLabel>
                          <FormControl>
                            <Input placeholder={'Nro Documento'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormField
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
                  />
                </div>

                <Button type="submit" className="w-full bg-[#004d58] hover:bg-[#003540]" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </form>
            </Form>

            {isSended && (
              <div className="bg-green-100 p-4 my-4">
                <p className='text-green-950'>
                  Se ha enviado un correo de confirmación a tu bandeja correo electrónico.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link to={ROUTES_PATHS.LOGIN} className="text-[#d35e0d] hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-gray-300">
        © {new Date().getFullYear() + 1 } World Mining Congress. Todos los derechos reservados.
      </p>
    </div>
  )
}

