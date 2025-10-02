import { toast } from "sonner";
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  appliedCoupon: null,
  validationState: null,
  totalItems: 0,
  uniqueItems: 0,

  subtotal: 0,
  totalVat: 0,
  shippingAmount: 0,
  discountAmount: 0,
  finalTotal: 0,

  shippingAddress: null,
  shippingMethod: "standard",

  selectedCity: null,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => product.id === item.id
      );

      let updatedItems;
      if (existingItem) {
        // Bundle-aware stock checking
        const maxAllowed = product.is_bundle
          ? Math.floor(product.stock)
          : product.stock;

        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          maxAllowed
        );

        if (existingItem.quantity + quantity > maxAllowed) {
          const itemType = product.is_bundle ? "bundle" : "item";
          toast.error(
            `You can only add up to ${maxAllowed} of this ${itemType}.`
          );
        }

        updatedItems = state.cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        updatedItems = [...state.cartItems, { ...product, quantity }];
      }

      return recalc(
        updatedItems,
        state.shippingAddress,
        state.appliedCoupon,
        state.shippingMethod
      );
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.cartItems.filter(
        (item) => item.id !== productId
      );
      return recalc(
        updatedItems,
        state.shippingAddress,
        state.appliedCoupon,
        state.shippingMethod
      );
    });
  },

  increment: (productId) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === productId);
      if (!item) return state;

      if (item.quantity >= item.stock) {
        const itemType = item.is_bundle ? "bundle" : "item";
        toast.error(
          `You can only add up to ${item.stock} of this ${itemType}.`
        );
        return state;
      }

      const items = state.cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      return recalc(
        items,
        state.shippingAddress,
        state.appliedCoupon,
        state.shippingMethod
      );
    }),

  decrement: (productId) =>
    set((state) => {
      const items = state.cartItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
            : item
        )
        .filter((item) => item.quantity > 0);
      return recalc(
        items,
        state.shippingAddress,
        state.appliedCoupon,
        state.shippingMethod
      );
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const exists = state.cartItems.some((i) => i.id === productId);
      if (!exists) return state;

      const items =
        quantity > 0
          ? state.cartItems.map((i) =>
              i.id === productId ? { ...i, quantity } : i
            )
          : state.cartItems.filter((i) => i.id !== productId);

      return recalc(
        items,
        state.shippingAddress,
        state.appliedCoupon,
        state.shippingMethod
      );
    }),

  applyCoupon: (validatedCoupon) => {
    set((state) => {
      const newState = recalc(
        state.cartItems,
        state.shippingAddress,
        validatedCoupon,
        state.shippingMethod
      );

      toast.success(`Coupon "${validatedCoupon.code}" applied successfully!`);

      return {
        ...newState,
        validationState: "success",
      };
    });
  },

  removeCoupon: () => {
    set((state) => {
      const newState = recalc(
        state.cartItems,
        state.shippingAddress,
        null,
        state.shippingMethod
      );

      toast.info("Coupon removed from cart");

      return {
        ...newState,
        validationState: null,
      };
    });
  },

  setCouponValidationState: (state) => set({ validationState: state }),

  clearCart: () =>
    set({
      cartItems: [],
      appliedCoupon: null,
      validationState: null,
      totalItems: 0,
      uniqueItems: 0,
      subtotal: 0,
      taxAmount: 0,
      taxPercent: 0,
      shippingAmount: 0,
      discountAmount: 0,
      finalTotal: 0,
      shippingAddress: null,
      shippingMethod: "standard",
      selectedCity: null,
    }),

  getDiscountDetails: () => {
    const state = get();
    if (!state.appliedCoupon) return null;

    return {
      code: state.appliedCoupon.code,
      description: state.appliedCoupon.description,
      type: state.appliedCoupon.discount_type,
      value: state.appliedCoupon.discount_value,
      amount: state.discountAmount,
      maxDiscount: state.appliedCoupon.max_discount,
    };
  },

  setSelectedCity: (cityObject) => {
    set((state) => {
      const newState = recalc(
        state.cartItems,
        cityObject,
        state.appliedCoupon,
        state.shippingMethod
      );
      return {
        ...newState,
        selectedCity: cityObject,
      };
    });
  },
}));

function recalc(
  cartItems,
  shippingAddress = null,
  appliedCoupon = null,
  shippingMethod = "standard"
) {
  // Bundle-aware total items calculation
  const totalItems = cartItems.reduce((sum, item) => {
    if (item.is_bundle) {
      // For bundles: quantity * bundle_quantity = actual items
      return sum + item.quantity * item.bundle_quantity;
    }
    return sum + item.quantity;
  }, 0);

  const uniqueItems = cartItems.length;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price_before_vat * item.quantity,
    0
  );

  const totalVat = cartItems.reduce(
    (sum, item) =>
      sum + item.price_before_vat * (item.vat / 100) * item.quantity,
    0
  );

  const shippingAmount = calculateShipping(
    shippingAddress,
    subtotal,
    shippingAddress
  );

  const discountAmount = calculateDiscount(appliedCoupon, subtotal);

  const finalTotal = Math.max(
    0,
    subtotal + totalVat + shippingAmount - discountAmount
  );

  return {
    cartItems,
    appliedCoupon,
    totalItems,
    uniqueItems,
    subtotal,
    totalVat,
    shippingAmount,
    discountAmount,
    finalTotal,
    shippingAddress,
    shippingMethod,
  };
}

function calculateShipping(address, subtotal, selectedCity) {
  if (!address) return 0;

  if (selectedCity) {
    const freeShippingThreshold =
      parseFloat(selectedCity.free_shipping_threshold) || 0;
    if (
      freeShippingThreshold > 0 &&
      subtotal >= freeShippingThreshold &&
      !selectedCity.always_charge_shipping
    ) {
      return 0;
    }

    if (selectedCity.shipping_fees) {
      const baseRate = parseFloat(selectedCity.shipping_fees);
      return baseRate;
    }
  }

  // Fallback to default rates
  // const shippingRates = { standard: 45, express: 100 };
  // return shippingRates[method] || shippingRates["standard"];
}

function calculateDiscount(appliedCoupon, subtotal) {
  if (!appliedCoupon) return 0;

  const minOrderValue = parseFloat(appliedCoupon.min_order_value) || 0;
  if (subtotal < minOrderValue) return 0;

  let discount = 0;

  if (appliedCoupon.discount_type === "percentage") {
    discount = (subtotal * parseFloat(appliedCoupon.discount_value)) / 100;

    const maxDiscount = parseFloat(appliedCoupon.max_discount) || Infinity;
    discount = Math.min(discount, maxDiscount);
  } else if (appliedCoupon.discount_type === "fixed") {
    discount = Math.min(parseFloat(appliedCoupon.discount_value), subtotal);
  }

  return Math.max(0, discount);
}
