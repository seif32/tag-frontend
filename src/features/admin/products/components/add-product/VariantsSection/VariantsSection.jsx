import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddVariantDialog from "./AddVariantDialog";
import VariantsType from "./VariantsType";
import VariantsValues from "./VariantsValues";
import NoVariants from "./NoVariants";
import VariantsHeader from "./VariantsHeader";
import useVariantStore from "@/features/admin/store/variantStore";

function VariantsSection() {
  const variants = useVariantStore((state) => state.variants);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
        <h2 className="text-md font-semibold">Variants</h2>
        <AddVariantDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {variants.map((variant) => (
            <div key={variant.id} className="space-y-4">
              <VariantsHeader variant={variant} variants={variants} />
              <div className="grid grid-cols-[1fr_4fr] gap-4">
                <VariantsType variantType={variant.type} />
                <VariantsValues variant={variant} variants={variants} />
              </div>
            </div>
          ))}

          {variants.length === 0 && <NoVariants />}
        </div>
      </CardContent>
      <div className="space-y-4"></div>
    </Card>
  );
}

export default VariantsSection;
