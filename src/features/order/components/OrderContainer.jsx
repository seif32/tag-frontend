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

      {/* Regular Items */}
      {items?.map((item, index) => (
        <div key={`item-${item?.id}`}>
          <OrderItem
            name={item?.product?.name}
            quantity={item?.quantity}
            totalPrice={item?.total_price}
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
          <BundleItem bundle={bundle} timesApplied={bundle.times_applied} />
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
  totalPrice,
  unitPrice,
  variants = [],
  isBundle = false,
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gray-100 rounded-md w-15 h-15">
        <img src="" alt="" />
      </div>
      <div className="flex flex-col flex-1">
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
            <span className="text-xs">{quantity}x </span>
            {formatCurrency(unitPrice)}
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex gap-1">
            {variants.map((variant, index) => (
              <div key={variant.type_id} className="flex gap-1 text-xs">
                <span>{variant.type_name}: </span>
                <span>{variant.value.name}</span>
                {variants.length - 1 > index && <span>-</span>}
              </div>
            ))}
          </div>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}

// New component for bundle display
function BundleItem({ bundle, timesApplied }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-blue-100 rounded-md w-15 h-15 flex items-center justify-center">
        <Package className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold">
              Bundle: {bundle.quantity} × {bundle.variant?.product?.name}
            </p>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Volume Discount
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">{timesApplied}x </span>
            {formatCurrency(bundle.subtotal)}
          </p>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-xs text-gray-600">
            {bundle.quantity} items per bundle × {timesApplied} bundles ={" "}
            {bundle.quantity * timesApplied} total items
          </div>
          <p>{formatCurrency(bundle.total * timesApplied)}</p>
        </div>
      </div>
    </div>
  );
}
