import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  order: null,
  orderItems: [],

  setOrderSuccess: (orderData) => {
    const { items, ...PlainOrderInfo } = orderData;
    set({
      order: PlainOrderInfo,
      orderItems: items,
    });
  },

  clearOrderSuccess: () => {
    set({
      order: null,
      orderItems: [],
    });
  },
}));
