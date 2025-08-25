import useVariantStore from "../../store/variantStore";
import { useState } from "react";

export function useAddProductInstance(
  control,
  getValues,
  resetField,
  variantsList,
  append
) {
  // const { append, variantsList } = useFieldArray({ control, name: "variants" });
  // const { selectedValues, resetSelectedValues } = useVariantStore();
  const [tempImages, setTempImages] = useState([]);

  const selectedValues = useVariantStore((state) => state.selectedValues);

  const isVariants = selectedValues.length !== 0;

  function handleAddVariant() {
    const variantData = getValues("variants.0");

    console.log("useAddProductInstance", selectedValues);

    // Create new variant
    const newVariant = {
      ...variantData,
      types: selectedValues,
      images: tempImages,
    };

    append(newVariant);

    resetField("variants.0.variant_name", { defaultValue: "" });
    resetField("variants.0.variant_sku", { defaultValue: "" });
    resetField("variants.0.quantity", { defaultValue: "" });
    resetField("variants.0.price", { defaultValue: "" });
    resetField("variants.0.currency", { defaultValue: "USD" });
    resetField("variants.0.compare_at_price", { defaultValue: "" });
    resetField("variants.0.cost_price", { defaultValue: "" });

    // resetSelectedValues();
    setTempImages([]);
  }

  return {
    isVariants,
    handleAddVariant,
    tempImages,
    setTempImages,
    variantsList,
  };
}
