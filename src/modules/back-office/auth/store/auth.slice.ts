import {
  ActionsTypes,
  AuthSession,
  AuthStatus,
  LoginPayload,
  Subsidiary,
} from "@/models";
import { StateCreator } from "zustand";
import { AuthService } from "../services/auth.service";
import { toast } from "@/components";
import { HttpRequestState } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";
// import fakeLogin from '@/constants/fake-login.json';
export interface AuthSlice extends HttpRequestState {
  status: AuthStatus;
  session?: AuthSession;
  currentSubsidiary?: Subsidiary;
  permissions: string[];
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
  isExpanding: boolean;
  isTokenValid: () => boolean;
  login: (payload: LoginPayload) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  logout: () => void;
  updateCurrentSubsidiary: (subsidiary: Subsidiary) => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [["zustand/devtools", never]]
> = (set, get) => ({
  status: "pending",
  session: undefined,
  currentSubsidiary: undefined,
  permissions: [],
  action: "none",
  loading: false,
  open: false,
  isExpanding: false,
  httpRequest: () => {
    throw new Error("Not implemented yet");
  },
  error: null,

  isTokenValid: () => {
    const token = get().session?.token;
    if (!token) return false;
    // const session = decodeToken(token);
    // TODO: Uncomment this line to enable token expiration
    // if (session.exp * 1000 < Date.now()) {
    //   set({ status: "pending" }, false, "tokenExpired");
    //   return false;
    // }
    return true;
  },

  login: async (payload) => {
    handleRequestStore(
      get(),
      () => AuthService.login(payload),
      // () => Promise.resolve(fakeLogin),
      (session) => {
        // const session = fakeLogin as unknown as AuthSession;
        set({ isExpanding: true });
        // Cerrar animación de expansión
        setTimeout(() => {
          const permissions = session?.user.role.permissions.map(
            (permission) => `${permission.module}:${permission.action}`
          );
          set(
            {
              status: "authorized",
              session,
              isExpanding: false,
              permissions,
            },
            false,
            "loginSuccess"
          );
          toast({
            title: "Bienvenido",
            description: `Hola ${session.user.name}`,
          });
        }, 800);
      },
      (error: any) => {
        set({ session: undefined, isExpanding: false }, false, "loginError");
        console.error(error);
      }
    );
  },

  checkAuthStatus: async () => {
    handleRequestStore(
      get(),
      () => AuthService.checkStatus(),
      // () => Promise.resolve(fakeLogin),
      (session) => {
        // const session = fakeLogin as unknown as AuthSession;
        set({ status: "authorized", session }, false, "Authorized");
      },
      (error: any) => {
        set(
          { status: "unauthorized", session: undefined, isExpanding: false },
          false,
          "Unauthorized"
        );
        console.error(error);
      }
    );
  },

  logout: () => {
    set(
      {
        status: "unauthorized",
        session: undefined,
        isExpanding: false,
        currentSubsidiary: undefined,
      },
      false,
      "logout"
    );
  },

  updateCurrentSubsidiary: (currentSubsidiary) => {
    set({ currentSubsidiary }, false, "updateCurrentSubsidiary");
    toast({
      title: "Sucursal actualizada",
      description: `Ahora estás en ${currentSubsidiary.name}`,
    });
  },
});
