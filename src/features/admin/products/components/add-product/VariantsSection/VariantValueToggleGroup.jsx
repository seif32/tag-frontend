import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToggleGroupState } from "../../../hooks/useToggleGroupState";

const variantValues = [
  {
    value: "s",
    label: "S",
  },
  {
    value: "m",
    label: "M",
  },
  {
    value: "l",
    label: "L",
  },
  {
    value: "xl",
    label: "XL",
  },
];

function VariantValueToggleGroup({ variant, setIsDialogOpen }) {
  const { handleSelectValue, selectedValues, setSelectedValues } =
    useToggleGroupState(variant, setIsDialogOpen);
  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="leading-none mb-1">Choose value</h5>
          <h6 className="text-primary/50 text-xs leading-none mb-2.5">
            Just click on it!
          </h6>
        </div>
        <Button onClick={handleSelectValue}>Done</Button>
      </div>

      <ToggleGroup
        value={selectedValues}
        onValueChange={setSelectedValues}
        type="multiple"
        className={"gap-2 flex flex-wrap"}
      >
        {variantValues.map((value) => {
          return (
            <ToggleGroupItem key={value.value} value={value.value}>
              {value.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}

export default VariantValueToggleGroup;
