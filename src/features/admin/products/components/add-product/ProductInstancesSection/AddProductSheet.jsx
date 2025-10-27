import { useFormContext } from "react-hook-form";
import ProductSheetHeader from "./ProductSheetHeader";
import VariantSelectorStep from "./VariantSelectorStep";
import ProductDetailsStep from "./ProductDetailsStep";
import ProductImagesStep from "./ProductImagesStep";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    newVariant,
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

import NoVariantsSVG from "@/assets/svg/noVariants.svg";
import CornerDownLeft from "@/assets/svg/corner-down-left.svg";

function EmptyState() {
  return (
    <div className="flex flex-col items-center my-auto space-y-8">
      <img
        src={NoVariantsSVG}
        alt="No variants"
        className="w-[225px] mx-auto"
      />
      <div className="space-y-2 text-center w-90">
        <h1 className="text-3xl ">No variants created yet</h1>
        <p className="leading-5 text-black/50">
          Add a variant type (like Color, Size, etc.) to start configuring your
          product.
        </p>
        <img
          src={CornerDownLeft}
          alt="corner down left"
          className="w-[75px] mx-auto"
        />
      </div>
    </div>
  );
}
