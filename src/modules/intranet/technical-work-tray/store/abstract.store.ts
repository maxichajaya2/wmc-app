import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { HttpRequestState, withHttpRequest } from "@/middlewares";
import { handleRequestStore } from "@/utils/handle-request-store";

interface AbstractRecord {
  id: number;
  codigo: string;
  name: string;
  lastname: string;
  email: string;
  title: string;
}

interface AbstractResponse {
  userEmail: string;
  existsInAbstract: boolean;
  abstractRecord: AbstractRecord[];
}

interface AbstractState extends HttpRequestState {
  data: AbstractRecord[];
  loading: boolean;

  /* ACTIONS */
  findAll: (userId: number) => Promise<void>;
}

export const abstractStoreApi: StateCreator<
  AbstractState,
  [["zustand/devtools", never]]
> = (set, get) => ({
  data: [],
  loading: false,
  error: null,
  httpRequest: () => {
    throw new Error("Not implemented");
  },

  async findAll(userId: number) {
    handleRequestStore(
      get(),
      async () => {
        const res = await fetch(
          `http://localhost:4000/api/web-users/${userId}/abstract`
        );
        return await res.json();
      },
      (json: AbstractResponse) => {
        set(
          {
            data: json.abstractRecord ?? [],
            loading: false,
          },
          false,
          "fetchAbstractSuccess"
        );
      },
      (error) => console.error(error)
    );
  },
});

export const useAbstractStore = create<AbstractState>()(
  devtools(withHttpRequest(abstractStoreApi), {
    name: "Abstract Store",
  })
);
