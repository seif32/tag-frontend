import { create } from "zustand";

const useProductStore = create((set) => ({
  baseName: "",

  setBaseName: (baseName) => set({ baseName }),
  clearBaseName: () => set({ baseName: "" }),
}));

export default useProductStore;
