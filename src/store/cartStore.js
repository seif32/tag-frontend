import { toast } from "sonner";
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  promoCode: null,
  totalItems: 0,
  totalPrice: 0,
  uniqueItems: 0,

  subtotal: 0,
  taxAmount: 0,
  taxPercent: 0,
  shippingAmount: 0,
  discountAmount: 0,
  finalTotal: 0,

  shippingAddress: null,
  shippingMethod: "standard",

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => product.id === item.id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = state.cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.cartItems, { ...product, quantity }];
      }

      return recalc(
        updatedItems,
        state.shippingAddress,
        state.promoCode,
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
        state.promoCode,
        state.shippingMethod
      );
    });
  },

  increment: (productId) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === productId);
      if (!item) return state;

      if (item.quantity >= item.stock) {
        toast.error(`You can only add up to ${item.stock} of this item.`);
        return state;
      }

      const items = state.cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      return recalc(
        items,
        state.shippingAddress,
        state.promoCode,
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
        state.promoCode,
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
        state.promoCode,
        state.shippingMethod
      );
    }),

  setShippingAddress: (address) => {
    set((state) => {
      return recalc(
        state.cartItems,
        address,
        state.promoCode,
        state.shippingMethod
      );
    });
  },

  setShippingMethod: (method) => {
    set((state) => {
      return recalc(
        state.cartItems,
        state.shippingAddress,
        state.promoCode,
        method
      );
    });
  },

  applyPromoCode: (code) => {
    set((state) => {
      return recalc(
        state.cartItems,
        state.shippingAddress,
        code,
        state.shippingMethod
      );
    });
  },

  removePromoCode: () => {
    set((state) => {
      return recalc(
        state.cartItems,
        state.shippingAddress,
        null,
        state.shippingMethod
      );
    });
  },

  clearCart: () =>
    set({
      cartItems: [],
      promoCode: null,
      totalItems: 0,
      totalPrice: 0,
      uniqueItems: 0,
      subtotal: 0,
      taxAmount: 0,
      taxPercent: 0,
      shippingAmount: 0,
      discountAmount: 0,
      finalTotal: 0,
      shippingAddress: null,
      shippingMethod: "standard",
    }),
}));

function recalc(
  cartItems,
  shippingAddress = null,
  promoCode = null,
  shippingMethod = "standard"
) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = cartItems.length;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxPercent = calculateTaxRate(shippingAddress);
  const taxAmount = (subtotal * taxPercent) / 100;

  const shippingAmount = calculateShipping(
    shippingAddress,
    cartItems,
    subtotal,
    shippingMethod
  );

  const discountAmount = calculateDiscount(promoCode, subtotal);

  const finalTotal = subtotal + taxAmount + shippingAmount - discountAmount;

  return {
    cartItems,
    totalItems,
    uniqueItems,
    subtotal,
    taxPercent,
    taxAmount,
    shippingAmount,
    discountAmount,
    finalTotal,
    shippingAddress,
    promoCode,
    shippingMethod,
  };
}

function calculateTaxRate(address) {
  // if (!address) return 0;

  const taxRates = {
    eg: 14, // Egypt
    uk: 20, // UK
    us: 8.5, // US average
  };

  // return taxRates[address?.country] || 0;
  return taxRates[address?.country] || 10;
}

function calculateShipping(address, items, subtotal, method) {
  // if (!address) return 0;
  // if (subtotal >= 50) return 0; // Free shipping over £50

  const shippingRates = {
    standard: 50,
    express: 100,
  };

  return shippingRates[method] || shippingRates["standard"];
}

function calculateDiscount(promoCode, subtotal) {
  if (!promoCode) return 0;

  if (promoCode.discount_type === "percentage") {
    return (subtotal * promoCode.discount_value) / 100;
  } else if (promoCode.discount_type === "fixed") {
    return Math.min(promoCode.discount_value, subtotal);
  }

  return 0;
}
