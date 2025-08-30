import useVariantStore from "@/features/admin/store/variantStore";
import VariantValueDialog from "./VariantValueDialog";
import VariantValueList from "./VariantValueList";
import useProductStore from "@/features/admin/store/productStore";
import { useEffect, useMemo } from "react";
import { consoleObject } from "@/utils/consoleObject";

function VariantsValues({ typeId, typeName, variantValues }) {
  const selectedValues = useVariantStore((state) => state.selectedValues);
  const setSelectedValues = useVariantStore((state) => state.setSelectedValues);
  const mode = useProductStore((state) => state.mode);
  const isEditMode = mode === "edit";

  consoleObject(selectedValues);

  // ✅ Remove duplicates from variantValues when setting initial state
  const cleanedVariantValues = useMemo(() => {
    if (!variantValues || !Array.isArray(variantValues)) return [];

    return variantValues.map((typeGroup) => ({
      ...typeGroup,
      values: typeGroup.values.filter(
        (value, index, array) =>
          // Keep only the first occurrence of each ID
          array.findIndex((v) => v.id === value.id) === index
      ),
    }));
  }, [variantValues]);

  useEffect(() => {
    if (isEditMode) {
      console.log("🧹 Setting cleaned variant values:", cleanedVariantValues);
      setSelectedValues(cleanedVariantValues);
    }
  }, [isEditMode, cleanedVariantValues, setSelectedValues]);

  const valuesForThisType =
    selectedValues.find((sv) => sv.typeId === typeId)?.values || [];

  // ✅ Remove duplicates from current values as well
  const uniqueValues = useMemo(() => {
    const seen = new Set();
    return valuesForThisType.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }, [valuesForThisType]);

  const safeValues = uniqueValues.map((item) => ({
    id: item.id,
    value: item.value,
  }));

  console.log(`🎯 Unique values for ${typeName}:`, safeValues);

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
