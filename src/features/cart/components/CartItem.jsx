import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";

function CartItem({ id, name, variants = [], quantity, price }) {
  const [qty, setQty] = useState(quantity);

  return (
    <div className="flex justify-between p-3 border rounded-md">
      <div className="flex gap-2">
        <div className="w-16 h-16 bg-gray-100 rounded-md ">
          <img />
        </div>
        <div>
          <h3 className="font-semibold max-w-[24ch]">{name}</h3>
          <div className="flex items-center gap-1 gap-y-0 max-w-[24ch] flex-wrap ">
            {variants.map((variant, index) => (
              <span key={index} className="text-sm text-gray-400">
                {variant} {index < variants.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
          <span className="text-xs ">
            unit price:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size={"sm"}
          className={"cursor-pointer bg-primary"}
          onClick={() => setQty((q) => (q > 0 ? q - 1 : 0))}
        >
          -
        </Button>
        <span className="text-sm font-semibold">{qty}</span>
        <Button
          size={"sm"}
          className={"cursor-pointer bg-primary"}
          onClick={() => setQty((q) => q + 1)}
        >
          +
        </Button>
      </div>

      <p className="self-center font-semibold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(qty * price)}
      </p>
      <BsTrash3
        className="self-center text-gray-500 cursor-pointer hover:text-red-500"
        onClick={() => console.log("Delete", id)}
      />
    </div>
  );
}

export default CartItem;
