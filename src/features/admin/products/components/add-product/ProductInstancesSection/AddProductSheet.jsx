import { useFormContext } from "react-hook-form";
import ProductSheetHeader from "./ProductSheetHeader";
import VariantSelectorStep from "./VariantSelectorStep";
import ProductDetailsStep from "./ProductDetailsStep";
import ProductImagesStep from "./ProductImagesStep";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyState from "@/features/admin/ui/EmptyState";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAddProductInstance } from "../../../hooks/useAddProductInstance";

function AddProductSheet({ variantsList, append }) {
  const { control, getValues, resetField } = useFormContext();
  const {
    handleAddVariant,
    isVariants,
    tempImages,
    setTempImages,
    fields,
    currentSelections,
    setCurrentSelections,
  } = useAddProductInstance(
    control,
    getValues,
    resetField,
    variantsList,
    append
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} className={"text-xs"}>
          Add Product
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col max-h-[100vh] ">
        {isVariants ? (
          <>
            <ProductSheetHeader onAddVariant={handleAddVariant} />
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-4 mb-30 space-y-14">
                <VariantSelectorStep
                  currentSelections={currentSelections}
                  setCurrentSelections={setCurrentSelections}
                />
                <ProductDetailsStep currentSelections={currentSelections} />
                <ProductImagesStep
                  setImages={setTempImages}
                  images={tempImages}
                />
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
