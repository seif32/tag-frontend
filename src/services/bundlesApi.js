import { api } from "./api";

const bundlesApi = {
  /**
   * 📥 GET ALL BUNDLES
   * Fetches bundles with pagination support and full product details
   * Perfect for admin bundle management, bundle listing pages
   * Example: const bundles = await bundlesApi.getAll({page: 1, limit: 10});
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();

      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      // 🔍 Add filtering support
      if (queryParams.variant_id)
        params.append("variant_id", queryParams.variant_id);

      const queryString = params.toString();
      const url = `/bundles${queryString ? `?${queryString}` : ""}`;

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch bundles:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE BUNDLE BY ID
   * Fetches complete bundle details with product and variant information
   * Great for bundle detail pages, admin bundle management
   * Example: const bundle = await bundlesApi.getById(123);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Bundle ID is required");
    }

    try {
      return await api.get(`/bundles/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch bundle ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * 🔎 GET BUNDLES BY PRODUCT ID
   * Fetch bundles linked to a product
   * Example: const bundles = await bundlesApi.getByProductId(34);
   */
  getByProductId: async (productId, queryParams = {}, options = {}) => {
    if (!productId) throw new Error("Product ID is required");
    try {
      const params = new URLSearchParams();

      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const url = `/bundles/product_id/${productId}/${
        queryString ? `?${queryString}` : ""
      }`;
      return await api.get(url, options);
    } catch (error) {
      console.error(
        `Failed to fetch bundles for product ${productId}:`,
        error.details
      );
      throw error;
    }
  },

  /**
   * 📊 GET BUNDLE STATISTICS
   * Fetches statistics about bundles (active, inactive, value range, etc.)
   * Example: const stats = await bundlesApi.getStatistics();
   */
  getStatistics: async (options = {}) => {
    try {
      return await api.get("/bundles/statistics", options);
    } catch (error) {
      console.error("Failed to fetch bundle statistics:", error.details);
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW BUNDLE
   * Creates a new bundle with variant, pricing and quantity details
   * Handles validation and bundle creation
   * Example: const newBundle = await bundlesApi.create({
   *   variant_id: 101,
   *   quantity: 5,
   *   vat: 14,
   *   subtotal: 400,
   *   is_active: true
   * });
   */
  create: async (bundleData, options = {}) => {
    // Input validation based on your backend requirements
    if (!bundleData.variant_id) {
      throw new Error("Variant ID is required");
    }
    if (!bundleData.quantity || bundleData.quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    if (bundleData.vat < 0 || bundleData.vat > 100) {
      throw new Error("VAT must be between 0 and 100");
    }
    if (!bundleData.subtotal || bundleData.subtotal < 0) {
      throw new Error("Subtotal must be a positive number");
    }

    try {
      return await api.post("/bundles", bundleData, options);
    } catch (error) {
      console.error("Failed to create bundle:", {
        data: bundleData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING BUNDLE
   * Updates bundle information (quantity, pricing, status, etc.)
   * Use for bundle modifications, status changes, price updates
   * Example: const updated = await bundlesApi.update(123, {
   *   quantity: 10,
   *   is_active: false
   * });
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Bundle ID is required for updates");
    }

    try {
      return await api.put(`/bundles/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update bundle ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE BUNDLE
   * Removes a bundle from the system
   * Use for bundle cleanup, inventory management
   * Example: await bundlesApi.delete(123);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Bundle ID is required for deletion");
    }

    try {
      return await api.delete(`/bundles/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete bundle ${id}:`, error.details);
      throw error;
    }
  },
};

export default bundlesApi;
