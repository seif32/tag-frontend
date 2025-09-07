import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { BsTrash3 } from "react-icons/bs";

function CartItem({ id, name, variants = [], quantity, price }) {
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  return (
    <div className="flex flex-col justify-between gap-5 p-3 border rounded-md md:flex-row">
      <div className="flex gap-2 ">
        <div className="w-16 h-16 bg-gray-100 rounded-md ">
          <img />
        </div>
        <div>
          <h3 className="font-semibold max-w-[24ch]">{name} </h3>
          <div className="flex items-center gap-1 gap-y-0 max-w-[24ch] flex-wrap ">
            {variants.map((variant, index) => (
              <span key={index} className="text-sm text-gray-400">
                {variant} {index < variants.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <span className="text-xs ">
            unit price: <span>{formatCurrency(price)}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 justify-evenly ">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => decrement(id)}
          >
            -
          </Button>

          <span className="text-sm font-semibold">{quantity}</span>
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => increment(id)}
          >
            +
          </Button>
        </div>

        <p className="self-center font-semibold">
          <p>{formatCurrency(quantity * price)}</p>
        </p>
      </div>
      <BsTrash3
        className="self-end text-gray-500 cursor-pointer md:self-center hover:text-red-500"
        onClick={() => removeItem(id)}
      />
    </div>
  );
}

export default CartItem;
