import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";
import { Package } from "lucide-react";

export default function OrderContainer({ items = [], bundles = [], style }) {
  const totalItems = items.length + (bundles?.length || 0);

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
  isBundle = false,
  totalVat,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 rounded-md w-15 h-15 flex-shrink-0">
        <img src="" alt="" />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        {/* Top row: Name + Unit price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold">{name || "Product X"}</p>
            {isBundle && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Bundle
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
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
  return (
    <div className="flex items-start gap-4">
      <div className="bg-blue-100 rounded-md w-15 h-15 flex items-center justify-center flex-shrink-0">
        <Package className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex flex-col flex-1 gap-1.5">
        {/* Top row: Name + Badge + Unit price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold">{bundle.product?.name}</p>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Volume Discount
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">{bundle.times_applied}× </span>
            {formatCurrency(bundle.bundle_subtotal)}
          </p>
        </div>

        {/* Variant details */}
        <div className="flex gap-1 flex-wrap">
          {bundle?.product?.variants[0]?.types?.map((variant, index) => (
            <div
              key={variant.type_id}
              className="flex gap-1 text-xs text-muted-foreground"
            >
              <span>{variant.type_name}:</span>
              <span className="font-bold">{variant.value.name}</span>
              {bundle?.product?.variants[0]?.types?.length - 1 > index && (
                <span>•</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom row: Bundle calculation + Total with VAT */}
        <div className="flex items-baseline justify-between">
          <div className="text-xs text-gray-600">
            {bundle.required_quantity} items × {bundle.times_applied} bundle
            {bundle.times_applied > 1 ? "s" : ""} ={" "}
            {bundle.required_quantity * bundle.times_applied} total items
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
