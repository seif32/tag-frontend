const { create } = require("zustand");

export const useCartStore = create((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => product.id === item.id);

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { product, quantity }];
      }

      const totalItems = updatedItems.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);
      const totalPrice = updatedItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      return {
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== productId);

      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    });
  },

  updateQuantity: (productId, quantity) => {},
  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));
