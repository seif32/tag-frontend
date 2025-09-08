import { Button } from "@/components/ui/button";
import FlyingToCart from "@/features/cart/components/FlyingToCart";
import { useCartStore } from "@/store/cartStore";
import { consoleObject } from "@/utils/consoleObject";
import { Minus, Plus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

function ActionButtons({ selectedVariant, product }) {
  const [quantity, setQuantity] = useState(1);
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [notifyWhenAvailable, setNotifyWhenAvailable] = useState(false);

  const [flyItem, setFlyItem] = useState(null);

  const maxQuantity = selectedVariant?.quantity || 0;
  const inStock = selectedVariant?.quantity > 0;
  const variantPrice = selectedVariant?.price || 0;

  const addItem = useCartStore((state) => state.addItem);

  const handleDecrease = () => {
    if (showMaxWarning) setShowMaxWarning(false);
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (quantity >= maxQuantity) {
      setShowMaxWarning(true);
      return;
    }
    if (showMaxWarning) setShowMaxWarning(false);
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  function handleAddToCart() {
    const currentQuantity =
      useCartStore.getState().cartItems.find((i) => i.id === selectedVariant.id)
        ?.quantity || 0;

    if (currentQuantity + quantity > maxQuantity) {
      setShowMaxWarning(true);
      return;
    }

    const startEl = document.querySelector("#add-to-cart-btn");
    const endEl = document.querySelector("#cart-icon");

    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();

    setFlyItem({
      text: product.name,
      start: { x: startRect.left, y: startRect.top },
      end: { x: endRect.left, y: endRect.top },
    });

    if (!selectedVariant || !inStock) return;

    const item = {
      id: selectedVariant.id,
      product_id: selectedVariant.product_id,
      price: selectedVariant.price,
      currency: selectedVariant.currency,
      types: selectedVariant.types,
      stock: selectedVariant.quantity,

      name: product.name,
      description: product.description,
      short_description: product.short_description,
      category: product.category_name,
      subcategory: product.sub_category_name,
      brand: product.brand,
    };
    consoleObject(item);
    addItem(item, quantity);
  }

  const handleBuyNow = () => {
    if (!selectedVariant || !inStock) return;
    console.log("Buy now:", {
      variantId: selectedVariant.id,
      quantity,
      totalPrice: (parseFloat(variantPrice) * quantity).toFixed(2),
    });
  };

  const handleNotifyMe = () => {
    setNotifyWhenAvailable(!notifyWhenAvailable);
    // TODO: Add logic to subscribe to back-in-stock notifications
    console.log("Notify when available:", selectedVariant.id);
  };

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  useEffect(() => {
    if (showMaxWarning) {
      const timer = setTimeout(() => setShowMaxWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMaxWarning]);

  // 🚨 Out of Stock State
  if (!inStock) {
    return (
      <div className="flex flex-col gap-4">
        {/* 🔴 Out of Stock Banner */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-red-800">
                Currently Out of Stock
              </p>
              <p className="text-xs text-red-600">
                This variant is temporarily unavailable
              </p>
            </div>
          </div>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>

        {/* 🎯 Alternative Actions */}
        {/* <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleNotifyMe}
            variant="outline"
            className={`flex-1 ${
              notifyWhenAvailable
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-blue-500 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            {notifyWhenAvailable
              ? "Notification Set!"
              : "Notify When Available"}
          </Button>

          <Button
            variant="outline"
            className="flex-1 text-gray-600 hover:bg-gray-50"
          >
            <Heart className="w-4 h-4 mr-2" />
            Add to Wishlist
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex-1 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Again
          </Button>
        </div> */}

        <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-2 text-sm font-medium text-blue-800">
            What you can do:
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• Check other options above</li>
            <li>• Contact us for estimated restock date</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-2 bg-transparent border border-black group hover:bg-primary disabled:opacity-50"
          >
            <Minus className="text-black group-hover:text-white" />
          </Button>

          <span className="min-w-[2rem] text-center font-medium">
            {quantity}
          </span>

          <Button
            onClick={handleIncrease}
            disabled={!inStock}
            className={`
              p-2 bg-transparent border border-black group hover:bg-primary disabled:opacity-50
              ${quantity >= maxQuantity ? "border-orange-400 bg-orange-50" : ""}
            `}
          >
            <Plus className="text-black group-hover:text-white" />
          </Button>
        </div>
        <>
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant}
            className="w-40 text-accent"
            variant="outline"
            id="add-to-cart-btn" // Add this!
          >
            Add to Cart
          </Button>
          {flyItem && (
            <FlyingToCart
              text={flyItem.text}
              start={flyItem.start}
              end={flyItem.end}
              onComplete={() => setFlyItem(null)}
            />
          )}
        </>
        <Button
          onClick={handleBuyNow}
          disabled={!inStock || !selectedVariant}
          className="w-40"
        >
          Buy Now
        </Button>

        {maxQuantity > 0 && maxQuantity <= 5 && inStock && (
          <span className="ml-2 text-xs font-medium text-orange-600">
            Only {maxQuantity} left!
          </span>
        )}
      </div>

      {showMaxWarning && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="flex-shrink-0 w-4 h-4" />
          <span className="text-sm font-medium">
            Maximum available quantity reached ({maxQuantity} items)
          </span>
        </div>
      )}
    </div>
  );
}

export default ActionButtons;
