import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useManualVariantValueInput } from "../../../hooks/useManualVariantValueInput";
import useVariants from "@/hooks/useVariants";

function VariantManualValueInput({ typeId, typeName, onValueCreated }) {
  const {
    handleAddValue,
    handleKeyPress,
    newValueInputs,
    setNewValueInputs,
    clearInput, // ✅ Use the new function
  } = useManualVariantValueInput();

  const { createManyValues, isPendingVariantValues } =
    useVariants.useCreateManyValues({
      onSuccess: (data) => {
        // ✅ Clear input only after API success
        clearInput(typeId);

        if (onValueCreated) {
          onValueCreated();
        }

        console.log("✅ Value created successfully:", data);
      },
      onError: (error) => {
        console.error("❌ Failed to create value:", error);
        // Input stays populated on error - user can retry
      },
    });

  const handleCreateValue = () => {
    const inputValue = newValueInputs[typeId] || "";

    if (!inputValue.trim()) {
      console.warn("Cannot create empty value");
      return;
    }

    // Add to store (optimistic update)
    handleAddValue(typeId, inputValue);

    // Send to API
    createManyValues({
      variant_type_id: typeId,
      values: [inputValue.trim()],
    });
  };

  const handleInputKeyPress = (e) => {
    handleKeyPress(e, handleCreateValue);
  };

  return (
    <div>
      <h5 className="leading-none mb-1">You don't find what you want?</h5>
      <h6 className="text-primary/50 text-xs leading-none mb-2.5">
        It's fine, just create your new one! ✨
      </h6>
      <div className="flex gap-4 items-center">
        <Input
          value={newValueInputs[typeId] || ""} // ✅ Use typeId
          onChange={(e) =>
            setNewValueInputs({
              ...newValueInputs,
              [typeId]: e.target.value, // ✅ Use typeId
            })
          }
          placeholder={`Enter new ${typeName?.toLowerCase() || "value"}...`}
          onKeyPress={handleInputKeyPress}
          disabled={isPendingVariantValues}
        />
        <Button
          onClick={handleCreateValue}
          disabled={
            !(newValueInputs[typeId] && newValueInputs[typeId].trim()) ||
            isPendingVariantValues
          }
        >
          {isPendingVariantValues ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default VariantManualValueInput;
