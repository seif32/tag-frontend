import useVariantStore from "@/features/admin/store/variantStore";
import VariantValueDialog from "./VariantValueDialog";
import VariantValueList from "./VariantValueList";
import useProductStore from "@/features/admin/store/productStore";
import { useEffect, useMemo } from "react";

function VariantsValues({ typeId, typeName, variantValues }) {
  const selectedValues = useVariantStore((state) => state.selectedValues);
  const setSelectedValues = useVariantStore((state) => state.setSelectedValues);
  const mode = useProductStore((state) => state.mode);
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (isEditMode) {
      setSelectedValues(variantValues);
    }
  }, [isEditMode, variantValues, setSelectedValues]);

  const uniqueValues = useMemo(() => {
    const valuesForThisType =
      selectedValues.find((sv) => sv.typeId === typeId)?.values || [];
    return valuesForThisType;
  }, [selectedValues, typeId]);

  const safeValues = uniqueValues.map((item) => ({
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
