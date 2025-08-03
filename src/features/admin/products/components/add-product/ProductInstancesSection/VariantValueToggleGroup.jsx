import { ToggleGroup } from "@/components/ui/toggle-group";
import VariantToggleChip from "./VariantToggleChip";
import { useState } from "react";
import useVariantStore from "@/features/admin/store/variantStore";

function VariantValueToggleGroup({ variant }) {
  const setSelectedValue = useVariantStore((state) => state.setSelectedValue);
  const selectedValues = useVariantStore((state) => state.selectedValues);

  function handleValueChange(variantId, value) {
    setSelectedValue(variantId, value);
  }

  const isValues = variant.values.length !== 0;

  return isValues ? (
    <ToggleGroup
      type="single"
      value={
        selectedValues.find((item) => item.typeid === variant.id)?.value || ""
      }
      onValueChange={(values) => handleValueChange(variant.id, values)}
      className="flex flex-wrap gap-2"
    >
      {variant.values.map((item) => (
        <VariantToggleChip key={item.id} item={item} />
      ))}
    </ToggleGroup>
  ) : (
    <div className="flex flex-col items-start p-4 bg-red-200 border border-red-600 rounded-md ">
      <p className="text-sm font-bold text-red-600">No values</p>
      <p className="text-xs text-red-600">
        Please choose values in variants section first
      </p>
    </div>
  );
}

export default VariantValueToggleGroup;
