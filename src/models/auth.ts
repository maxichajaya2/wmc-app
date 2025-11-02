import { User } from "@/models";

export type AuthStatus = "authorized" | "unauthorized" | "pending";
export interface AuthSession {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenProps {
  sub: string;
  username: string;
  iat: number;
}

export interface PayloadRecoverAccount {
  email: string;
}

export interface PayloadResetPassword {
  password: string;
  token: string;
}
