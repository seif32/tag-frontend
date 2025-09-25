import { api } from "./api";

/**
 * 🏙️ CITIES API SERVICE
 * Centralized API calls for city management using your enhanced API utility
 * Follows the same pattern as brands for perfect consistency
 * Uses exact endpoints from your backend routes
 */
const citiesApi = {
  /**
   * 📥 GET ALL CITIES
   * Fetches the complete list of cities from server with pagination support
   * Perfect for city selection dropdowns, admin city lists, address forms
   * Example: const cities = await citiesApi.getAll({page: 1, limit: 10});
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      console.log("citiesApi", queryParams);
      const params = new URLSearchParams();

      if (queryParams.limit) params.append("limit", queryParams.limit);

      const queryString = params.toString();
      const url = `/cities${queryString ? `?${queryString}` : ""}`;

      return await api.get(url, {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch cities:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE CITY BY ID
   * Fetches details of one specific city using its unique ID
   * Great for city detail pages, edit forms, or showing city information
   * Example: const city = await citiesApi.getById(5);
   */
  getById: async (id, options = {}) => {
    if (!id) {
      throw new Error("City ID is required");
    }

    try {
      return await api.get(`/cities/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch city ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW CITY
   * Adds a brand new city to the database
   * Required: name (city name is mandatory)
   * Optional: Additional city information based on your CityInput schema
   * Example: const newCity = await citiesApi.create({name: "Cairo", country: "Egypt"});
   */
  create: async (cityData, options = {}) => {
    // Input validation based on your backend controller requirements
    if (!cityData.name) {
      throw new Error("City name is required");
    }

    try {
      return await api.post("/cities", cityData, options);
    } catch (error) {
      console.error("Failed to create city:", {
        data: cityData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING CITY
   * Changes information of an existing city
   * You can update name, country, or any other city fields
   * Uses PUT method to update the complete city record
   * Example: const updated = await citiesApi.update(5, {name: "New Cairo", country: "Egypt"});
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("City ID is required for updates");
    }

    try {
      return await api.put(`/cities/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update city ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE CITY
   * Permanently removes a city from database
   * WARNING: This action cannot be undone!
   * Make sure no addresses or users are still using this city before deletion
   * Example: await citiesApi.delete(5);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("City ID is required for deletion");
    }

    try {
      return await api.delete(`/cities/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete city ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default citiesApi;
