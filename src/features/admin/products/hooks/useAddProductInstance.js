import useVariantStore from "../../store/variantStore";
import { useState } from "react";
import { toast } from "sonner";

export function useAddProductInstance(
  control,
  getValues,
  resetField,
  variantsList,
  append
) {
  const [currentSelections, setCurrentSelections] = useState({});
  const [tempImages, setTempImages] = useState([]);

  const updateSelectedCombination = useVariantStore(
    (state) => state.updateSelectedCombination
  );
  const selectedValues = useVariantStore((state) => state.selectedValues);

  const isVariants = selectedValues.length !== 0;

  // ✅ Validation function for required fields
  function validateVariantData(variantData) {
    const errors = [];

    // Check required string fields
    if (!variantData.variant_name || variantData.variant_name.trim() === "") {
      errors.push("Variant name is required");
    }
    if (!variantData.variant_sku || variantData.variant_sku.trim() === "") {
      errors.push("Variant SKU is required");
    }

    // Check required numeric fields
    if (
      !variantData.quantity ||
      variantData.quantity.toString().trim() === "" ||
      isNaN(Number(variantData.quantity))
    ) {
      errors.push("Quantity is required and must be a valid number");
    }
    if (
      !variantData.price ||
      variantData.price.toString().trim() === "" ||
      isNaN(Number(variantData.price))
    ) {
      errors.push("Price is required and must be a valid number");
    }
    if (
      !variantData.compare_at_price ||
      variantData.compare_at_price.toString().trim() === "" ||
      isNaN(Number(variantData.compare_at_price))
    ) {
      errors.push("Compare at price is required and must be a valid number");
    }
    if (
      !variantData.cost_price ||
      variantData.cost_price.toString().trim() === "" ||
      isNaN(Number(variantData.cost_price))
    ) {
      errors.push("Cost price is required and must be a valid number");
    }

    return errors;
  }

  // ✅ Check if user selected variant types
  function validateCurrentSelections() {
    if (Object.keys(currentSelections).length === 0) {
      return ["Please select values for variant types"];
    }

    // Check if user selected for all available types
    const availableTypeIds = selectedValues.map((sv) => sv.typeId);
    const selectedTypeIds = Object.keys(currentSelections).map((id) =>
      parseInt(id)
    );

    const missingTypes = availableTypeIds.filter(
      (typeId) => !selectedTypeIds.includes(typeId)
    );
    if (missingTypes.length > 0) {
      const missingTypeNames = missingTypes.map((typeId) => {
        const type = selectedValues.find((sv) => sv.typeId === typeId);
        return type?.typeName || `Type ${typeId}`;
      });
      return [`Please select values for: ${missingTypeNames.join(", ")}`];
    }

    return [];
  }

  function handleAddVariant() {
    // Get variant data first
    const variantData = getValues("variants.0");

    // ✅ Validate variant form data
    const variantErrors = validateVariantData(variantData);
    if (variantErrors.length > 0) {
      toast.error("Please fix the following errors", {
        description: variantErrors.join("\n"),
        duration: 5000,
      });
      return;
    }

    const selectionErrors = validateCurrentSelections();
    if (selectionErrors.length > 0) {
      toast.warning("Missing variant selections", {
        description: selectionErrors.join("\n"),
        duration: 4000,
      });
      return;
    }

    try {
      const combinationArray = Object.entries(currentSelections).map(
        ([typeId, valueObj]) => {
          const typeData = selectedValues.find(
            (sv) => sv.typeId === parseInt(typeId)
          );
          return {
            typeId: parseInt(typeId),
            typeName: typeData?.typeName || "",
            selectedValue: valueObj,
          };
        }
      );

      updateSelectedCombination(combinationArray);

      const newVariant = {
        ...variantData,
        types: combinationArray,
        images: tempImages,
      };

      append(newVariant);

      // ✅ Reset form fields
      resetField("variants.0.variant_name", { defaultValue: "" });
      resetField("variants.0.variant_sku", { defaultValue: "" });
      resetField("variants.0.quantity", { defaultValue: "" });
      resetField("variants.0.price", { defaultValue: "" });
      resetField("variants.0.currency", { defaultValue: "USD" });
      resetField("variants.0.compare_at_price", { defaultValue: "" });
      resetField("variants.0.cost_price", { defaultValue: "" });

      // ✅ Clear local state after successful add
      setCurrentSelections({});
      setTempImages([]);

      // ✅ Success toast with variant details
      const variantName = combinationArray
        .map((c) => c.selectedValue.value)
        .join(" ");
      toast.success("Variant added successfully!", {
        description: `${
          variantData.variant_name || "New variant"
        } (${variantName})`,
        duration: 3000,
      });
    } catch (error) {
      // ✅ Error handling
      console.error("Error adding variant:", error);
      toast.error("Failed to add variant", {
        description: "Something went wrong. Please try again.",
        duration: 4000,
      });
    }
  }

  return {
    isVariants,
    handleAddVariant,
    tempImages,
    setTempImages,
    variantsList,
    selectedValues,
    currentSelections,
    setCurrentSelections,
  };
}
