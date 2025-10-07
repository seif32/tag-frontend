import { api } from "./api";

/**
 * 🏷️ BRANDS API SERVICE
 * Centralized API calls for brand management using your enhanced API utility
 * Follows the same pattern as categories for perfect consistency
 * Uses exact endpoints from your backend routes
 */
const brandsApi = {
  /**
   * 📥 GET ALL BRANDS
   * Fetches the complete list of brands from server
   * Perfect for brand selection dropdowns, admin brand lists, product creation forms
   * Example: const brands = await brandsApi.getAll();
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (queryParams.search) params.append("search", queryParams.search);
      const queryString = params.toString();
      const url = `/brands${queryString ? `?${queryString}` : ""}`;
      return await api.get(url, {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch brands:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE BRAND BY ID
   * Fetches details of one specific brand using its unique ID
   * Great for brand detail pages, edit forms, or showing brand information
   * Example: const brand = await brandsApi.getById(5);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("Brand ID is required");
    }

    try {
      return await api.get(`/brands/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch brand ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW BRAND
   * Adds a brand new brand to the database
   * Required: name (brand name is mandatory)
   * Optional: description (additional brand information)
   * Example: const newBrand = await brandsApi.create({name: "Apple", description: "Tech company"});
   */
  create: async (brandData, options = {}) => {
    // Input validation based on your backend controller requirements
    if (!brandData.name) {
      throw new Error("Brand name is required");
    }

    try {
      return await api.post("/brands", brandData, options);
    } catch (error) {
      console.error("Failed to create brand:", {
        data: brandData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING BRAND
   * Changes information of an existing brand
   * You can update name, description, or both
   * Uses PUT method to update the complete brand record
   * Example: const updated = await brandsApi.update(5, {name: "Apple Inc.", description: "Updated description"});
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Brand ID is required for updates");
    }

    try {
      return await api.put(`/brands/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update brand ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE BRAND
   * Permanently removes a brand from database
   * WARNING: This action cannot be undone!
   * Make sure no products are still using this brand before deletion
   * Example: await brandsApi.delete(5);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Brand ID is required for deletion");
    }

    try {
      return await api.delete(`/brands/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete brand ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default brandsApi;
