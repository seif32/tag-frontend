import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useManualVariantValueInput } from "../../../hooks/useManualVariantValueInput";
import useVariants from "@/hooks/useVariants";

function VariantManualValueInput({ variant }) {
  const { handleAddValue, handleKeyPress, newValueInputs, setNewValueInputs } =
    useManualVariantValueInput();

  const { createManyValues, isPendingVariantValues } =
    useVariants.useCreateManyValues();

  // 🎯 Handle form submission
  const handleCreateValue = () => {
    const inputValue = newValueInputs[variant.id] || "";

    // ✅ Validation - don't send empty values
    if (!inputValue.trim()) {
      console.warn("Cannot create empty value");
      return;
    }

    // 🚀 Call your hook's add function
    handleAddValue(variant.id, inputValue);

    // 🎯 Send to API with the actual input value
    createManyValues({
      variant_type_id: variant.type,
      values: [inputValue.trim()], // ✅ Pass the actual input value!
    });

    console.log("Creating value:", inputValue, "for variant:", variant);
  };

  // 🎯 Enhanced key press handler
  const handleInputKeyPress = (e) => {
    handleKeyPress(e, handleCreateValue);
  };

  return (
    <div>
      <h5 className="leading-none mb-1">You don't find what you want?</h5>
      <h6 className="text-primary/50 text-xs leading-none mb-2.5">
        It's fine, just create your new one!
      </h6>
      <div className="flex gap-4 items-center">
        <Input
          value={newValueInputs[variant.id] || ""}
          onChange={(e) =>
            setNewValueInputs({
              ...newValueInputs,
              [variant.id]: e.target.value,
            })
          }
          placeholder="Enter new value..."
          onKeyPress={handleInputKeyPress}
          disabled={isPendingVariantValues} // ✅ Disable during API call
        />
        <Button
          onClick={handleCreateValue}
          disabled={
            !(
              newValueInputs[variant.id] && newValueInputs[variant.id].trim()
            ) || isPendingVariantValues // ✅ Disable during API call
          }
        >
          {isPendingVariantValues ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default VariantManualValueInput;
