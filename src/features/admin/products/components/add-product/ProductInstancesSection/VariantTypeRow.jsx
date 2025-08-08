import VariantValueToggleGroup from "./VariantValueToggleGroup";

function VariantTypeRow({ variant }) {
  return (
    <div className="mb-4">
      <p className="font-medium capitalize mb-2">{variant.name}</p>
      <VariantValueToggleGroup variant={variant} />
    </div>
  );
}

export default VariantTypeRow;
