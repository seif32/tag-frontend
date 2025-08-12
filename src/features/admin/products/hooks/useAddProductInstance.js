import { useFieldArray } from "react-hook-form";
import useVariantStore from "../../store/variantStore";
import { useState } from "react";
import { toast } from "sonner";

export function useAddProductInstance(control, getValues, resetField) {
  const { append } = useFieldArray({ control, name: "variants" });
  const { selectedValues, resetSelectedValues } = useVariantStore();

  const [tempImages, setTempImages] = useState([]);

  const variants = useVariantStore((state) => state.variants);
  const isVariants = variants.length !== 0;

  function handleAddVariant() {
    const variantData = getValues("variants.0");
    const missingFields = [];

    if (!variantData.variant_name?.trim()) missingFields.push("Variant Name");
    if (!variantData.variant_sku?.trim()) missingFields.push("Variant SKU");
    if (!variantData.quantity || Number(variantData.quantity) <= 0)
      missingFields.push("Quantity");
    if (!variantData.price || Number(variantData.price) <= 0)
      missingFields.push("Price");
    if (!variantData.compare_at_price) missingFields.push("Compare At Price");
    if (!variantData.cost_price) missingFields.push("Cost Price");
    if (!selectedValues || selectedValues.length === 0)
      missingFields.push("Variant Types");
    // if (!tempImages || tempImages.length === 0)
    //   missingFields.push("At least one image");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const newVariant = {
      ...variantData,
      types: selectedValues,
      images: tempImages,
    };
    append(newVariant);

    // ✅ Reset all temporary states
    resetField("variants.0.variant_name");
    resetField("variants.0.variant_sku");
    resetField("variants.0.quantity");
    resetField("variants.0.price");
    resetField("variants.0.currency");
    resetField("variants.0.compare_at_price");
    resetField("variants.0.cost_price");

    resetSelectedValues();
    setTempImages([]);
  }

  return { isVariants, handleAddVariant, tempImages, setTempImages };
}
