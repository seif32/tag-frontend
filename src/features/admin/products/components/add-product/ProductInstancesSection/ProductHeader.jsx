import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";

function ProductHeader({ product }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-bold">{product.name}</h3>
        <span className="text-sm text-muted-foreground">
          {product.variants}
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Edit2 size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <IoTrashOutline size={16} />
        </Button>
      </div>
    </div>
  );
}

export default ProductHeader;
