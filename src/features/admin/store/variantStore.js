import { create } from "zustand";

const useVariantStore = create((set, get) => ({
  availableTypes: [],
  selectedTypes: [],
  availableValues: {},
  selectedValues: [],
  selectedCombination: [],

  setAvailableTypes: (types) => set({ availableTypes: types }),
  clearTypes: () => set({ availableTypes: [] }),

  setSelectedTypes: (types) => set({ selectedTypes: types }),
  addSelectedType: (type) =>
    set((state) => ({
      selectedTypes: [...state.selectedTypes, type],
    })),
  removeSelectedType: (typeId) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.filter((t) => t.id !== typeId),
    })),
  clearSelectedTypes: () => set({ selectedTypes: [] }),

  setAvailableValues: (typeId, values) =>
    set((state) => ({
      availableValues: {
        ...state.availableValues,
        [typeId]: values,
      },
    })),

  setSelectedValues: (values) => set({ selectedValues: values }),
  addVariantValue: (typeId, value) => {
    set((state) => {
      const currentValues = state.availableValues[typeId] || [];
      return {
        ...state,
        availableValues: {
          ...state.availableValues,
          [typeId]: [
            ...currentValues,
            {
              id: `temp-${Date.now()}`, // Temporary ID
              value: value.trim(),
            },
          ],
        },
      };
    });
  },
  setSelectedValuesForType: (typeId, typeName, values) =>
    set((state) => {
      const existingIndex = state.selectedValues.findIndex(
        (sv) => sv.typeId === typeId
      );

      const newEntry = {
        typeId,
        typeName,
        values,
      };

      if (existingIndex >= 0) {
        const updated = [...state.selectedValues];
        updated[existingIndex] = newEntry;
        return { selectedValues: updated };
      } else {
        return {
          selectedValues: [...state.selectedValues, newEntry],
        };
      }
    }),
  removeSelectedValue: (typeId, valueId, valueString) =>
    set((state) => {
      const existingIndex = state.selectedValues.findIndex(
        (sv) => sv.typeId === typeId
      );

      if (existingIndex >= 0) {
        const updated = [...state.selectedValues];
        // Filter out the value by ID
        updated[existingIndex].values = updated[existingIndex].values.filter(
          (item) => item.id !== valueId
        );

        // If no values left, remove the entire type
        if (updated[existingIndex].values.length === 0) {
          updated.splice(existingIndex, 1);
          return { selectedValues: updated };
        }

        return { selectedValues: updated };
      }

      return state; // No changes if type not found
    }),
  removeSelectedValuesForType: (typeId) =>
    set((state) => ({
      selectedValues: state.selectedValues.filter((sv) => sv.typeId !== typeId),
    })),
  clearSelectedValues: () => set({ selectedValues: [] }),

  updateSelectedCombination: (combinationArray) =>
    set((state) => {
      return { selectedCombination: combinationArray };
    }),
  clearSelectedCombination: () => set({ selectedCombination: [] }),
}));

export default useVariantStore;
