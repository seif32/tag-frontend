import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductSheetHeader from "./ProductSheetHeader";
import VariantSelectorStep from "./VariantSelectorStep";
import ProductDetailsStep from "./ProductDetailsStep";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductImages from "./ProductImages";
import useVariantStore from "@/features/admin/store/variantStore";
import EmptyState from "@/features/admin/ui/EmptyState";

function AddProductSheet() {
  const variants = useVariantStore((state) => state.variants);

  const isVariants = variants.length !== 0;

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="flex flex-col max-h-[100vh] ">
        {isVariants ? (
          <>
            <ProductSheetHeader />
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-4 mb-30 space-y-14">
                <VariantSelectorStep />
                <ProductDetailsStep />
                <ProductImages />
              </div>
            </ScrollArea>
          </>
        ) : (
          <EmptyState />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default AddProductSheet;
