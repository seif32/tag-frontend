import { create } from "zustand";

const useVariantStore = create((set, get) => ({
  availableTypes: [],
  selectedTypes: [],
  availableValues: {},
  selectedValues: [],

  setAvailableTypes: (types) => set({ availableTypes: types }),
  addSelectedType: (type) =>
    set((state) => ({
      selectedTypes: [...state.selectedTypes, type],
    })),
  removeSelectedType: (typeId) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.filter((t) => t.id !== typeId),
    })),
  clearSelectedTypes: () => set({ selectedTypes: [] }),

  // getFilteredAvailableTypes: () => {
  //   const { availableTypes, selectedTypes } = get();
  //   const selectedIds = new Set(selectedTypes.map((t) => t.id));
  //   return availableTypes.filter((type) => !selectedIds.has(type.id));
  // },

  setAvailableTypes: (types) => set({ availableTypes: types }),
  clearTypes: () => set({ availableTypes: [] }),

  setAvailableValues: (typeId, values) =>
    set((state) => ({
      availableValues: {
        ...state.availableValues,
        [typeId]: values,
      },
    })),

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

  removeSelectedValue: (typeId, value) =>
    set((state) => ({
      selectedValues: state.selectedValues
        .map((sv) =>
          sv.typeId === typeId
            ? {
                ...sv,
                values: sv.values.filter((v) => v !== value),
              }
            : sv
        )
        .filter((sv) => sv.values.length > 0),
    })),

  removeSelectedValuesForType: (typeId) =>
    set((state) => ({
      selectedValues: state.selectedValues.filter((sv) => sv.typeId !== typeId),
    })),
  clearSelectedValues: () => set({ selectedValues: [] }),

  getVariantsForCombination: () => {
    const { selectedTypes, selectedValues } = get();
    return selectedTypes.map((type) => {
      const valuesObj = selectedValues.find((sv) => sv.typeId === type.id);
      return {
        typeId: type.id,
        typeName: type.name,
        selectedValues: valuesObj ? valuesObj.values : [],
      };
    });
  },
}));

export default useVariantStore;
