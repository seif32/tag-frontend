import { ToggleGroup } from "@/components/ui/toggle-group";
import VariantToggleChip from "./VariantToggleChip";
import { useState } from "react";

function VariantValueToggleGroup({ variant }) {
  const [selected, setSelected] = useState({});
  function handleValueChange(variantId, values) {
    setSelected((prev) => ({ ...prev, [variantId]: values }));
  }
  return (
    <ToggleGroup
      type="single"
      value={selected[variant.id] || []}
      onValueChange={(values) => handleValueChange(variant.id, values)}
      className="flex gap-2 flex-wrap"
    >
      {variant.values.map((item) => (
        <VariantToggleChip key={item.id} item={item} />
      ))}
    </ToggleGroup>
  );
}

export default VariantValueToggleGroup;
