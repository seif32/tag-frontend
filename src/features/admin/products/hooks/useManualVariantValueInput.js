import { useState } from "react";
import useProductStore from "../../store/productStore";

export function useManualVariantValueInput() {
  const [newValueInputs, setNewValueInputs] = useState({});

  const addVariantValue = useProductStore((state) => state.addVariantValue);

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  function handleAddValue(variantId, value) {
    if (!value.trim()) return;
    addVariantValue(variantId, value);
    setNewValueInputs({ ...newValueInputs, [variantId]: "" });
  }

  return { handleKeyPress, handleAddValue, newValueInputs, setNewValueInputs };
}
