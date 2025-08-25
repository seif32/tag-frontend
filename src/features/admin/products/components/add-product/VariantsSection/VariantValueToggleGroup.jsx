import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToggleGroupState } from "../../../hooks/useToggleGroupState";
import useVariants from "@/hooks/useVariants";
import LoadingState from "@/ui/LoadingState";

function VariantValueToggleGroup({ variant, setIsDialogOpen }) {
  const {
    handleSelectValue,
    selectedValues,
    setSelectedValues,
    canPerformActions,
  } = useToggleGroupState(variant, setIsDialogOpen);

  const { variantValues, isLoadingVariantValues } = useVariants.useValuesByType(
    variant.type
  );

  console.log("ddddddddd", variant);

  if (isLoadingVariantValues) return <LoadingState />;

  if (!variantValues || variantValues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="text-gray-400 mb-2">📭</div>
        <h5 className="text-sm font-medium mb-1">No values available</h5>
        <p className="text-xs text-gray-500 mb-3">
          No {variant.name?.toLowerCase()} values have been configured yet.
        </p>
        <p className="text-xs font-bold mb-3">Add from below</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="leading-none mb-1">
            Choose {variant.name?.toLowerCase() || "value"}
          </h5>
          <h6 className="text-primary/50 text-xs leading-none mb-2.5">
            Select multiple options by clicking them! ✨
          </h6>
        </div>

        <Button
          onClick={handleSelectValue}
          disabled={!canPerformActions}
          size="sm"
        >
          Done
        </Button>
      </div>

      <ToggleGroup
        value={selectedValues}
        onValueChange={setSelectedValues}
        type="multiple"
        className="gap-2 flex flex-wrap"
      >
        {variantValues.map((value) => (
          <ToggleGroupItem
            key={value.id}
            value={value.value}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary  flex-none"
          >
            {value.value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* 🎪 Optional: Clear All Button */}
      {selectedValues.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedValues([])}
          className="self-start mt-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

export default VariantValueToggleGroup;
