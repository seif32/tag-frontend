import { nanoid } from "nanoid";
import { create } from "zustand";

const useProductStore = create((set) => ({
  variants: [],

  setVariants: (variants) => set({ variants }),
  addVariant: (variant) =>
    set((state) => ({ variants: [...state.variants, variant] })),
  addVariantValue: (variantId, value) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: [...v.values, { id: nanoid(), value: value.trim() }],
            }
          : v
      ),
    })),
  removeVariantValues: (variantId, valueIds) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.filter((val) => !valueIds.includes(val.id)),
            }
          : v
      ),
    })),
  updateVariantValues: (variantId, newValues) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === variantId ? { ...v, values: newValues } : v
      ),
    })),
}));

export default useProductStore;
