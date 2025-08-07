import { Badge } from "@/components/ui/badge";
import { MdCancel } from "react-icons/md";

function VariantValueList({ variant }) {
  return (
    <>
      {variant.values.length === 0 && (
        <p className="text-xs text-muted-foreground   grid place-items-center">
          No values added yet.
        </p>
      )}

      {variant.values.map((value) => (
        <Badge key={value.id} variant="secondary" className="gap-1 pb-0 pt0">
          <span className="text-sm">{value.value}</span>
          <MdCancel className="text-sm transition-all duration-75 cursor-pointer hover:text-red-600" />
        </Badge>
      ))}
    </>
  );
}

export default VariantValueList;
