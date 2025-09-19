import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useVariantStore from "@/features/admin/store/variantStore";
import LoadingState from "@/ui/LoadingState";
import { useState } from "react";

function VariantValueToggleGroup({
  typeId,
  typeName,
  isLoading,
  values,
  error,
  setIsDialogOpen,
}) {
  const setSelectedValuesForType = useVariantStore(
    (state) => state.setSelectedValuesForType
  );
  const selectedValues = useVariantStore((state) => state.selectedValues);
  const existingValuesForType =
    selectedValues.find((sv) => sv.typeId === typeId)?.values || [];
  const [localSelectedValues, setLocalSelectedValues] = useState(
    existingValuesForType || []
  );

  function handleDone() {
    setSelectedValuesForType(typeId, typeName, localSelectedValues);
    setIsDialogOpen(false);
  }

  if (isLoading) return <LoadingState />;

  const isTypeNotFound =
    error &&
    (error.status === 404 ||
      error.isNotFound ||
      error.message?.toLowerCase().includes("not found"));

  if (error && !isTypeNotFound) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-400 mb-2">❌</div>
        <h5 className="text-sm font-medium mb-1">Error loading values</h5>
        <p className="text-xs text-red-500 mb-3">
          {error.message || "Failed to load values"}
        </p>
        <p className="text-xs">Please try again later</p>
      </div>
    );
  }

  if (
    isTypeNotFound ||
    (Array.isArray(values?.data) && values?.data?.length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h5 className="text-sm font-medium mb-1">
          {isTypeNotFound ? "New variant type" : "No values available"}
        </h5>
        <p className="text-xs text-gray-500 mb-3">
          {isTypeNotFound
            ? `This ${typeName?.toLowerCase()} type needs its first values!`
            : `No ${typeName?.toLowerCase()} values have been configured yet.`}
        </p>
        <p className="text-xs font-bold mb-3">Add values below ⬇</p>
      </div>
    );
  }

  if (Array.isArray(values?.data) && values?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="text-gray-400 mb-2">📭</div>
        <h5 className="text-sm font-medium mb-1">No values available</h5>
        <p className="text-xs text-gray-500 mb-3">
          No {typeName?.toLowerCase()} values have been configured yet.
        </p>
        <p className="text-xs font-bold mb-3">Add from below ⬇</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="leading-none mb-1">
            Choose {typeName?.toLowerCase() || "value"}
          </h5>
          <h6 className="text-primary/50 text-xs leading-none mb-2.5">
            Select multiple options by clicking them!
          </h6>
        </div>

        <Button onClick={handleDone} size="sm">
          Done
        </Button>
      </div>

      <ToggleGroup
        value={localSelectedValues.map((item) => item.value)} // Extract strings for UI
        onValueChange={(selectedStrings) => {
          const selectedObjects = selectedStrings
            .map((valueString) =>
              values?.data?.find((v) => v.value === valueString)
            )
            .filter(Boolean);
          setLocalSelectedValues(selectedObjects);
        }}
        type="multiple"
        className="gap-2 flex flex-wrap"
      >
        {values?.data?.map((value) => (
          <ToggleGroupItem
            key={value.id}
            value={value.value}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary flex-none"
          >
            {value.value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {localSelectedValues.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocalSelectedValues([])}
          className="self-start mt-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

export default VariantValueToggleGroup;
