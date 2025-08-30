import { useState } from "react";
import useVariantStore from "../../store/variantStore";

export function useManualVariantValueInput() {
  const [newValueInputs, setNewValueInputs] = useState({});

  const addVariantValue = useVariantStore((state) => state.addVariantValue);

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // ✅ IMPROVED: Don't clear input here - let component handle it
  function handleAddValue(typeId, value) {
    if (!value.trim()) return;

    // Add to store optimistically (optional - you might want to do this after API success)
    addVariantValue(typeId, value);

    // Don't clear input here - let the component clear it after API success
    // setNewValueInputs({ ...newValueInputs, [typeId]: "" });
  }

  // ✅ NEW: Separate function to clear input (called after API success)
  function clearInput(typeId) {
    setNewValueInputs((prev) => ({ ...prev, [typeId]: "" }));
  }

  // ✅ NEW: Clear all inputs
  function clearAllInputs() {
    setNewValueInputs({});
  }

  return {
    handleKeyPress,
    handleAddValue,
    newValueInputs,
    setNewValueInputs,
    clearInput, // ✅ Export new function
    clearAllInputs,
  };
}
