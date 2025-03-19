import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import {
  PayloadLogin,
  PayloadRecoverAccount,
  PayloadPreRegister,
  PayloadResetPassword,
  User,
  UserBodyRequest,
} from "./session.model";
import {
  confirmRegister as confirmRegisterApi,
  getUserByToken,
  login,
  register,
  resetPassword,
  sendResetPasswordOTP,
  updateUser,
} from "../services/auth.service";
import { AxiosError } from "axios";
import { AuthStatus, Country } from "@/models";
import { CommonService } from "@/shared/services";
import { toast } from "@/components";

export interface SessionState {
  status: AuthStatus;
  user?: User;
  token?: string;
  countries: Country[];
  isSended: boolean;
  loading: boolean;
  error?: string;
  isSendedToken: boolean;
  isResetPassword: boolean;
  openAuthDialog: boolean;
  showPassword: boolean;
  _hasHydrated: boolean;
  setOpenAuthDialog: (openAuthDialog: boolean) => void;
  setHasHydrated: (state: any) => void;
  // Actions
  setShowPassword: (showPassword: boolean) => void;
  login: (body: PayloadLogin) => Promise<void>;
  getUserByToken: () => Promise<void>;
  logout: () => Promise<void>;
  // sendVerificationCode: (body: PayloadPreRegister) => Promise<void>;
  registerUser: (body: PayloadPreRegister) => Promise<void>;
  confirmRegister: (token: string) => Promise<void>;
  getCountries: () => Promise<void>;
  updateDataUser: (body: UserBodyRequest, id: number) => Promise<void>;
  recoverPassword: (body: PayloadRecoverAccount) => Promise<void>;
  resetPassword: (body: PayloadResetPassword) => Promise<void>;
  setError: (error: string) => void;
}

const storeApi: StateCreator<
  SessionState,
  [["zustand/devtools", never]],
  [["zustand/persist", SessionState]]
> = (set, get) => ({
  status: "pending",
  user: undefined,
  token: undefined,
  error: undefined,
  countries: [],
  isSended: false,
  loading: false,
  isSendedToken: false,
  isResetPassword: false,
  openAuthDialog: false,
  showPassword: false,
  _hasHydrated: false,
  setOpenAuthDialog: (openAuthDialog: boolean) => {
    set({ openAuthDialog }, false, "setOpenAuthDialog");
  },
  setHasHydrated: (state: any) => {
    set({
      _hasHydrated: state,
    });
  },
  getCountries: async () => {
    try {
      const countries = await CommonService.getCountries();
      set({ countries }, false, "getCountries");
    } catch (error) {
      console.error("Error al obtener los países");
    }
  },
  setShowPassword: (showPassword: boolean) => {
    set({ showPassword }, false, "setShowPassword");
  },
  login: async (body: PayloadLogin) => {
    try {
      set({ loading: true, error: undefined });
      const userData = await login(body);
      set(
        {
          status: "authorized",
          user: userData.user,
          token: userData.token,
        },
        false,
        "loginSuccess"
      );
      toast({
        title: `Bienvenido ${userData.user.name}`,
        description: "Inicio de sesión exitoso",
      });
    } catch (err) {
      console.log(err);
      const axiosError: any =
        (err as any as AxiosError).response?.data || "Error";
      console.log(axiosError);
      switch (axiosError.code) {
        case "PASSWORD_INVALID":
          return set({ error: "Contraseña incorrecta" });
        case "USER_NOT_FOUND":
          return set({
            error: "Usuario no encontrado",
          });
        default:
          return set({ error: "Error" });
      }
    } finally {
      set({ loading: false, isSended: false });
    }
  },
  getUserByToken: async () => {
    const token = get().token;
    console.log({token});
    if (token) {
      try {
        const userByToken = await getUserByToken(token);
        console.log({userByToken});
        set(
          {
            user: userByToken,
            status: "authorized",
          },
          false,
          "getUserByToken"
        );
      } catch (error) {
        set(
          { status: "unauthorized", user: undefined },
          false,
          "Unauthorized"
        );
        console.error(error);
      }
    } else {
      set({ status: "unauthorized" });
    }
  },
  logout: async () => {
    set({ user: undefined, isSended: false, status: "unauthorized", }, false, "logout");
    toast({
      title: "Adiós!",
      description: "Cierre de sesión exitoso",
    });
  },
  registerUser: async (body) => {
    try {
      set({ loading: true });
      const { token } = await register(body);
      console.log("registerUser", { token });
      set(
        {
          token,
        },
        false,
        "registerUser"
      );
      toast({
        title: "Registro exitoso",
        description: "Compruebe su correo electrónico para confirmar su cuenta",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar el usuario",
      });
    } finally {
      set({ loading: false, isSended: true });
    }
  },
  confirmRegister: async (tokenParam) => {
    try {
      set({ loading: true });
      const { user, token } = await confirmRegisterApi(tokenParam);
      if (user && token) {
        set(
          {
            user: user,
            token: token,
          },
          false,
          "confirmRegisterSuccess"
        );
        toast({
          title: "Registro confirmado",
          description: "Registro confirmado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al confirmar el registro",
      });
    } finally {
      set({ loading: false, isSended: true });
    }
  },
  updateDataUser: async (body, id) => {
    try {
      set({ loading: true });
      const user = await updateUser(
        {
          ...body,
          password: body.password === "" ? undefined : body.password,
        },
        id
      );
      set({ user }, false, "updateDataUserSuccess");
      toast({
        title: "Actualización exitosa",
        description: "Datos actualizados correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar los datos",
      });
    } finally {
      set({ loading: false, isSended: false });
    }
  },
  recoverPassword: async (body) => {
    try {
      set({ loading: true });
      const { token } = await sendResetPasswordOTP(body);
      set(
        {
          isSendedToken: true,
          token,
        },
        false,
        "recoverPassword"
      );
      toast({
        title: "Código enviado",
        description: "Código de recuperación enviado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar el código de recuperación",
      });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (body) => {
    try {
      set({ loading: true });
      const { user, token } = await resetPassword(body);
      if (user && token) {
        set(
          {
            user: user,
            token,
            isResetPassword: true,
          },
          false,
          "resetPassword"
        );
        toast({
          title: "Contraseña actualizada",
          description: "Contraseña actualizada correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar la contraseña",
      });
    } finally {
      set({ loading: false });
    }
  },

  setError: (error) => {
    set({ error });
  },
});

export const useAuthIntranetStore = create<SessionState>()(
  persist(
    devtools(storeApi, {
      name: "Auth Intranet Store",
    }),
    {
      name: "auth-intranet-store",
      partialize: (state) => ({ user: state.user, token: state.token }),
      storage: createJSONStorage(() => ({
        // Returning a promise from getItem is necessary to avoid issues with hydration
        getItem: async (name) =>
          new Promise((resolve) =>
            setTimeout(() => {
              const isServer = typeof window === "undefined";
              if (isServer) return;

              const value = localStorage?.getItem(name);
              resolve(value);
            }, 100)
          ),
        setItem: (name, value) => localStorage?.setItem(name, value),
        removeItem: (name) => localStorage?.removeItem(name),
      })),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
