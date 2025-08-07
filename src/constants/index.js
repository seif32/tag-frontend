export const API_BASE_URL = "http://localhost:3000/api";

export const ROUTES = {
  CUSTOMER: {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: "/products/:id", // 🎯 Add dynamic routes
    CATEGORIES: "/categories",
    CATEGORY_DETAIL: "/categories/:slug",
    CART: "/cart",
    CHECKOUT: "/checkout",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    ORDER_HISTORY: "/orders",
  },
  ADMIN: {
    DASHBOARD: "",
    ADD_PRODUCT: "add-product",
    PRODUCTS: "products",
    CATEGORIES: "categories",
    ADD_CATEGORY: "add-category",
    EDIT_PRODUCT: "products/:id/edit",
    ORDERS: "orders",
    USERS: "users",
    SETTINGS: "settings",
  },
};

export const QUERY_KEYS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  CART: "cart",
  USER: "user",
  ORDERS: "orders",
  WISHLIST: "wishlist",
};
