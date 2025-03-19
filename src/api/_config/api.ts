import axios, { AxiosError, AxiosResponse } from "axios";
import Config from "./url";
import { ROUTES_PATHS } from "@/constants";
import { useSessionBoundStore } from "@/modules/back-office/auth/store/session.store";
import { transformError } from "@/utils";
import { useAuthIntranetStore } from "@/modules/intranet/auth/store";

const baseURLDomain = Config.BASE_URL_PRISMA;

export const apiDomain = axios.create({
  baseURL: baseURLDomain,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiDomain.interceptors.request.use(
  (config) => {
    const token = useSessionBoundStore.getState().session?.token;
    // console.log({token});

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

export const apiIntranet = axios.create({
  baseURL: baseURLDomain,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
apiIntranet.interceptors.request.use(
  (config) => {
    const token = useAuthIntranetStore.getState().token;
    // console.log({token});

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

// CREATE API INSTANCE
const createAPI = () => {
  const getBaseURL = () => {
    return (
      Config.BASE_URL_PRISMA
    );
  };

  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      // Actualizamos la baseURL en cada petición para tener los valores más recientes
      config.baseURL = getBaseURL();

      const token = useSessionBoundStore.getState().session?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    async (error) => {
      console.log({error})
      return await Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (window.location.pathname !== ROUTES_PATHS.LOGIN) {
          window.location.replace(ROUTES_PATHS.LOGIN);
        }
        throw transformError(error);
      }
      throw transformError(error);
    }
  );

  return instance;
};

export const api = createAPI();
