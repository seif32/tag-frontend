import VariantValueToggleGroup from "./VariantValueToggleGroup";

function VariantTypeRow({ variant, currentSelection, onValueSelect }) {
  return (
    <div className="mb-4">
      <p className="font-medium capitalize mb-2">{variant.typeName}</p>
      <VariantValueToggleGroup
        variant={variant}
        currentSelection={currentSelection}
        onValueSelect={onValueSelect}
      />
    </div>
  );
}

export default VariantTypeRow;
