import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader2} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES_PATHS } from "@/constants";
import { useForm } from "react-hook-form";
import { PayloadLogin, useAuthIntranetStore } from "../store";
import { z } from "zod";
import { DocumentType } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components";


export default function Login() {
  const router = useNavigate();
  const FormSchema = z.object({
    password: z.string().min(1, {
      message: "Campo requerido",
    }),
    documentType: z.nativeEnum(DocumentType),
    documentNumber: z.string().min(1, {
      message: "Campo requerido",
    }),
  });
  const form = useForm<PayloadLogin>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      documentType: DocumentType.DNI,
      documentNumber: undefined,
      password: undefined,
    },
  });

  const user = useAuthIntranetStore((state) => state.user);
  const loading = useAuthIntranetStore((state) => state.loading);
  const error = useAuthIntranetStore((state) => state.error);
  const login = useAuthIntranetStore((state) => state.login);
  const showPassword = useAuthIntranetStore((state) => state.showPassword);
  const setShowPassword = useAuthIntranetStore(
    (state) => state.setShowPassword,
  );
  const setError = useAuthIntranetStore((state) => state.setError);

  useEffect(() => {
    setError("");
    return () => {
      setError("");
    };
  }, []);

  const onSubmit = form.handleSubmit(async (data) => {
    await login(data);
    if (user) {
      router(ROUTES_PATHS.TECHNICAL_WORK_TRAY);
    }
  });

  return (
    // <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#004d58] to-[#003540] p-4">
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#00b3dc] via-[#0124e0] to-[#00023f]">
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
                <span className="text-black">Sign In</span>
              </h1>
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="w-full mt-4">
                {error === "User not found" ? (
                  <Alert
                    variant="destructive"
                    className="bg-orange-50 border-orange-200 text-orange-900"
                  >
                    <AlertTitle className="font-bold">
                      User not registered
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      We couldn't find an account with those details.
                      <strong> Please check your email inbox</strong>; if you
                      submitted an abstract, your credentials were sent there
                      automatically.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-xs">
                      {error === "Incorrect password"
                        ? "The password entered is incorrect. Please try again."
                        : "An unexpected error occurred. Please try again later."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{"Document Type"}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={"Tipo Doc"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={DocumentType.DNI}>
                                DNI
                              </SelectItem>
                              {/* <SelectItem value={DocumentType.CE}>Foreign Meat</SelectItem>
                                                            <SelectItem value={DocumentType.NO_DOMICILIADO}>Not Domiciled</SelectItem> */}
                              <SelectItem value={DocumentType.PASSPORT}>
                                Passport
                              </SelectItem>
                              {/* <SelectItem value={DocumentType.RUC}>RUC</SelectItem>
                                                            <SelectItem value={DocumentType.CREDENCIAL_DIPLOMATICA}>Diplomatic Credential</SelectItem> */}
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
                          <FormLabel>{"Document Number"}</FormLabel>
                          <FormControl>
                            <Input placeholder={"Document Number"} {...field} />
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
                        <div className="flex items-center justify-between">
                          <FormLabel>{"Password"}</FormLabel>
                          <Link
                            to={ROUTES_PATHS.RECOVER_PASSWORD}
                            className="text-xs text-[#d35e0d] hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={"Password"}
                              {...field}
                            />
                            <span
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeIcon size={24} className="pb-1 m-0" />
                              ) : (
                                <EyeOffIcon size={24} className="pb-1 m-0" />
                              )}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <Button type="submit" className="w-full bg-[#004d58] hover:bg-[#003540]" disabled={loading}> */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00b3dc] via-[#0124e0] to-[#00023f] hover:bg-[#003540]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative flex w-full items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-200"></span>
              <span className="relative bg-white px-2 text-sm text-gray-500">
                o
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full border-[#838387] text-[#004d58]"
              onClick={() => router(ROUTES_PATHS.REGISTER)}
            >
              Create a new account
            </Button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </CardFooter>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} World Mining Congress. All rights reserved.
      </p>
    </div>
  );
}
