// useVariantStore.js - Enhanced Version
import { nanoid } from "nanoid";
import { create } from "zustand";

const useVariantStore = create((set, get) => ({
  variants: [],
  selectedValues: [],

  getAvailableVariantTypes: (allVariantTypes) => {
    const state = get();
    const selectedTypeIds = new Set(
      state.variants.map((variant) => variant.type)
    );

    return allVariantTypes.filter(
      (type) =>
        type.value === "__ADD_CUSTOM__" || !selectedTypeIds.has(type.value)
    );
  },

  setVariants: (variants) => set({ variants }),

  addVariant: (variant) =>
    set((state) => ({ variants: [...state.variants, variant] })),

  removeVariant: (variantId) =>
    set((state) => ({
      variants: state.variants.filter((v) => v.id !== variantId),
      selectedValues: state.selectedValues.filter(
        (sv) => sv.typeid !== variantId
      ),
    })),

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

  removeVariantValue: (variantId, valueId) =>
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              values: v.values.filter((val) => val.id !== valueId),
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

      if (!value) {
        updated = updated.filter((item) => item.typeid !== typeid);
      } else {
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
  reset: () => set({ variants: [], selectedValues: [] }),
}));

export default useVariantStore;
