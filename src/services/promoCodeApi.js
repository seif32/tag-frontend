import { api } from "./api";

const promoCodeApi = {
  /**
   * 📥 GET ALL PROMO CODES
   * Fetches promo codes with pagination support
   * Perfect for admin promo code management, discount configuration
   * Example: const promoCodes = await promoCodesApi.getAll({page: 1, limit: 10});
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const url = `/promo-codes${queryString ? `?${queryString}` : ""}`;

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch promo codes:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET PROMO CODE BY ID
   * Fetches promo code details using its unique ID
   * Great for admin promo code management, edit forms
   * Example: const promoCode = await promoCodesApi.getById(123);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Promo code ID is required");
    }

    try {
      return await api.get(`/promo-codes/id/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch promo code ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * 🔍 GET PROMO CODE BY CODE
   * Fetches promo code details using the actual code string
   * Perfect for checkout validation, applying discounts
   * Example: const promoCode = await promoCodesApi.getByCode("SAVE20");
   */
  getByCode: async (code, options = {}) => {
    if (!code) {
      throw new Error("Promo code is required");
    }

    try {
      return await api.get(
        `/promo-codes/code/${encodeURIComponent(code)}`,
        options
      );
    } catch (error) {
      console.error(`Failed to fetch promo code ${code}:`, error.details);
      throw error;
    }
  },

  /**
   * ✅ CHECK IF PROMO CODE EXISTS
   * Validates if a promo code already exists in the system
   * Perfect for promo code creation forms, duplicate validation
   * Example: const exists = await promoCodesApi.checkExists("SAVE20");
   */
  checkExists: async (code, options = {}) => {
    if (!code) {
      throw new Error("Promo code is required for existence check");
    }

    try {
      return await api.get(
        `/promo-codes/exists/code/${encodeURIComponent(code)}`,
        options
      );
    } catch (error) {
      console.error(
        `Failed to check promo code existence ${code}:`,
        error.details
      );
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW PROMO CODE
   * Creates a new promo code with discount rules
   * Required: code, discount_type, discount_value
   * Example: const newPromo = await promoCodesApi.create({
   *   code: "SAVE20",
   *   discount_type: "percentage",
   *   discount_value: 20,
   *   expiry_date: "2025-12-31"
   * });
   */
  create: async (promoCodeData, options = {}) => {
    // Input validation based on your backend requirements
    if (!promoCodeData.code) {
      throw new Error("Promo code is required");
    }
    if (!promoCodeData.discount_type) {
      throw new Error("Discount type is required");
    }
    if (!promoCodeData.discount_value) {
      throw new Error("Discount value is required");
    }

    try {
      return await api.post("/promo-codes", promoCodeData, options);
    } catch (error) {
      console.error("Failed to create promo code:", {
        data: promoCodeData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING PROMO CODE
   * Updates promo code information (discount, expiry, status, etc.)
   * Use for changing discount values, extending expiry dates, deactivating codes
   * Example: const updated = await promoCodesApi.update(123, {
   *   discount_value: 25,
   *   expiry_date: "2025-12-31"
   * });
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Promo code ID is required for updates");
    }

    try {
      return await api.put(`/promo-codes/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update promo code ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE PROMO CODE
   * Permanently removes a promo code from database
   * WARNING: This action cannot be undone!
   * Make sure no active orders are using this promo code
   * Example: await promoCodesApi.delete(123);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Promo code ID is required for deletion");
    }

    try {
      return await api.delete(`/promo-codes/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete promo code ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default promoCodeApi;
