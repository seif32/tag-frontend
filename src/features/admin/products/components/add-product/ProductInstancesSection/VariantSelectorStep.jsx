import StepHeader from "@/features/admin/ui/StepHeader";
import VariantTypeRow from "./VariantTypeRow";
import useVariantStore from "@/features/admin/store/variantStore";

function VariantSelectorStep() {
  const variants = useVariantStore((state) => state.variants);
  console.log("VariantSelectorStep", JSON.stringify(variants, null, 2));

  const x = {
    id: "1754096185799",
    type: "color",
    values: [
      {
        id: "qwO8l7SzF8B33DHeVgQob",
        value: "l",
      },
    ],
  };

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
