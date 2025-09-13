import { api } from "./api";

const addressApi = {
  /**
   * 📥 GET ALL ADDRESSES FOR A USER
   * Fetches addresses for a specific user with pagination support
   * Perfect for user address management, checkout address selection
   * Example: const addresses = await addressesApi.getByUserId(123, {page: 1, limit: 10});
   */
  getByUserId: async (userId, queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.page) params.append("page", queryParams.page);
      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const url = `/addresses/user/${userId}${
        queryString ? `?${queryString}` : ""
      }`;

      return await api.get(url, options);
    } catch (error) {
      console.error(`Failed to fetch addresses for user ${userId}:`, {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE ADDRESS BY ID
   * Fetches details of one specific address using its unique ID
   * Great for address detail pages, edit forms, or showing address information
   * Example: const address = await addressesApi.getById(5);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Address ID is required");
    }

    try {
      return await api.get(`/addresses/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch address ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW ADDRESS
   * Adds a new address to the database
   * Required fields based on your backend validation
   * Example: const newAddress = await addressesApi.create({
   *   street_address: "123 Main St",
   *   city: "Cairo",
   *   country: "Egypt"
   * });
   */
  create: async (addressData, options = {}) => {
    try {
      return await api.post("/addresses", addressData, options);
    } catch (error) {
      console.error("Failed to create address:", {
        data: addressData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING ADDRESS
   * Changes information of an existing address
   * You can update any address field
   * Uses PUT method to update the complete address record
   * Example: const updated = await addressesApi.update(5, {
   *   street_address: "456 Updated St",
   *   postal_code: "12345"
   * });
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Address ID is required for updates");
    }

    try {
      return await api.put(`/addresses/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update address ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE ADDRESS
   * Permanently removes an address from database
   * WARNING: This action cannot be undone!
   * Make sure user confirms before deletion
   * Example: await addressesApi.delete(5);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Address ID is required for deletion");
    }

    try {
      return await api.delete(`/addresses/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete address ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default addressApi;
