import { useAuthStore } from "@/auth/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePromoCode from "@/hooks/usePromoCode";
import { useCartStore } from "@/store/cartStore";
import ErrorMessage from "@/ui/ErrorMessage";
import LoadingState from "@/ui/LoadingState";
import { useState } from "react";

function OrderCoupon() {
  const [couponInput, setCouponInput] = useState(""); // typing state
  const [submittedCoupon, setSubmittedCoupon] = useState(""); // submitted state
  const user = useAuthStore((state) => state.user);
  const subtotal = useCartStore((state) => state.subtotal);

  const { exists, isLoadingExists, isErrorExists } =
    usePromoCode.useCheckExists(submittedCoupon);
  const { promoCode, isLoadingPromoCode, isErrorPromoCode } =
    usePromoCode.useByCode(submittedCoupon, { user_id: user?.id, subtotal });

  const isLoading = isLoadingPromoCode || isLoadingExists;
  const isError = isErrorExists || isErrorPromoCode;

  function handleCoupon() {
    setSubmittedCoupon(couponInput); // trigger queries
    console.log("OrderCoupon", promoCode);
  }

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorMessage message="Failed to load data" dismissible />;

  return (
    <div className="flex flex-col gap-4 p-3 py-6 bg-white border rounded-xl">
      <h2 className="font-semibold">Coupon Code</h2>
      <div className="border border-gray-100"></div>

      <Input
        value={couponInput}
        onChange={(e) => setCouponInput(e.target.value)}
        placeholder="Enter your coupon..."
      />

      <Button variant="outline" onClick={handleCoupon}>
        Apply Your Coupon
      </Button>

      {submittedCoupon && (
        <div className="text-sm text-muted-foreground">
          ✅ Coupon checked: {submittedCoupon}
        </div>
      )}
    </div>
  );
}

export default OrderCoupon;
