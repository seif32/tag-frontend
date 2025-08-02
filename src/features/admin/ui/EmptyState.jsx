import NoVariantsSVG from "@/assets/svg/noVariants.svg";
import CornerDownLeft from "@/assets/svg/corner-down-left.svg";

function EmptyState() {
  return (
    <div className="flex flex-col items-center my-auto space-y-8">
      <img
        src={NoVariantsSVG}
        alt="No variants"
        className="w-[225px] mx-auto"
      />
      <div className="space-y-2 text-center w-90">
        <h1 className="text-3xl font-degular">No variants created yet</h1>
        <p className="leading-5 text-black/50">
          Add a variant type (like Color, Size, etc.) to start configuring your
          product.
        </p>
        <img
          src={CornerDownLeft}
          alt="corner down left"
          className="w-[75px] mx-auto"
        />
      </div>
    </div>
  );
}

export default EmptyState;
