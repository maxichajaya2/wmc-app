import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./auth.slice";
import { createRouteSlice, RouteSlice } from "./route.slice";
import { withHttpRequest } from "@/middlewares";

// extends HttpRequestState
type ShareState = AuthSlice & RouteSlice;

export const useSessionBoundStore = create<ShareState>()(
  persist(
    devtools(
      withHttpRequest((...a) => ({
        ...createAuthSlice(...a),
        ...createRouteSlice(...a),
      })),
      {
        name: "Session Bound Store",
      }
    ),
    {
      name: "auth-storage",
      partialize: (state) => ({
        session: state.session,
        status: state.status,
        currentSubsidiary: state.currentSubsidiary,
        permissions: state.permissions,
      }),
    }
  )
);
