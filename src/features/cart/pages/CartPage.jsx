import { Package, ShoppingBag } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import EmptyState from "@/ui/EmptyState";
import OrderCoupon from "../components/OrderCoupon";
import OrderSummary from "../components/OrderSummary";

function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = useCartStore((state) => state.totalItems);
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className={`flex-1 lg:flex-[2] ${isCartEmpty ? "py-16" : ""}`}>
          <div className="bg-white border rounded-xl shadow-sm">
            {!isCartEmpty && (
              <div className="p-5 border-b bg-gray-50 rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag size={16} />
                    <span>
                      {cartItems.length} unique product
                      {cartItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package size={16} />
                    <span>
                      {totalItems} total item{totalItems !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={`${isCartEmpty ? "p-5" : "p-5 space-y-4"}`}>
              {isCartEmpty ? (
                <EmptyState
                  title="Your cart is empty"
                  subtitle="Discover amazing products and start shopping today!"
                  goTo="/products"
                  btn="Browse products"
                />
              ) : (
                cartItems.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        {!isCartEmpty && (
          <div className="flex-1 lg:max-w-md">
            <OrderControls />
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;

// ✅ FIXED: Cart Item Component
function CartItem({ item }) {
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  const isBundle = item?.is_bundle;
  const bundleQuantity = item?.bundle_quantity || 1;
  const priceBeforeVat = Number(item.price_before_vat);
  const vat = Number(item.vat || 0);

  // ✅ Calculate prices correctly
  const itemSubtotal = priceBeforeVat * item.quantity;
  const itemVat = itemSubtotal * (vat / 100);
  const itemTotal = itemSubtotal + itemVat;

  // ✅ Fixed image path
  const imageUrl = item?.image?.image_url || "/placeholder.svg";

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg transition-shadow">
      {/* Product Image & Info */}
      <div className="flex gap-3 flex-1 min-w-0">
        {/* Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Name & Bundle Badge */}
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
              {item.name}
            </h3>
            {isBundle && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                Bundle
              </span>
            )}
          </div>

          {/* Variants */}
          {item.types && item.types.length > 0 && (
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">
              {item.types.map((type, index) => (
                <span key={index}>
                  {type.value.name}
                  {index < item.types.length - 1 && " • "}
                </span>
              ))}
            </div>
          )}

          {/* ✅ FIXED: Bundle/Single Item Pricing */}
          {isBundle ? (
            <div className="text-xs text-gray-600 space-y-0.5 pt-1">
              <div className="font-medium text-gray-900">
                {bundleQuantity} items per bundle ×{" "}
                {formatCurrency(priceBeforeVat)}
              </div>
              <div>
                = {formatCurrency(priceBeforeVat)} per bundle (before VAT)
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-600 pt-1">
              {formatCurrency(priceBeforeVat)} per item (before VAT)
            </div>
          )}
        </div>
      </div>

      {/* Quantity & Price Controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => decrement(item.id)}
          >
            −
          </Button>

          <div className="text-center min-w-[60px]">
            <div className="text-sm font-semibold">{item.quantity}</div>
            {isBundle && (
              <div className="text-xs text-gray-500">
                ({item.quantity * bundleQuantity} items)
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => increment(item.id)}
            disabled={item.quantity >= item.stock}
          >
            +
          </Button>
        </div>

        {/* ✅ FIXED: Price Display */}
        <div className="text-right">
          <div className="font-bold text-gray-900">
            {formatCurrency(itemTotal)}
          </div>
          <div className="text-xs text-gray-500">
            incl. {formatCurrency(itemVat)} VAT
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="self-start sm:self-center text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
        aria-label="Remove item"
      >
        <BsTrash3 size={18} />
      </button>
    </div>
  );
}

function OrderControls() {
  return (
    <div className="space-y-4 sticky top-4">
      <OrderSummary />
      <OrderCoupon />
      <OrderActions />
    </div>
  );
}

function OrderActions() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
      <h2 className="font-semibold">Actions</h2>

      <div className="border border-gray-100"></div>

      <div className="flex gap-2">
        <Button variant={"outline"} className={"flex-1"}>
          Cancel Order
        </Button>
        <Button className={"flex-2"} onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
