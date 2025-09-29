import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddVariantDialog from "./AddVariantDialog";
import VariantsType from "./VariantsType";
import VariantsValues from "./VariantsValues";
import NoVariants from "./NoVariants";
import VariantsHeader from "./VariantsHeader";
import useVariantStore from "@/features/admin/store/variantStore";
import useProductStore from "@/features/admin/store/productStore";
import { useEffect, useMemo } from "react";

function VariantsSection({ variantValues, variantTypes }) {
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const selectedTypes = useVariantStore((state) => state.selectedTypes);
  const setSelectedTypes = useVariantStore((state) => state.setSelectedTypes);

  const cleanedVariantValues = useMemo(() => {
    if (!variantValues || !Array.isArray(variantValues)) return [];

    return variantValues.map((variant) => {
      const uniqueValues = [];
      const seen = new Set();

      variant.values?.forEach((value) => {
        const identifier = `${value.id}-${value.value}`;
        if (!seen.has(identifier)) {
          uniqueValues.push(value);
          seen.add(identifier);
        }
      });

      return {
        ...variant,
        values: uniqueValues,
      };
    });
  }, [variantValues]);

  const getColorStyle = (color) => {
    const colorMap = {
      Black: "border-gray-800 text-gray-800",
      White: "border-gray-300 text-gray-700",
      Red: "border-red-500 text-red-600",
      Green: "border-green-500 text-green-600",
      Blue: "border-blue-500 text-blue-600",
      Yellow: "border-yellow-500 text-yellow-600",
      Purple: "border-purple-500 text-purple-600",
      Orange: "border-orange-500 text-orange-600",
      Pink: "border-pink-500 text-pink-600",
      Gray: "border-gray-500 text-gray-600",
      Brown: "border-yellow-800 text-yellow-800",
    };
    return colorMap[color] || "border-gray-400 text-gray-600";
  };

  useEffect(() => {
    if (isEditMode) {
      setSelectedTypes(variantTypes);
    }
  }, [isEditMode, variantTypes, setSelectedTypes]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3">
        <h2 className="text-md font-semibold">Variants</h2>
        {!isViewMode && <AddVariantDialog />}
      </CardHeader>
      <CardContent>
        {isViewMode ? (
          <div className="space-y-4">
            {cleanedVariantValues.length === 0 ? (
              <p className="text-sm text-gray-500">No variants available</p>
            ) : (
              cleanedVariantValues.map((variant) => (
                <div key={variant.typeId} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    {variant.typeName}
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {variant.values.map((value) => (
                      <span
                        key={`${value.id}-${value.value}`}
                        className={`
                          px-3 py-1 text-xs font-medium rounded-md border-2 bg-white
                          ${
                            variant.typeName === "Color"
                              ? getColorStyle(value.value)
                              : "border-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {value.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {selectedTypes?.map((type, index) => (
              <div key={type.id} className="space-y-4">
                <VariantsHeader index={index} typeId={type.id} />
                <div className="grid grid-cols-[1fr_4fr] gap-4">
                  <VariantsType variantType={type.name} />
                  <VariantsValues
                    typeId={type.id}
                    typeName={type.name}
                    variantValues={cleanedVariantValues}
                  />
                </div>
              </div>
            ))}
            {selectedTypes.length === 0 && <NoVariants />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VariantsSection;
