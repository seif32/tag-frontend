import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";
import { Package } from "lucide-react";

export default function OrderContainer({ items = [], bundles = [], style }) {
  const totalItems = items.length + (bundles?.length || 0);

  console.log(items);
  console.log(bundles);

  return (
    <div className={`w-full ${style}`}>
      <div className="mb-6">
        <h2 className="text-xl">Products</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <PiPackageThin size={16} />
          <p>{totalItems} items</p>
        </div>
      </div>

      {items?.map((item, index) => (
        <div key={`item-${item?.id}`}>
          <OrderItem
            name={item?.product?.name}
            quantity={item?.quantity}
            subtotal={item?.total_price - item?.total_vat}
            totalVat={item?.total_vat}
            unitPrice={item?.unit_price}
            variants={
              item?.product?.variants.find((v) => v.id === item.variant_id)
                ?.types || []
            }
            imageUrl={
              item?.product?.variants
                .find((v) => v.id === item.variant_id)
                ?.images?.find((img) => img.is_primary === 1)?.image_url ||
              item?.product?.variants.find((v) => v.id === item.variant_id)
                ?.images?.[0]?.image_url ||
              null
            }
            isBundle={false}
          />
          {(index < items.length - 1 || bundles?.length > 0) && (
            <div className="my-4 border border-gray-200 border-dashed"></div>
          )}
        </div>
      ))}

      {/* Bundle Items */}
      {bundles?.map((bundle, index) => (
        <div key={`bundle-${bundle?.id}`}>
          <BundleItem bundle={bundle} />
          {index < bundles.length - 1 && (
            <div className="my-4 border border-gray-200 border-dashed"></div>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderItem({
  name,
  quantity,
  subtotal,
  unitPrice,
  variants = [],
  imageUrl = null,
  isBundle = false,
  totalVat,
}) {
  return (
    <div className="flex items-center gap-4">
      {/* 🆕 Product Image */}
      <div className="bg-gray-100 rounded-md w-20 h-20 flex-shrink-0 overflow-hidden border border-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PiPackageThin className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 gap-1">
        {/* Top row: Name + Unit price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold line-clamp-2">{name || "Product X"}</p>
            {isBundle && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Bundle
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            <span className="text-xs">{quantity}× </span>
            {formatCurrency(unitPrice)}
          </p>
        </div>

        {/* Bottom row: Variants + Subtotal + VAT stacked */}
        <div className="flex items-baseline justify-between">
          <div className="flex gap-1 flex-wrap">
            {variants.map((variant, index) => (
              <div
                key={variant.type_id}
                className="flex gap-1 text-xs text-muted-foreground"
              >
                <span>{variant.type_name}:</span>
                <span className="font-bold">{variant.value.name}</span>
                {variants.length - 1 > index && <span>•</span>}
              </div>
            ))}
          </div>

          <div className="text-right">
            <p className="font-semibold">{formatCurrency(subtotal)}</p>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(totalVat)} VAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleItem({ bundle }) {
  // 🆕 Extract image from bundle's variant
  const imageUrl =
    bundle?.product?.variants
      ?.find((v) => v.id === bundle.variant_id)
      ?.images?.find((img) => img.is_primary === 1)?.image_url ||
    bundle?.product?.variants?.find((v) => v.id === bundle.variant_id)
      ?.images?.[0]?.image_url ||
    null;

  return (
    <div className="flex items-start gap-4">
      {/* 🆕 Bundle Image with overlay */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-md w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-blue-300">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={bundle.product?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg";
              }}
            />
            {/* Blue tint overlay */}
            <div className="absolute inset-0 bg-blue-500/20" />
          </>
        ) : (
          <Package className="w-10 h-10 text-blue-400" />
        )}

        {/* Bundle Badge */}
        <div className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg uppercase">
          Bundle
        </div>

        {/* Items per bundle badge */}
        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">
          {bundle.required_quantity}× each
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-1.5">
        {/* Top row: Name + Badge + Unit price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold line-clamp-2">{bundle.product?.name}</p>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
              Volume Discount
            </span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            <span className="text-xs">{bundle.times_applied}× </span>
            {formatCurrency(bundle.bundle_subtotal)}
          </p>
        </div>

        {/* Variant details */}
        <div className="flex gap-1 flex-wrap">
          {bundle?.product?.variants
            ?.find((v) => v.id === bundle.variant_id)
            ?.types?.map((variant, index, array) => (
              <div
                key={variant.type_id}
                className="flex gap-1 text-xs text-muted-foreground"
              >
                <span>{variant.type_name}:</span>
                <span className="font-bold">{variant.value.name}</span>
                {array.length - 1 > index && <span>•</span>}
              </div>
            ))}
        </div>

        {/* Bottom row: Bundle calculation + Total with VAT */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xs text-gray-600">
            <span className="font-medium text-blue-600">
              {bundle.required_quantity} items
            </span>{" "}
            × {bundle.times_applied} bundle
            {bundle.times_applied > 1 ? "s" : ""} ={" "}
            <span className="font-semibold text-green-600">
              {bundle.required_quantity * bundle.times_applied} total items
            </span>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {formatCurrency(bundle.bundle_subtotal * bundle.times_applied)}
            </p>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(bundle.total_vat)} VAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
