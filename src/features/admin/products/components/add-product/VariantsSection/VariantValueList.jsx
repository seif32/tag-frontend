import { Badge } from "@/components/ui/badge";
import useVariantStore from "@/features/admin/store/variantStore";
import { MdCancel } from "react-icons/md";

function VariantValueList({ typeId, values }) {
  const removeSelectedValue = useVariantStore(
    (state) => state.removeSelectedValue
  );

  function handleClick(valueId, valueString) {
    removeSelectedValue(typeId, valueId, valueString);
  }

  return (
    <>
      {values.length === 0 && (
        <p className="grid text-xs text-muted-foreground place-items-center">
          No values added yet.
        </p>
      )}

      {values.map((item) => (
        <Badge
          key={item.id} // ✅ Use the actual ID as key
          variant="secondary"
          className="gap-1 pt-0 pb-0"
        >
          <span className="text-sm capitalize">{item.value}</span>{" "}
          <span
            onClick={() => handleClick(item.id, item.value)}
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
