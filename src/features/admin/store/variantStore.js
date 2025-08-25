import { nanoid } from "nanoid";
import { create } from "zustand";

const useVariantStore = create((set, get) => ({
  variants: [],
  selectedValues: [],

  // getAvailableVariantTypes: (backendVariantTypes) => {
  //   const state = get();

  //   // 🧠 Get IDs of currently selected variant types
  //   const selectedTypeIds = new Set(
  //     state.variants.map((variant) => variant.type)
  //   );

  //   return backendVariantTypes.filter((type) => !selectedTypeIds.has(type.id));
  // },

  getAvailableVariantTypes: (backendVariantTypes) => {
    const state = get();

    // 🎯 Get IDs of currently selected variant types from the store
    const selectedTypeIds = new Set(
      state.variants.map((variant) => variant.type)
    );

    // 🚀 Filter out already selected types
    return backendVariantTypes.filter((type) => !selectedTypeIds.has(type.id));
  },

  addVariant: (variant) =>
    set((state) => {
      const enhancedVariant = {
        ...variant,
        id: variant.id || nanoid(),
        // Store the backend type ID directly
        type: variant.type || variant.type_id,
      };

      return { variants: [...state.variants, enhancedVariant] };
    }),

  setVariants: (variants) => set({ variants }),

  removeVariant: (variantId) =>
    set((state) => ({
      variants: state.variants.filter((v) => v.id !== variantId),
      selectedValues: state.selectedValues.filter(
        (sv) => sv.type_id !== variantId
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

  setSelectedValue: (type_id, value) =>
    set((state) => {
      let updated = [...state.selectedValues];

      if (!value) {
        updated = updated.filter((item) => item.type_id !== type_id);
      } else {
        const existingIndex = updated.findIndex(
          (item) => item.type_id === type_id
        );
        if (existingIndex >= 0) {
          updated[existingIndex] = { type_id, value };
        } else {
          updated.push({ type_id, value });
        }
      }

      return { selectedValues: updated };
    }),

  resetSelectedValues: () => set({ selectedValues: [] }),
  reset: () => set({ variants: [], selectedValues: [] }),
}));

export default useVariantStore;
