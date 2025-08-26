import StepHeader from "@/features/admin/ui/StepHeader";
import VariantTypeRow from "./VariantTypeRow";
import useVariantStore from "@/features/admin/store/variantStore";
import { useState } from "react";

function VariantSelectorStep({ setCurrentSelections, currentSelections }) {
  const selectedValues = useVariantStore((state) => state.selectedValues);

  function handleValueSelect(typeId, valueObject) {
    setCurrentSelections((prev) => ({
      ...prev,
      [typeId]: valueObject,
    }));
  }

  return (
    <div className="px-1 space-y-4">
      <StepHeader step={1} title={" Select Variant Type & Values"} />
      {selectedValues.map((variant) => (
        <VariantTypeRow
          key={variant.typeId}
          variant={variant}
          currentSelection={currentSelections[variant.typeId]}
          onValueSelect={(valueObj) =>
            handleValueSelect(variant.typeId, valueObj)
          }
        />
      ))}
    </div>
  );
}

export default VariantSelectorStep;
