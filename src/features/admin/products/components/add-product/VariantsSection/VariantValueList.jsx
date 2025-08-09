import { Badge } from "@/components/ui/badge";
import useVariantStore from "@/features/admin/store/variantStore";
import { MdCancel } from "react-icons/md";

function VariantValueList({ variant }) {
  const removeVariantValue = useVariantStore(
    (state) => state.removeVariantValue
  );
  function handleClick(valueId) {
    removeVariantValue(variant.id, valueId);
  }
  return (
    <>
      {variant.values.length === 0 && (
        <p className="grid text-xs text-muted-foreground place-items-center">
          No values added yet.
        </p>
      )}

      {variant.values.map((value) => (
        <Badge key={value.id} variant="secondary" className="gap-1 pt-0 pb-0 ">
          <span className="text-sm capitalize">{value.value}</span>
          <span
            onClick={() => handleClick(value.id)}
            role="button"
            className="flex items-center"
          >
            <MdCancel className="text-sm transition-all duration-200 cursor-pointer hover:scale-110 hover:text-red-500" />
          </span>
        </Badge>
      ))}
    </>
  );
}

export default VariantValueList;
