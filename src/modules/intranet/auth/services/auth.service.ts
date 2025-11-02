import {
  PayloadLogin,
  Session,
  PayloadPreRegister,
  User,
  UserBodyRequest,
  PayloadRecoverAccount,
  PayloadResetPassword,
} from "../store";
import { apiIntranet as api } from "@/api";

// {{url}}/api/auth/login
export async function login(body: PayloadLogin): Promise<Session> {
  const { data } = await api.post<Session>(`/auth/login`, body);
  return data;
}

// {{url}}/api/auth/pre-register
export async function register(body: PayloadPreRegister) {
  const { data } = await api.post<Session>(`/auth/pre-register`, body);
  return data;
}
// {{url}}/api/auth/register
export async function confirmRegister(token: string) {
  const { data } = await api.post<Session>(`/auth/register`, { token });
  return data;
}

// {{url}}/api/auth/authenticate
export async function getUserByToken(token: string): Promise<User> {
  const { data } = await api.get<User>(`/auth/authenticate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

// update user
// {{url}}/api/users/ef76314f-38fb-4367-ab26-30a3147149dd
export async function updateUser(
  body: UserBodyRequest,
  id: number,
): Promise<User> {
  const { data } = await api.patch<User>(`/web-users/${id}`, body);
  return data;
}

// {{url}}/api/auth/send-reset-password-otp
export async function sendResetPasswordOTP(body: PayloadRecoverAccount): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>(
    `/auth/send-reset-password-otp`,
    body
  );
  return data;
}

// {{url}}/api/auth/reset-password
export async function resetPassword(body: PayloadResetPassword): Promise<Session> {
  const { data } = await api.post<Session>(`/auth/reset-password`, body);
  return data;
}
