import { toast } from "sonner";
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  uniqueItems: 0,

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

      return recalc(updatedItems);
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.cartItems.filter(
        (item) => item.id !== productId
      );

      return recalc(updatedItems);
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

      return recalc(items);
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
      return recalc(items);
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

      return recalc(items);
    }),

  clearCart: () => set({ cartItems: [], totalItems: 0, totalPrice: 0 }),
}));

function recalc(cartItems) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); // all quantities
  const uniqueItems = cartItems.length; // distinct products
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { cartItems, totalItems, uniqueItems, totalPrice };
}
