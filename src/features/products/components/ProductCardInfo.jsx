import { CardContent } from "@/components/ui/card";
import { StrikePrice } from "@/ui/StrikePrice";
import { Box, Tag } from "lucide-react";

function ProductCardInfo({ category, name, variantCount, brand }) {
  return (
    <CardContent className={"px-4"}>
      <div className="grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr]">
        <span className="flex items-center self-end gap-1 text-xs tracking-wide text-gray-500 uppercase">
          <Box size={14} />

          {category}
        </span>

        <h3 className="row-start-2 font-semibold leading-tight ">{name}</h3>

        <p className="flex items-center col-start-2 row-start-2 gap-0.5 text-sm text-muted-foreground">
          <Tag size={12} />

          {brand}
        </p>
      </div>
    </CardContent>
  );
}

export default ProductCardInfo;
