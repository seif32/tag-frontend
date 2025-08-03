import StepHeader from "@/features/admin/ui/StepHeader";
import VariantTypeRow from "./VariantTypeRow";
import useVariantStore from "@/features/admin/store/variantStore";
import { useState } from "react";

function VariantSelectorStep() {
  const variants = useVariantStore((state) => state.variants);
  const selectedValues = useVariantStore((state) => state.selectedValues);

  console.log("VariantSelectorStep", JSON.stringify(selectedValues, null, 2));

  return (
    <div className="px-1 space-y-4">
      <StepHeader step={1} title={" Select Variant Type & Values"} />
      {variants.map((variant) => (
        <VariantTypeRow key={variant.id} variant={variant} />
      ))}
    </div>
  );
}

export default VariantSelectorStep;
