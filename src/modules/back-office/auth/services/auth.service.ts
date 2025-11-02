import { AuthSession, LoginPayload } from "@/models";
import { apiDomain } from "@/api";
export class AuthService {
  static login = async (payload: LoginPayload): Promise<AuthSession> => {
    const { data } = await apiDomain.post<AuthSession>("/auth/dashboard-login", payload);
    return data;
  };

  static checkStatus = async (): Promise<AuthSession> => {
    const { data } = await apiDomain.get<AuthSession>("/auth/dashboard-authenticate");
    return data;
  };
}
