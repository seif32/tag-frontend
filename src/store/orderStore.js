import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  currentOrder: null,
  orderItems: [],

  setOrderSuccess: (orderData) => {
    set({
      currentOrder: orderData.order,
      orderItems: orderData.items.map((item) => ({
        id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total_price: item.total_price,
      })),
    });
  },

  clearOrderSuccess: () => {
    set({
      currentOrder: null,
      orderItems: [],
    });
  },
}));
