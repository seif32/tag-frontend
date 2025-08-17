import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function VariantsSection() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <p className="text-sm font-medium">Color :</p>
        <p className="text-sm">Red</p>
      </div>
      <ToggleGroup type="single" className={"flex gap-2"}>
        <ToggleGroupItem
          className={
            "data-[state=on]:bg-black/20 data-[state=on]:text-black data-[state=on]:border-black"
          }
          value="a"
        >
          Red
        </ToggleGroupItem>
        <ToggleGroupItem
          className={
            "data-[state=on]:bg-black/20 data-[state=on]:text-black data-[state=on]:border-black"
          }
          value="b"
        >
          Blue
        </ToggleGroupItem>
        <ToggleGroupItem
          className={
            "data-[state=on]:bg-black/20 data-[state=on]:text-black data-[state=on]:border-black"
          }
          value="c"
        >
          Black
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default VariantsSection;
