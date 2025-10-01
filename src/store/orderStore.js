import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  order: null,
  orderItems: [],
  orderBundles: [], // New state for bundles

  setOrderSuccess: (orderData) =>
    set({
      order: orderData,
      orderItems: orderData.items || [],
      orderBundles: orderData.bundles || [], // Store bundles
    }),

  clearOrder: () =>
    set({
      order: null,
      orderItems: [],
      orderBundles: [], // Clear bundles
    }),
}));
