import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function VariantsSection({
  variantTypes = [],
  selections = {},
  onVariantChange,
  getAvailableValues,
  isValueAvailable,
}) {
  return (
    <div className="space-y-6">
      {variantTypes.map((typeName) => {
        const availableValues = getAvailableValues(typeName);
        const selectedValue = selections[typeName];

        if (availableValues.length === 0) return null;

        return (
          <div key={typeName} className="space-y-2">
            {/* 🏷️ Type label with selected value */}
            <div className="flex gap-2">
              <p className="text-sm font-medium">{typeName} :</p>
              <p className="text-sm">{selectedValue || "Not selected"}</p>
            </div>

            {/* 🎯 Toggle group for selections */}
            <ToggleGroup
              type="single"
              value={selectedValue}
              onValueChange={(value) =>
                value && onVariantChange(typeName, value)
              }
              className="flex gap-2"
            >
              {availableValues.map((value) => {
                const isAvailable = isValueAvailable(typeName, value);

                return (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    disabled={!isAvailable}
                    className={`
                      data-[state=on]:bg-black/20
                      data-[state=on]:text-black
                      data-[state=on]:border-black
                      ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {value}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        );
      })}
    </div>
  );
}

export default VariantsSection;
