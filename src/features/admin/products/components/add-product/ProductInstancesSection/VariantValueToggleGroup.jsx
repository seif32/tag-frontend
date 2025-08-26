import { ToggleGroup } from "@/components/ui/toggle-group";
import VariantToggleChip from "./VariantToggleChip";
import { PiEmptyLight } from "react-icons/pi";

function VariantValueToggleGroup({ variant, onValueSelect, currentSelection }) {
  const isValues = variant.values && variant.values.length !== 0;

  return isValues ? (
    <ToggleGroup
      type="single"
      value={currentSelection?.value || ""}
      onValueChange={(selectedValue) => {
        const valueObject = variant.values.find(
          (v) => v.value === selectedValue
        );
        onValueSelect(valueObject);
      }}
      className="flex flex-wrap gap-2"
    >
      {variant.values.map((value) => (
        <VariantToggleChip key={value.id} value={value} />
      ))}
    </ToggleGroup>
  ) : (
    <div className="flex flex-col items-start p-4 bg-red-200 border border-red-600 rounded-md">
      <PiEmptyLight className="text-red-600" size={32} />
      <p className="text-sm font-bold text-red-600">No values</p>
      <p className="text-xs text-red-600">
        Please choose values in variants section first
      </p>
    </div>
  );
}

export default VariantValueToggleGroup;
