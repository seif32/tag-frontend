import { CardContent } from "@/components/ui/card";
import { StrikePrice } from "@/ui/StrikePrice";

function ProductCardInfo() {
  return (
    <CardContent className={"px-4"}>
      <div className="grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr]">
        <span className="text-xs text-gray-500 uppercase tracking-wide block self-end">
          mobiles
        </span>

        <StrikePrice price={"45.99"} className="self-end" />

        <h3 className="text-base font-semibold text-gray-900 leading-tight flex-1 ">
          iPhone 11 128GB
        </h3>

        <span className="text-lg font-bold text-green-600 whitespace-nowrap justify-self-end self-start  leading-none">
          $25.99
        </span>
      </div>
    </CardContent>
  );
}

export default ProductCardInfo;
