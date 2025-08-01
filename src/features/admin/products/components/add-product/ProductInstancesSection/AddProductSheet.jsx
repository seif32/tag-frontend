import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductSheetHeader from "./ProductSheetHeader";
import VariantSelectorStep from "./VariantSelectorStep";
import ProductDetailsStep from "./ProductDetailsStep";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductImages from "./ProductImages";

function AddProductSheet() {
  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="flex flex-col max-h-[100vh] ">
        <ProductSheetHeader />
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-4 mb-30 space-y-30">
            <VariantSelectorStep />
            <ProductDetailsStep />
            <ProductImages />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default AddProductSheet;
