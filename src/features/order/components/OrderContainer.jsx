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

      {items?.map((item, index) => (
        <>
          <OrderItem
            key={item?.id}
            name={item?.product?.name}
            quantity={item?.quantity}
            totalPrice={item?.total_price}
            unitPrice={item?.unit_price}
            variants={
              item?.product?.variants.find((v) => v.id === item.variant_id)
                ?.types || []
            }
          />
          {items.length - 1 > index && (
            <div className="my-4 border border-gray-200 border-dashed"></div>
          )}{" "}
        </>
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
              {variants.map((variant, index) => {
                return (
                  <div key={variant.type_id} className="flex gap-1 text-xs">
                    <span>{variant.type_name}: </span>
                    <span>{variant.value.name}</span>
                    {variants.length - 1 > index && <span>-</span>}
                  </div>
                );
              })}
            </div>
            <p>{formatCurrency(totalPrice)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
