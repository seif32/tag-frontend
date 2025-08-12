import { create } from "zustand";

const useProductStore = create((set) => ({
  baseName: "",
  mode: undefined,
  productId: null,

  setMode: (mode) => set({ mode }),
  setProductId: (id) => set({ productId: id }),
  setBaseName: (baseName) => set({ baseName }),
  resetProductState: () =>
    set({
      baseName: "",
      mode: "add",
      productId: null,
    }),
  clearBaseName: () => set({ baseName: "" }),
}));

export default useProductStore;
