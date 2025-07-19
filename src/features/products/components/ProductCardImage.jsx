import { CardHeader } from "@/components/ui/card";
import SoldOutBadge from "@/ui/SoldOutBadge";

function ProductCardImage({ product, className = "" }) {
  return (
    <CardHeader className="p-0">
      <div
        className={`relative w-full aspect-square bg-gray-200 rounded-t-xl overflow-hidden group ${className}`}
      >
        {/* Sold Out Badge */}
        <SoldOutBadge />

        {/* Product Image */}
        <img
          src={product?.image || "/src/assets/test.jpg"}
          alt={product?.name || "Product"}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full bg-black/40 group-hover:translate-y-0">
          <span className="px-8 py-4 font-semibold tracking-wide text-black uppercase transition-colors cursor-pointer rounded-2xl bg-amber-200 hover:bg-amber-300">
            view details
          </span>
        </div>
      </div>
    </CardHeader>
  );
}

export default ProductCardImage;
