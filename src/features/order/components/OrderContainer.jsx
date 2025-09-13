import { formatCurrency } from "@/utils/formatCurrency";
import { PiPackageThin } from "react-icons/pi";

export default function OrderContainer({ items = [], style }) {
  return (
    <div className={`w-full ${style}`}>
      <div className="mb-6">
        <h2 className="text-xl">Products</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <PiPackageThin size={16} />
          <p>{items?.length} items</p>
        </div>
      </div>

      {items?.map((item) => (
        <OrderItem
          key={item?.id}
          name={item?.product?.name}
          quantity={item?.quantity}
          totalPrice={item?.total_price}
          unitPrice={item?.unit_price}
          // variants={item?.types?.map((variant) => variant.value.name) || []}
        />
      ))}
    </div>
  );
}

function OrderItem({ name, quantity, totalPrice, unitPrice, variants = [] }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 rounded-md w-15 h-15">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-baseline justify-between">
            <p className="font-bold">{name || "Product X"}</p>
            <p className="text-sm text-muted-foreground">
              <span className="text-xs">{quantity}x </span>
              {formatCurrency(unitPrice)}
            </p>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex gap-1">
              {variants.map((variant, index) => (
                <span key={index} className="text-sm text-gray-400">
                  {variant} {index < variants.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
            <p>{formatCurrency(totalPrice)}</p>
          </div>
        </div>
      </div>
      <div className="my-4 border border-gray-200 border-dashed"></div>
    </>
  );
}
