import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Button, Input } from "@/components/";
import { Spinner, TypographyH3 } from "@/shared";
import { useSessionBoundStore } from "./store/session.store";

const FormSchema = z.object({
    email: z.string().min(2, {
        message: "Usuario debe tener al menos 2 caracteres",
    }),
    password: z.string().min(2, {
        message: "Contraseña debe tener al menos 2 caracteres",
    }),
})

function AuthPage() {
    const isExpanding = useSessionBoundStore((state) => state.isExpanding);
    const loading = useSessionBoundStore((state) => state.loading);
    const login = useSessionBoundStore((state) => state.login);

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await login(data);
    }

    return (
        // bg-[url(/img/mountain.svg)]
        <div className="w-screen h-screen bg-primary bg-no-repeat bg-container bg-bottom flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-col items-center justify-center py-12 w-full max-w-[350px] md:max-w-[440px] h-auto bg-background-container rounded-2xl transition-all duration-300">
                <img src="/logo-wmc.png" alt="Perumin" className="w-80" />
                <TypographyH3>
                    Administrador
                </TypographyH3>
                <p className="mt-0 mb-5 text-xs md:text-sm font-light">
                    Ingrese sus credenciales
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuario</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="usuario" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Ingrese su nombre de usuario
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                disabled={loading}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="contraseña"
                                                {...field}
                                            />
                                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}>
                                                {!showPassword ? <EyeIcon size={24} className='m-0' /> : <EyeOffIcon size={24} className='m-0' />}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Ingrese su contraseña
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size={"lg"} disabled={loading} variant={"dark"} className="w-full relative">
                            {loading ? <Spinner /> : "Ingresar"}
                            <AnimatePresence>
                                {isExpanding && (
                                    <motion.div
                                        initial={{ scale: 0, x: '-50%', y: '-50%' }}
                                        animate={{ scale: 3 }}
                                        exit={{ scale: 0 }}
                                        transition={{
                                            type: "tween",
                                            duration: 0.6,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-teal-600 rounded-full"
                                        onAnimationComplete={() => {
                                            // navigate(ROUTES_PATHS.DASHBOARD)
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AuthPage
{/* <Button type="submit" size={"lg"} className="w-full">Ingresar</Button>
<Button type="button" size={"lg"} variant="destructive" onClick={onLogout} className="w-full">destructive</Button>
<Button type="button" size={"lg"} variant="success" onClick={onLogout} className="w-full">success</Button>
<Button type="button" size={"lg"} variant="warning" onClick={onLogout} className="w-full">warning</Button>
<Button type="button" size={"lg"} variant="ghost" onClick={onLogout} className="w-full">ghost</Button>
<Button type="button" size={"lg"} variant="outline" onClick={onLogout} className="w-full">outline</Button>
<Button type="button" size={"lg"} variant="secondary" onClick={onLogout} className="w-full">secondary</Button>
<Button type="button" size={"lg"} variant="link" onClick={onLogout} className="w-full">link</Button> */}