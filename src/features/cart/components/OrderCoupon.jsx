import { useAuthStore } from "@/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePromoCode from "@/hooks/usePromoCode";
import { useCartStore } from "@/store/cartStore";
import ErrorMessage from "@/ui/ErrorMessage";
import { formatCurrency } from "@/utils/formatCurrency";
import { CheckCircle, XCircle, Percent } from "lucide-react";
import { useEffect, useState } from "react";

function OrderCoupon() {
  const [couponInput, setCouponInput] = useState("");
  const [validationState, setValidationState] = useState(null);

  const user = useAuthStore((state) => state.user);

  const subtotal = useCartStore((state) => state.subtotal);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const getDiscountDetails = useCartStore((state) => state.getDiscountDetails);

  const { promoCode, isLoadingPromoCode, isErrorPromoCode, errorPromoCode } =
    usePromoCode.useByCode(
      validationState === "validating" ? couponInput : "",
      { user_id: user?.id, subtotal },
      { enabled: validationState === "validating" && couponInput.length > 0 }
    );

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setValidationState("validating");
  }

  function handleRemoveCoupon() {
    removeCoupon(); // 🔥 Use cart store method
    setCouponInput("");
    setValidationState(null);
  }

  useEffect(() => {
    if (validationState !== "validating") return;
    if (isLoadingPromoCode) return;

    if (isErrorPromoCode || promoCode?.message) {
      setValidationState("error");
    } else if (promoCode?.promo && promoCode?.applicable) {
      applyCoupon(promoCode.promo); // 🔥 Use cart store method
      setValidationState("success");
    } else if (promoCode?.promo && !promoCode?.applicable) {
      setValidationState("error");
    }
  }, [
    promoCode,
    isLoadingPromoCode,
    isErrorPromoCode,
    validationState,
    applyCoupon,
  ]);

  const discountDetails = getDiscountDetails();

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border rounded-xl">
      <div className="flex items-center gap-2">
        <Percent className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold">Coupon Code</h2>
      </div>

      <div className="border-t border-gray-100"></div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase());
              if (validationState) setValidationState(null);
            }}
            placeholder="Enter coupon code..."
            disabled={appliedCoupon !== null}
            className={`flex-1 ${appliedCoupon ? "bg-gray-50" : ""}`}
          />

          {appliedCoupon ? (
            <Button
              variant="outline"
              onClick={handleRemoveCoupon}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Remove
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || validationState === "validating"}
              className="min-w-[100px]"
            >
              {validationState === "validating" ? "Checking..." : "Apply"}
            </Button>
          )}
        </div>

        {/* Error State */}
        {validationState === "error" && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">
              {promoCode?.message ||
                errorPromoCode?.message ||
                promoCode?.reason ||
                "Invalid coupon code"}
            </span>
          </div>
        )}

        {/* Success State */}
        {appliedCoupon && discountDetails && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-800">
                Coupon Applied: {discountDetails.code}
              </span>
            </div>

            <div className="text-sm text-green-700 space-y-1">
              <p>{discountDetails.description}</p>

              <div className="flex justify-between items-center pt-1">
                <span>Discount:</span>
                <span className="font-semibold">
                  {discountDetails.type === "percentage"
                    ? `${discountDetails.value}% (${formatCurrency(
                        discountDetails.amount
                      )})`
                    : formatCurrency(discountDetails.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCoupon;
