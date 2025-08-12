import { create } from "zustand";

const useProductStore = create((set) => ({
  baseName: "",
  mode: "add",
  productId: null,

  setMode: (mode) => set({ mode }),
  setProductId: (id) => set({ productId: id }),
  setBaseName: (baseName) => set({ baseName }),
  clearBaseName: () => set({ baseName: "" }),
}));

export default useProductStore;
