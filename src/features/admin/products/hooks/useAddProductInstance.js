import useVariantStore from "../../store/variantStore";
import useProductStore from "../../store/productStore";
import useProducts from "@/hooks/useProducts";
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
  const [newVariant, setNewVariant] = useState(null);

  // 🆕 Add loading state for overlay
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    progress: 0,
    stage: "preparing",
  });

  const mode = useProductStore((state) => state.mode);
  const isEditMode = mode === "edit";
  const productId = useProductStore((state) => state.productId);

  const { refetchProduct } = useProducts.useById(productId, {
    enabled: !!productId,
  });

  const { addVariant, isPendingVariants } = useProducts.useAddVariant({
    onSuccess: () => {
      // 🆕 Update to complete stage
      setLoadingState({
        isLoading: true,
        progress: 100,
        stage: "complete",
      });

      // 🆕 Hide overlay after short delay
      setTimeout(() => {
        setLoadingState({
          isLoading: false,
          progress: 0,
          stage: "preparing",
        });
      }, 1500);

      refetchProduct();

      // Reset form fields
      resetField("variants.0.quantity", { defaultValue: "" });
      resetField("variants.0.price", { defaultValue: "" });
      resetField("variants.0.currency", { defaultValue: "USD" });
      resetField("variants.0.compare_at_price", { defaultValue: "" });
      resetField("variants.0.cost_price", { defaultValue: "" });
      resetField("variants.0.vat", { defaultValue: "" });

      setCurrentSelections({});
      setTempImages([]);
    },
    onError: (error) => {
      // 🆕 Hide overlay on error
      setLoadingState({
        isLoading: false,
        progress: 0,
        stage: "preparing",
      });
    },
  });

  const updateSelectedCombination = useVariantStore(
    (state) => state.updateSelectedCombination
  );
  const selectedValues = useVariantStore((state) => state.selectedValues);

  const isVariants = selectedValues.length !== 0;

  function validateVariantData(variantData) {
    const errors = [];

    // ✅ Required fields with number validation
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
      !variantData.vat ||
      variantData.vat.toString().trim() === "" ||
      isNaN(Number(variantData.vat))
    ) {
      errors.push("VAT is required and must be a valid number");
    }

    if (
      !variantData.cost_price ||
      variantData.cost_price.toString().trim() === "" ||
      isNaN(Number(variantData.cost_price))
    ) {
      errors.push("Cost price is required and must be a valid number");
    }

    // 🆕 OPTIONAL: Compare at price - only validate if provided
    if (
      variantData.compare_at_price &&
      variantData.compare_at_price.toString().trim() !== "" &&
      isNaN(Number(variantData.compare_at_price))
    ) {
      errors.push("Compare at price must be a valid number if provided");
    }

    return errors;
  }

  function validateCurrentSelections() {
    if (Object.keys(currentSelections).length === 0) {
      return ["Please select values for variant types"];
    }

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

  async function handleAddVariant() {
    const variantData = getValues("variants.0");

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

      const builtVariant = {
        ...variantData,
        types: combinationArray,
        images: tempImages,
      };

      setNewVariant(builtVariant);

      if (isEditMode) {
        console.log("🔄 Adding variant to existing product via API...");

        // 🆕 Show loading overlay
        setLoadingState({
          isLoading: true,
          progress: 10,
          stage: "preparing",
        });

        // 🆕 Simulate progress stages
        setTimeout(() => {
          setLoadingState({
            isLoading: true,
            progress: 40,
            stage: "uploading",
          });
        }, 500);

        setTimeout(() => {
          setLoadingState({
            isLoading: true,
            progress: 70,
            stage: "saving",
          });
        }, 1000);

        addVariant({
          productId: productId,
          variantData: {
            quantity: parseInt(builtVariant.quantity),
            vat: parseInt(builtVariant.vat),
            price: parseFloat(builtVariant.price),
            compare_at_price: parseFloat(builtVariant.compare_at_price || 0),
            cost_price: parseFloat(builtVariant.cost_price || 0),
            currency: builtVariant.currency,
            types: builtVariant.types.map((combo) => ({
              type_id: combo.typeId,
              value_id: combo.selectedValue.id,
            })),
            images: builtVariant.images,
          },
        });
      } else {
        // Add mode: Normal flow
        console.log("✨ Adding variant to form...");
        append(builtVariant);

        // Reset form
        resetField("variants.0.quantity", { defaultValue: "" });
        resetField("variants.0.price", { defaultValue: "" });
        resetField("variants.0.currency", { defaultValue: "USD" });
        resetField("variants.0.compare_at_price", { defaultValue: "" });
        resetField("variants.0.cost_price", { defaultValue: "" });
        resetField("variants.0.vat", { defaultValue: "" });

        setCurrentSelections({});
        setTempImages([]);
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      toast.error("Failed to add variant", {
        description: "Something went wrong. Please try again.",
        duration: 4000,
      });

      // 🆕 Hide overlay on error
      setLoadingState({
        isLoading: false,
        progress: 0,
        stage: "preparing",
      });

      setNewVariant(null);
    }
  }

  function clearNewVariant() {
    setNewVariant(null);
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
    newVariant,
    clearNewVariant,
    isEditMode,
    isPendingVariants,
    loadingState, // 🆕 Export loading state
  };
}
