import { useEffect, useState } from "react";
import useVariantStore from "../../store/variantStore";
import useVariants from "@/hooks/useVariants";

export function useToggleGroupState(variant, setIsDialogOpen) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    variantValues,
    isLoadingVariantValues,
    error: variantValuesError,
  } = useVariants.useValuesByType(variant.type);

  // 🏪 Zustand store actions
  const addVariantValue = useVariantStore((state) => state.addVariantValue);
  const removeVariantValues = useVariantStore(
    (state) => state.removeVariantValues
  );

  useEffect(() => {
    if (!isLoadingVariantValues && variant?.values) {
      setSelectedValues(variant.values.map((v) => v.value));
      setIsInitialized(true);
    }
  }, [variant, isLoadingVariantValues]); // 🔥 Added isLoadingVariantValues dependency!

  function handleSelectValue() {
    if (isLoadingVariantValues) {
      console.warn("Cannot perform selection while variant values are loading");
      return;
    }

    if (!variantValues || !Array.isArray(variantValues)) {
      console.warn("Variant values not available yet");
      return;
    }

    const existingValues = variant.values.map((v) => v.value.toLowerCase());

    selectedValues.forEach((val) => {
      if (!existingValues.includes(val.toLowerCase())) {
        addVariantValue(variant.id, val);
      }
    });

    const manualValues = variant.values
      .filter(
        (v) =>
          !variantValues.some(
            (opt) => opt.value.toLowerCase() === v.value.toLowerCase()
          )
      )
      .map((v) => v.value);

    const finalSelected = [...selectedValues, ...manualValues];
    const toggledOff = variant.values.filter(
      (v) => !finalSelected.includes(v.value)
    );

    if (toggledOff.length > 0) {
      removeVariantValues(
        variant.id,
        toggledOff.map((v) => v.id)
      );
    }

    setIsDialogOpen(false);
  }

  return {
    selectedValues,
    setSelectedValues,
    handleSelectValue,

    isLoadingVariantValues,
    isInitialized,
    variantValuesError,

    canPerformActions: !isLoadingVariantValues && isInitialized,
    isEmpty:
      !isLoadingVariantValues && (!variantValues || variantValues.length === 0),
  };
}
