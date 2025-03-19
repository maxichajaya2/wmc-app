import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

type JsonData = {
  [key: string]: any;
};
interface State {
  data: JsonData;
  isToastVisible: boolean;

  // Actions
  setIsToastVisible: (isVisible: boolean) => void;
  showJsonToast: (json: JsonData) => void;
}

export const storeApi: StateCreator<State, [["zustand/devtools", never]]> = (
  set,
  _get
) => ({
  data: {},
  isToastVisible: false,

  setIsToastVisible: (isVisible) => set({ isToastVisible: isVisible }),

  showJsonToast: (data) => {
    set({ isToastVisible: false }, false, "hideJsonToast"); // Resetea el toast primero
    setTimeout(() => {
      // Agrega un pequeño delay antes de volver a mostrar el toast
      set({ data, isToastVisible: true }, false, "showJsonToast");
    }, 0);
  },
});

export const useDebugger = create<State>()(
  devtools(storeApi, {
    name: "Debugger Store",
  })
);
