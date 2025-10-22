import { Button } from "@/components/ui/button";
import FlyingToCart from "@/features/cart/components/FlyingToCart";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, AlertCircle, Package } from "lucide-react";
import { useState, useEffect } from "react";

function ActionButtons({ selectedVariant, selectedBundle, product }) {
  const [quantity, setQuantity] = useState(1);
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [flyItem, setFlyItem] = useState(null);

  // Bundle-aware logic
  const isBundleMode = selectedBundle && selectedBundle.quantity > 1;
  const bundleQuantity = selectedBundle?.quantity || 1;
  const bundlePrice = selectedBundle
    ? parseFloat(selectedBundle.subtotal)
    : selectedVariant?.price;
  const bundleVat = selectedBundle
    ? parseFloat(selectedBundle.vat)
    : selectedVariant?.vat;

  const maxQuantity = selectedVariant?.quantity || 0;
  const maxBundles = isBundleMode
    ? Math.floor(maxQuantity / bundleQuantity)
    : maxQuantity;
  const inStock = selectedVariant?.quantity > 0;

  const addItem = useCartStore((state) => state.addItem);

  const handleDecrease = () => {
    if (showMaxWarning) setShowMaxWarning(false);
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (quantity >= maxBundles) {
      setShowMaxWarning(true);
      return;
    }
    if (showMaxWarning) setShowMaxWarning(false);
    setQuantity((prev) => Math.min(maxBundles, prev + 1));
  };

  function handleAddToCart() {
    const cartItemId = isBundleMode
      ? `bundle_${selectedBundle.id}`
      : selectedVariant.id;

    const currentQuantity =
      useCartStore.getState().cartItems.find((i) => i.id === cartItemId)
        ?.quantity || 0;

    if (currentQuantity + quantity > maxBundles) {
      setShowMaxWarning(true);
      return;
    }

    const startEl = document?.querySelector("#add-to-cart-btn");
    const endEl = document?.querySelector("#cart-icon");

    if (!startEl || !endEl) {
      console.warn("Missing start or end element for flying animation");
      // still add to cart without animation
      addItem(item, quantity);
      return;
    }

    const startRect = startEl?.getBoundingClientRect();
    const endRect = endEl?.getBoundingClientRect();

    setFlyItem({
      text: isBundleMode
        ? `${product.name} (Bundle of ${bundleQuantity})`
        : product.name,
      start: { x: startRect.left, y: startRect.top },
      end: { x: endRect.left, y: endRect.top },
    });

    if (!selectedVariant || !inStock) return;
    // In ActionButtons component
    const item = {
      // For cart identification (frontend only)
      id: isBundleMode
        ? `bundle_${selectedBundle.id}_${selectedVariant.id}`
        : selectedVariant.id,

      // Always store actual variant info
      variant_id: selectedVariant.id,
      product_id: selectedVariant.product_id,
      bundle_id: selectedBundle?.id || null,

      // Pricing (keep existing bundle logic)
      price_before_vat: bundlePrice,
      currency: selectedVariant.currency,
      types: selectedVariant.types,
      stock: isBundleMode ? maxBundles : maxQuantity,
      vat: bundleVat,
      price_after_vat: bundlePrice + bundlePrice * (bundleVat / 100),

      // Bundle metadata
      is_bundle: isBundleMode,
      bundle_quantity: bundleQuantity,
      unit_price: isBundleMode ? bundlePrice / bundleQuantity : bundlePrice,

      // Product info
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      category: product.category_name,
      subcategory: product.sub_category_name,
      brand: product.brand,
    };

    addItem(item, quantity);
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") return;

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setQuantity(Math.min(numValue, maxBundles));
    }
  };

  const handleQuantityBlur = (e) => {
    const value = e.target.value;
    if (!value || isNaN(parseInt(value)) || parseInt(value) < 1) {
      setQuantity(1);
    }
    if (showMaxWarning) setShowMaxWarning(false);
  };

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant, selectedBundle]);

  useEffect(() => {
    if (showMaxWarning) {
      const timer = setTimeout(() => setShowMaxWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMaxWarning]);

  // Out of Stock State
  if (!inStock) {
    return (
      <div className="flex flex-col gap-4">
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
      {/* Bundle Info Banner */}
      {isBundleMode && (
        <div className="flex items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Bundle Mode: Each quantity = {bundleQuantity} items
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-2 bg-transparent border border-black group hover:bg-primary disabled:opacity-50"
          >
            <Minus className="text-black group-hover:text-white" />
          </Button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            min={1}
            max={maxBundles}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            onClick={handleIncrease}
            disabled={!inStock}
            className={`
              p-2 bg-transparent border border-black group hover:bg-primary disabled:opacity-50
              ${quantity >= maxBundles ? "border-orange-400 bg-orange-50" : ""}
            `}
          >
            <Plus className="text-black group-hover:text-white" />
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant}
          className="w-40 text-accent sm:h-full h-15"
          variant="outline"
          id="add-to-cart-btn"
        >
          {isBundleMode
            ? `Add ${quantity} Bundle${quantity > 1 ? "s" : ""}`
            : "Add to Cart"}
        </Button>

        {flyItem && (
          <FlyingToCart
            text={flyItem.text}
            start={flyItem.start}
            end={flyItem.end}
            onComplete={() => setFlyItem(null)}
          />
        )}

        {/* Stock Warning */}
        {maxBundles > 0 && maxBundles <= 5 && inStock && (
          <span className="ml-2 text-xs font-medium text-orange-600">
            {isBundleMode
              ? `Only ${maxBundles} bundle${
                  maxBundles > 1 ? "s" : ""
                } available!`
              : `Only ${maxBundles} left!`}
          </span>
        )}
      </div>

      {/* Bundle Details */}
      {isBundleMode && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          Adding {quantity} × {bundleQuantity} = {quantity * bundleQuantity}{" "}
          total items
        </div>
      )}

      {showMaxWarning && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="flex-shrink-0 w-4 h-4" />
          <span className="text-sm font-medium">
            {isBundleMode
              ? `Maximum available bundles reached (${maxBundles} bundles)`
              : `Maximum available quantity reached (${maxBundles} items)`}
          </span>
        </div>
      )}
    </div>
  );
}

export default ActionButtons;
