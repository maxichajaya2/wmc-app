import { toast } from "@/components";
import { ErrorType } from "@/models";
import { StateCreator } from "zustand";

export interface HttpRequestState {
  loading: boolean;
  error: any | null;
  httpRequest: <T>(
    action: HttpAction<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: any) => void
  ) => Promise<T>;
}

type HttpAction<T> = (...params: any[]) => Promise<T>;

const withHttpRequest =
  <T extends HttpRequestState>(
    storeApi: StateCreator<T, [["zustand/devtools", never]]>
  ): StateCreator<T, [["zustand/devtools", never]]> =>
  (set, get, api) => {
    const setLoading = (loading: boolean, msg: string) =>
      set({ loading } as any, false, msg as any);

    const httpRequest = async <R>(
      action: HttpAction<R>,
      onSuccess?: (result: R) => void,
      onError?: (error: any) => void
    ): Promise<R> => {
      try {
        setLoading(true, "Start httpRequest");
        const result = await action();
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (error) {
        if (onError) {
          onError(error);
        }
        console.log({errorMiddleware: error});
        if (error instanceof ErrorType) {
          toast({
            title: "Error",
            description: error.message,
            duration: 5000,
          });
        }
        throw error;
      } finally {
        setLoading(false, "End httpRequest");
      }
    };

    return {
      ...storeApi(set, get, api),
      httpRequest,
    };
  };

export { withHttpRequest };
