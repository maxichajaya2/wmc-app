import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES_PATHS } from "@/constants"
import { useForm } from "react-hook-form"
import { useAuthIntranetStore } from "../store"
import { z } from "zod"
import { PayloadRecoverAccount } from "@/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components"

export default function Login() {
    const router = useNavigate()
    const FormSchema = z.object({
        email: z.string().email({ message: "El correo electrónico no es válido" }).min(1, { message: "El correo electrónico es requerido" }),
    })
    const form = useForm<PayloadRecoverAccount>({
        resolver: zodResolver(FormSchema), defaultValues: {
            email: "",
        }
    })

    const loading = useAuthIntranetStore(state => state.loading)
    const recoverPassword = useAuthIntranetStore(state => state.recoverPassword)


    const onSubmit = form.handleSubmit(async (data) => {
        await recoverPassword(data)
    })

    return (
        // <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#004d58] to-[#003540] p-4">
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#00b3dc] via-[#0124e0] to-[#00023f] p-4">
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
                                <span className="text-black"> Recover Password</span>
                            </h1>
                        </CardTitle>
                        <CardDescription className="text-center">
                            <p className="text-sm text-gray-500">
                               Enter your email address and we will send you a recovery code.
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{'Email address'}</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder={'Email address'} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" 
                                // className="w-full bg-[#004d58] hover:bg-[#003540]" 
                                className="w-full bg-gradient-to-r from-[#00b3dc] via-[#0124e0] to-[#00023f] hover:bg-[#003540]" 
                                disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                           Sending code...
                                        </>
                                    ) : (
                                        "Send Code"
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
                            Back to Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <p className="mt-8 text-center text-sm text-gray-300">
                 © {new Date().getFullYear() + 1 } World Mining Congress. All rights reserved.
            </p>
        </div>
    )
}

