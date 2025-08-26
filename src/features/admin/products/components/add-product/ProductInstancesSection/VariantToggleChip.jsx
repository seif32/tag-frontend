import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

function VariantToggleChip({ value }) {
  return (
    <ToggleGroupItem
      value={value.value}
      className="px-3 py-1 rounded-md border-2 data-[state=on]:bg-blue-100 data-[state=on]:text-black data-[state=on]:border-2 data-[state=on]:border-blue-500 max-w-fit "
    >
      {value.value}
      {/* <IoCheckmarkCircleSharp className="group-data-[state=off]:hidden text-blue-500 group-data-[state=on]:absolute -top-1 -right-1" /> */}
    </ToggleGroupItem>
  );
}

export default VariantToggleChip;
