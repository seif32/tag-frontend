import { api } from "./api";

const ordersApi = {
  /**
   * 📥 GET ALL ORDERS
   * Fetches orders with pagination support and full product details
   * Perfect for admin order management, order history pages
   * Example: const orders = await ordersApi.getAll({page: 1, limit: 10});
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      // 🔍 Add filtering support
      if (queryParams.name) params.append("name", queryParams.name);
      if (queryParams.id) params.append("id", queryParams.id);
      if (queryParams.status) params.append("status", queryParams.status);
      if (queryParams.dateFrom) params.append("dateFrom", queryParams.dateFrom);
      if (queryParams.dateTo) params.append("dateTo", queryParams.dateTo);

      const queryString = params.toString();
      const url = `/orders${queryString ? `?${queryString}` : ""}`;

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch orders:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 📊 GET ALL ORDERS WITHOUT ITEMS
   * Fetches basic order info without full product details for faster loading
   * Perfect for admin order lists, dashboards where you need quick overview
   * Example: const orders = await ordersApi.getAllWithoutItems({page: 1, limit: 20});
   */
  getAllWithoutItems: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);
      if (queryParams.name) params.append("name", queryParams.name);
      if (queryParams.id) params.append("id", queryParams.id);

      const queryString = params.toString();
      const url = `/orders/without-items${
        queryString ? `?${queryString}` : ""
      }`;

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch orders without items:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 📈 GET ORDER STATISTICS
   * Fetches order analytics like total revenue, order count, avg order value
   * Perfect for dashboards, analytics pages, business reporting
   * Example: const stats = await ordersApi.getStats();
   */
  getStats: async (options = {}) => {
    try {
      return await api.get("/orders/stats", options);
    } catch (error) {
      console.error("Failed to fetch order statistics:", error.details);
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE ORDER BY ID
   * Fetches complete order details with items and product information
   * Great for order detail pages, admin order management
   * Example: const order = await ordersApi.getById(123);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Order ID is required");
    }

    try {
      return await api.get(`/orders/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * 👤 GET ORDERS BY USER ID
   * Fetches all orders for a specific user
   * Perfect for user profile pages, order history, customer service
   * Example: const userOrders = await ordersApi.getByUserId(456);
   */
  getByUserId: async (userId, options = {}) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      // Build query string from pagination options
      const queryParams = new URLSearchParams();

      // Extract pagination params with defaults
      const { page = 1, limit = 10, ...restOptions } = options;

      // Always add pagination params
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      // Add any additional filters if they exist
      if (options.status) queryParams.append("status", options.status);
      if (options.dateFrom) queryParams.append("dateFrom", options.dateFrom);
      if (options.dateTo) queryParams.append("dateTo", options.dateTo);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/orders/user/${userId}?${queryString}`
        : `/orders/user/${userId}`;

      return await api.get(url, restOptions);
    } catch (error) {
      console.error(
        `Failed to fetch orders for user ${userId}:`,
        error.details
      );
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW ORDER WITH ITEMS
   * Creates a complete order with all items in a single transaction
   * Handles inventory checks and order processing
   * Example: const newOrder = await ordersApi.create({
   *   user_id: 123,
   *   items: [{product_id: 1, quantity: 2}, {product_id: 2, quantity: 1}],
   *   shipping_address_id: 5,
   *   payment_method: 'credit_card'
   * });
   */
  create: async (orderData, options = {}) => {
    // Input validation based on your backend requirements
    if (!orderData.user_id) {
      throw new Error("User ID is required");
    }
    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      throw new Error("Order items are required");
    }
    if (!orderData.address_id) {
      throw new Error("Shipping address is required");
    }

    try {
      return await api.post("/orders", orderData, options);
    } catch (error) {
      console.error("Failed to create order:", {
        data: orderData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING ORDER
   * Updates order information (status, shipping details, etc.)
   * Use for order status changes, shipping updates, cancellations
   * Example: const updated = await ordersApi.update(123, {
   *   status: 'shipped',
   *   tracking_number: 'TRACK123456'
   * });
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Order ID is required for updates");
    }

    try {
      return await api.put(`/orders/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update order ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },
};

export default ordersApi;
