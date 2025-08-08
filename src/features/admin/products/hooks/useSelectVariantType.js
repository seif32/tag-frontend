import useVariants from "@/hooks/useVariants";
import useVariantStore from "../../store/variantStore";
import { useState } from "react";
import { nanoid } from "nanoid";

export function useSelectVariantType() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("select");
  const [newVariantTypeId, setNewVariantTypeId] = useState(null);
  const [customTypeName, setCustomTypeName] = useState("");

  const { variantTypes, isLoadingVariantTypes } = useVariants.useAllTypes();
  const addVariant = useVariantStore((state) => state.addVariant);

  const { createVariantType, isPendingVariantTypes } =
    useVariants.useCreateType({
      onSuccess: (newlyCreatedType) => {
        if (dialogMode === "create") {
          const newVariant = {
            id: nanoid(),
            type: newlyCreatedType.id,
            name: customTypeName.trim(),
            values: [],
            created_at: new Date().toISOString(),
          };

          addVariant(newVariant);
          resetDialog();
        }
      },
    });

  async function handleAddVariant() {
    if (dialogMode === "create") {
      // Just trigger - onSuccess handles the rest!
      createVariantType({ name: customTypeName.trim() });
      return; // ⚡ Early return - no manual handling needed
    } else {
      // Handle existing type selection (no mutation involved)
      if (!newVariantTypeId) return;

      const selectedType = variantTypes?.find(
        (t) => t.id === parseInt(newVariantTypeId)
      );
      if (!selectedType) return;

      const newVariant = {
        id: nanoid(),
        type: selectedType.id,
        name: selectedType.name,
        values: [],
        created_at: new Date().toISOString(),
      };

      addVariant(newVariant);
      resetDialog();
    }
  }

  function resetDialog() {
    setNewVariantTypeId(null);
    setCustomTypeName("");
    setDialogMode("select");
    setIsAddDialogOpen(false);
  }

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    dialogMode,
    setDialogMode,
    isLoadingVariantTypes,
    newVariantTypeId,
    setNewVariantTypeId,
    customTypeName,
    setCustomTypeName,
    resetDialog,
    handleAddVariant,
    customTypeName,
    isPendingVariantTypes,
  };
}
