import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function ProductSheetHeader({ onAddVariant }) {
  return (
    <SheetHeader className={"pb-0"}>
      <SheetTitle className={"flex justify-between"}>
        <p className={"text-3xl font-normal font-degular "}>
          Create your product
        </p>
        <Button className="cursor-pointer" onClick={onAddVariant}>
          Add Variant
        </Button>
      </SheetTitle>
    </SheetHeader>
  );
}

export default ProductSheetHeader;
