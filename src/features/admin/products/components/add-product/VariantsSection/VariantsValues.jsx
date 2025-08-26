import useVariantStore from "@/features/admin/store/variantStore";
import VariantValueDialog from "./VariantValueDialog";
import VariantValueList from "./VariantValueList";

function VariantsValues({ typeId, typeName }) {
  const selectedValues = useVariantStore((state) => state.selectedValues);
  const valuesForThisType =
    selectedValues.find((sv) => sv.typeId === typeId)?.values || [];

  const safeValues = valuesForThisType.map((item) => ({
    id: item.id,
    value: item.value,
  }));

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Values</p>
      <div className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[60px]">
        <VariantValueList typeId={typeId} values={safeValues} />
        <VariantValueDialog typeId={typeId} typeName={typeName} />
      </div>
    </div>
  );
}

export default VariantsValues;
