import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function ProductSheetHeader() {
  return (
    <SheetHeader className={"pb-0"}>
      <SheetTitle className={"flex justify-between"}>
        <h1 className={"text-3xl font-normal font-degular "}>
          Create your product
        </h1>
        <Button className={"cursor-pointer"}>Add</Button>
      </SheetTitle>
      {/* <SheetDescription>
        <p className="text-sm font-normal leading-none text-gray-400 w-100">
          Guide your customers to the exact option they want—pick variants, fill
          in details, and make your catalog shine!
        </p>
      </SheetDescription> */}
    </SheetHeader>
  );
}

export default ProductSheetHeader;
