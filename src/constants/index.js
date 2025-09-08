export const API_BASE_URL = "http://localhost:3000/api";

export const ROUTES = {
  CUSTOMER: {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: "/products/:id",
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
    PRODUCTS: "products",
    ADD_PRODUCT: "products/add",
    VIEW_PRODUCT: "products/:id",
    EDIT_PRODUCT: "products/:id/edit",
    ADD_CATEGORY: "add-category",
    CATEGORIES: "categories",
    ORDERS: "orders",
    USERS: "users",
    SETTINGS: "settings",
    BRANDS: "brands",
    TAGS: "tags",
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
