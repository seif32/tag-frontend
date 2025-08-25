import StepHeader from "@/features/admin/ui/StepHeader";
import VariantTypeRow from "./VariantTypeRow";
import useVariantStore from "@/features/admin/store/variantStore";
import { consoleObject } from "@/utils/consoleObject";

function VariantSelectorStep() {
  const selectedValues = useVariantStore((state) => state.selectedValues);

  return (
    <div className="px-1 space-y-4">
      <StepHeader step={1} title={" Select Variant Type & Values"} />
      {selectedValues.map((variant) => (
        <VariantTypeRow key={variant.typeId} variant={variant} />
      ))}
    </div>
  );
}

export default VariantSelectorStep;
