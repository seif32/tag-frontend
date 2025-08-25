import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddVariantDialog from "./AddVariantDialog";
import VariantsType from "./VariantsType";
import VariantsValues from "./VariantsValues";
import NoVariants from "./NoVariants";
import VariantsHeader from "./VariantsHeader";
import useVariantStore from "@/features/admin/store/variantStore";
import useProductStore from "@/features/admin/store/productStore";

function VariantsSection({ variantValues }) {
  const variants = useVariantStore((state) => state.variants);
  const mode = useProductStore((state) => state.mode);
  const isViewMode = mode === "view";

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <h2 className="text-md font-semibold">Variants</h2>
        {!isViewMode && <AddVariantDialog />}
      </CardHeader>
      <CardContent>
        {isViewMode ? (
          <div className="space-y-4">
            {Object.entries(variantValues).map(([variantType, options]) => (
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
                    {options.map((option, index) => (
                      <span
                        className="px-3 py-1 bg-gray-100 rounded-md text-sm mr-2 "
                        key={`${variantType}-${option}-${index}`}
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div key={variant.id} className="space-y-4">
                <VariantsHeader index={index} variantId={variant.id} />
                <div className="grid grid-cols-[1fr_4fr] gap-4">
                  <VariantsType variantType={variant.name} />
                  <VariantsValues variant={variant} variants={variants} />
                </div>
              </div>
            ))}

            {variants.length === 0 && <NoVariants />}
          </div>
        )}
      </CardContent>
      <div className="space-y-4"></div>
    </Card>
  );
}

export default VariantsSection;
