import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useManualVariantValueInput } from "../../../hooks/useManualVariantValueInput";

function VariantManualValueInput({ variant }) {
  const { handleAddValue, handleKeyPress, newValueInputs, setNewValueInputs } =
    useManualVariantValueInput();
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
          placeholder="(optional)"
          className=" "
          onKeyPress={(e) => {
            handleKeyPress(e, () =>
              handleAddValue(variant.id, newValueInputs[variant.id] || "")
            );
          }}
        />
        <Button
          onClick={() => {
            handleAddValue(variant.id, newValueInputs[variant.id] || "");
          }}
          disabled={
            !(newValueInputs[variant.id] && newValueInputs[variant.id].trim())
          }
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default VariantManualValueInput;
