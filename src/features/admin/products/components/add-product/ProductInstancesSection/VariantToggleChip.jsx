import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

function VariantToggleChip({ item }) {
  return (
    <ToggleGroupItem
      // ❌ Remove key prop - it's already handled by parent
      value={item.value} // ✅ This will be the actual string value like "Black", "Blue", etc.
      className="px-3 py-1 rounded-md border-2 data-[state=on]:bg-blue-100 data-[state=on]:text-black data-[state=on]:border-2 data-[state=on]:border-blue-500"
    >
      {item.value}{" "}
      {/* ✅ Displays "Black", "Blue", "btengany", "512GB", etc. */}
      <IoCheckmarkCircleSharp className="group-data-[state=off]:hidden text-blue-500 group-data-[state=on]:absolute -top-1 -right-1" />
    </ToggleGroupItem>
  );
}

export default VariantToggleChip;
