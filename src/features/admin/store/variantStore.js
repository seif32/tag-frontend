import { nanoid } from "nanoid";
import { create } from "zustand";

const useVariantStore = create((set) => ({
  variants: [],
  selectedValues: [],

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

  setSelectedValue: (typeid, value) =>
    set((state) => {
      let updated = [...state.selectedValues];

      // if value is empty (user unselects)
      if (!value) {
        updated = updated.filter((item) => item.typeid !== typeid);
      } else {
        // check if exists
        const existingIndex = updated.findIndex(
          (item) => item.typeid === typeid
        );
        if (existingIndex >= 0) {
          updated[existingIndex] = { typeid, value };
        } else {
          updated.push({ typeid, value });
        }
      }

      return { selectedValues: updated };
    }),

  resetSelectedValues: () => set({ selectedValues: [] }),
  reset: () => set({ variants: [] }),
}));

export default useVariantStore;
