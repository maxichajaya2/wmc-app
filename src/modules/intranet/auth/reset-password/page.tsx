
import { ROUTES_PATHS } from '@/constants';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthIntranetStore } from '../store';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { PayloadResetPassword } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

function ConfirRegisterPage() {
    const { search } = useLocation()
    const token = new URLSearchParams(search).get('token')
    const router = useNavigate();

    const FormSchema = z.object({
        password: z.string().min(1, { message: "La contraseña es obligatoria" }),
    })
    const form = useForm<PayloadResetPassword>({
        resolver: zodResolver(FormSchema), defaultValues: {
            password: "",
            token: token || "",
        }
    })

    const loading = useAuthIntranetStore(state => state.loading)
    const resetPassword = useAuthIntranetStore(state => state.resetPassword)
    const showPassword = useAuthIntranetStore(state => state.showPassword)
    const setShowPassword = useAuthIntranetStore(state => state.setShowPassword)

    const onSubmit = form.handleSubmit(async (data) => {
        await resetPassword({
            ...data,
            token: token || "",
        })
    })

    React.useEffect(() => {
        if (!token) {
            router(ROUTES_PATHS.LOGIN)
        }
    }, [token])
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
                                <span className="text-black"> Restablecer Contraseña</span>
                            </h1>
                        </CardTitle>
                        <CardDescription className="text-center">
                            <p className="text-sm text-gray-500">
                                Por favor, ingresa tu nueva contraseña para restablecerla.
                            </p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{'Nueva contraseña'}</FormLabel>
                                                    <FormControl>
                                                        <div className='relative'>
                                                            <Input type={showPassword ? 'text' : 'password'} placeholder={'Nueva contraseña'} {...field} />
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
                                </div>
                                <Button type="submit" className="w-full bg-[#004d58] hover:bg-[#003540]" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Actualizando contraseña...
                                        </>
                                    ) : (
                                        "Actualizar contraseña"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative flex w-full items-center justify-center">
                            <span className="absolute inset-x-0 top-1/2 h-px bg-gray-200"></span>
                            <span className="relative bg-white px-2 text-sm text-gray-500">o</span>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-[#838387] text-[#004d58]"
                            onClick={() => router(ROUTES_PATHS.LOGIN)}
                        >
                            Regresar a inicio de sesión
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <p className="mt-8 text-center text-sm text-gray-300">
                 © {new Date().getFullYear() + 1 } World Mining Congress. Todos los derechos reservados.
            </p>
        </div>
    )
}

export default ConfirRegisterPage