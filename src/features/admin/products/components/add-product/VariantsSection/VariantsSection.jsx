import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddVariantDialog from "./AddVariantDialog";
import VariantsType from "./VariantsType";
import VariantsValues from "./VariantsValues";
import NoVariants from "./NoVariants";
import VariantsHeader from "./VariantsHeader";
import useVariantStore from "@/features/admin/store/variantStore";
import useProductStore from "@/features/admin/store/productStore";
import { useEffect } from "react";

function VariantsSection({ variantValues }) {
  console.log("babyyyyyyyy", variantValues);

  const variants = useVariantStore((state) => state.variants);
  const setVariants = useVariantStore((state) => state.setVariants);
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  // 🎯 Transform backend format to store format
  const transformBackendToStore = (variantValues) => {
    return Object.entries(variantValues).map(
      ([variantType, options], index) => ({
        id: `variant-${index}`, // ✅ Matches your exact format
        name: variantType,
        type: variantType.toLowerCase(),
        values: Array.isArray(options)
          ? options.map((option, optIndex) => ({
              id: `value-${index}-${optIndex}`, // ✅ Matches your exact format
              value: option,
            }))
          : [],
      })
    );
  };

  // 🔄 Sync backend data to store ONLY in edit mode and when store is empty
  useEffect(() => {
    if (
      variantValues &&
      Object.keys(variantValues).length > 0 &&
      isEditMode &&
      variants.length === 0 // ✅ Only sync if store is empty to avoid conflicts
    ) {
      const transformedVariants = transformBackendToStore(variantValues);
      setVariants(transformedVariants);
      console.log("🔄 Synced backend data to store:", transformedVariants);
    }
  }, [variantValues, isEditMode, variants.length, setVariants]);

  // 🎯 Helper to check if we have data
  const hasVariantData = () => {
    if (isViewMode) {
      return variantValues && Object.keys(variantValues).length > 0;
    }
    return variants && variants.length > 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <h2 className="text-md font-semibold">Variants</h2>
        {!isViewMode && <AddVariantDialog />}
      </CardHeader>
      <CardContent>
        {isViewMode ? (
          // 👁️ VIEW MODE: Read-only display from backend data
          <div className="space-y-4">
            {hasVariantData() ? (
              Object.entries(variantValues).map(([variantType, options]) => (
                <div key={variantType} className="flex gap-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="font-semibold text-gray-800 mb-2">
                      {variantType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm">Values</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(options) ? (
                          options.map((option, index) => (
                            <span
                              className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                              key={`${variantType}-${option}-${index}`}
                            >
                              {option}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No options available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No variant data available
                </p>
              </div>
            )}
          </div>
        ) : (
          // ✏️ EDIT MODE: Editable variants from Zustand store
          <div className="space-y-6">
            {hasVariantData() ? (
              variants.map((variant, index) => (
                <div key={variant.id} className="space-y-4">
                  <VariantsHeader index={index} variantId={variant.id} />
                  <div className="grid grid-cols-[1fr_4fr] gap-4">
                    <VariantsType variantType={variant.name} />
                    <VariantsValues variant={variant} variants={variants} />
                  </div>
                </div>
              ))
            ) : (
              <NoVariants />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VariantsSection;
