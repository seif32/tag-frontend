import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { IoTrashOutline } from "react-icons/io5";

function ProductHeader({ product }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-bold">{product.variantName}</h3>
        <div className="flex gap-2">
          {product.types.map((type) => (
            <span
              key={type.typeid}
              className="text-xs text-white bg-black border px-2 border-black  rounded-md"
            >
              {type.value.toUpperCase()}
            </span>
          ))}
        </div>
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
