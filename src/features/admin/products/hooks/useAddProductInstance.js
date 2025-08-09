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

    if (!variantData.variantName?.trim()) missingFields.push("Variant Name");
    if (!variantData.variantSku?.trim()) missingFields.push("Variant SKU");
    if (!variantData.quantity || Number(variantData.quantity) <= 0)
      missingFields.push("Quantity");
    if (!variantData.price || Number(variantData.price) <= 0)
      missingFields.push("Price");
    if (!variantData.compareAtPrice) missingFields.push("Compare At Price");
    if (!variantData.costPrice) missingFields.push("Cost Price");
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
    resetField("variants.0.variantName");
    resetField("variants.0.variantSku");
    resetField("variants.0.quantity");
    resetField("variants.0.price");
    resetField("variants.0.currency");
    resetField("variants.0.compareAtPrice");
    resetField("variants.0.costPrice");

    resetSelectedValues();
    setTempImages([]);
  }

  return { isVariants, handleAddVariant, tempImages, setTempImages };
}
