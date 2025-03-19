import { HttpRequestState } from "@/middlewares";

export const handleRequestStore = async <T>(
  store: HttpRequestState,
  action: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: any) => void
) => {
  const { httpRequest } = store;
  return await httpRequest(action, onSuccess, onError);
};
