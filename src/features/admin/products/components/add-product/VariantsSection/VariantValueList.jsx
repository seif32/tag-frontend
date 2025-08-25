import { Badge } from "@/components/ui/badge";
import useVariantStore from "@/features/admin/store/variantStore";
import { MdCancel } from "react-icons/md";

function VariantValueList({ typeId, values }) {
  // ✨ Use the correct function name
  const removeSelectedValue = useVariantStore(
    (state) => state.removeSelectedValue
  );

  function handleClick(value) {
    // ✨ Pass the value string, not an id
    removeSelectedValue(typeId, value);
  }

  return (
    <>
      {values.length === 0 && (
        <p className="grid text-xs text-muted-foreground place-items-center">
          No values added yet.
        </p>
      )}

      {values.map(
        (
          value,
          index // ✅ Use index as key since values are strings
        ) => (
          <Badge
            key={`${typeId}-${value}-${index}`}
            variant="secondary"
            className="gap-1 pt-0 pb-0"
          >
            <span className="text-sm capitalize">{value}</span>{" "}
            {/* ✅ Just display the string */}
            <span
              onClick={() => handleClick(value)} // ✅ Pass the string value
              role="button"
              className="flex items-center"
            >
              <MdCancel className="text-sm transition-all duration-200 cursor-pointer hover:scale-110 hover:text-red-500" />
            </span>
          </Badge>
        )
      )}
    </>
  );
}

export default VariantValueList;
