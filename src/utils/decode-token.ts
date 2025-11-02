import { TokenProps } from "@/models";
import { useSessionBoundStore } from "@/modules/back-office/auth/store";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
    try {
      return jwtDecode<TokenProps>(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      useSessionBoundStore.getState().logout();
      throw error;
    }
  };