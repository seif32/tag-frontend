import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function ProductSheetHeader() {
  return (
    <SheetHeader>
      <SheetTitle>
        <h1 className={"text-3xl font-normal font-degular "}>
          Create your product
        </h1>
      </SheetTitle>
      {/* <SheetDescription>
        <p className="w-100 text-sm text-gray-400 leading-none font-normal">
          Guide your customers to the exact option they want—pick variants, fill
          in details, and make your catalog shine!
        </p>
      </SheetDescription> */}
    </SheetHeader>
  );
}

export default ProductSheetHeader;
