import { Badge } from "@/components/ui/badge";
import { Box, Tag } from "lucide-react";

function ProductCardInfo({ category, name, brand, variants }) {
  return (
    <div className="flex flex-col p-5 shadow-2xl gap-3 ">
      <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase">
        <Box size={12} className="text-gray-400" />
        <span className="truncate">{category} </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold leading-tight text-sm sm:text-base md:text-lg line-clamp-3">
          {name}
        </h3>
        <div className="line-clamp-1 gap-1 flex">
          {variants?.map((variant, index) => (
            <Badge variant={"outline"} key={index}>
              {variant}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground self-end sm:mt-8">
        <Tag size={12} className="text-gray-400" />
        <span className="truncate">{brand}</span>
      </div>
    </div>
  );
}

export default ProductCardInfo;
