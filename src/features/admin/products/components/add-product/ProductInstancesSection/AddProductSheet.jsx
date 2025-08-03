import { useFormContext, useFieldArray } from "react-hook-form";
import { useState } from "react";
import useVariantStore from "@/features/admin/store/variantStore";
import ProductSheetHeader from "./ProductSheetHeader";
import VariantSelectorStep from "./VariantSelectorStep";
import ProductDetailsStep from "./ProductDetailsStep";
import ProductImagesStep from "./ProductImagesStep";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyState from "@/features/admin/ui/EmptyState";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AddProductSheet() {
  const { control, getValues, resetField } = useFormContext();
  const { append } = useFieldArray({ control, name: "variants" });
  const { selectedValues, resetSelectedValues } = useVariantStore();

  const [tempImages, setTempImages] = useState([]);

  const variants = useVariantStore((state) => state.variants);
  const isVariants = variants.length !== 0;

  // ✅ Unified handler for saving a variant
  const handleAddVariant = () => {
    const variantData = getValues("variants.0");

    const newVariant = {
      ...variantData,
      types: selectedValues,
      images: tempImages,
    };

    append(newVariant);

    // ✅ Reset all temporary states
    resetField("variants.0.variantName");
    resetField("variants.0.variantSku");
    resetField("variants.0.quantity");
    resetField("variants.0.price");
    resetField("variants.0.currency");
    resetField("variants.0.compareAtPrice");
    resetField("variants.0.costPrice");

    resetSelectedValues();
    setTempImages([]);
  };

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="flex flex-col max-h-[100vh] ">
        {isVariants ? (
          <>
            <ProductSheetHeader onAddVariant={handleAddVariant} />
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-4 mb-30 space-y-14">
                <VariantSelectorStep />
                <ProductDetailsStep />
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
