import { api } from "./api";

const variantTypesApi = {
  // 🎯 ===== VARIANT TYPES MANAGEMENT (High Level) =====

  /**
   * 📥 GET ALL VARIANT TYPES
   * Fetches all variant types like Color, Size, Material, Storage, etc.
   * Perfect for admin variant type management and product creation dropdowns
   * Example: [{id: 1, name: "Color"}, {id: 2, name: "Size"}]
   */
  getAllTypes: async (options = {}) => {
    try {
      return await api.get("/variant-types", {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch variant types:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW VARIANT TYPE
   * Creates a new variant type like "Material" or "Style"
   * Required: name (the variant type name)
   * Example: createType({name: "Material"}) → creates Material variant type
   */
  createType: async (typeData, options = {}) => {
    if (!typeData.name) {
      throw new Error("Variant type name is required");
    }

    try {
      return await api.post("/variant-types", typeData, options);
    } catch (error) {
      console.error("Failed to create variant type:", {
        data: typeData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE VARIANT TYPE
   * Updates an existing variant type name or properties
   * Example: updateType(1, {name: "Product Color"}) → renames Color to Product Color
   */
  updateType: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Variant type ID is required for updates");
    }

    try {
      return await api.put(`/variant-types/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update variant type ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE VARIANT TYPE
   * Permanently removes a variant type and all its values
   * WARNING: This will also delete all values associated with this type!
   * Example: deleteType(1) → removes Color variant type and all color values
   */
  deleteType: async (id, options = {}) => {
    if (!id) {
      throw new Error("Variant type ID is required for deletion");
    }

    try {
      return await api.delete(`/variant-types/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete variant type ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  // 🎨 ===== VARIANT VALUES MANAGEMENT (Granular Level) =====

  /**
   * 📊 GET ALL VARIANT VALUES
   * Fetches all variant values across all types
   * Useful for global value management and analytics
   * Example: [{id: 1, value: "Red", variant_type_id: 1}, {id: 2, value: "Large", variant_type_id: 2}]
   */
  getAllValues: async (options = {}) => {
    try {
      return await api.get("/variant-types/values", {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch all variant values:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET VALUES BY VARIANT TYPE ID
   * Fetches all values for a specific variant type
   * Perfect for populating dropdowns and managing type-specific values
   * Example: getValuesByTypeId(1) → gets all color values like ["Red", "Blue", "Green"]
   */
  getValuesByTypeId: async (variantTypeId, options = {}) => {
    if (!variantTypeId) {
      throw new Error("Variant type ID is required");
    }

    try {
      return await api.get(`/variant-types/values/${variantTypeId}`, options);
    } catch (error) {
      console.error(
        `Failed to fetch values for variant type ${variantTypeId}:`,
        error.details
      );
      throw error;
    }
  },

  /**
   * ➕ CREATE MULTIPLE VALUES FOR A VARIANT TYPE
   * Adds multiple values to a variant type in one API call
   * Perfect for bulk operations and initial setup
   * Example: createManyValues({variant_type_id: 1, values: ["Red", "Blue", "Green"]})
   */
  createManyValues: async (valuesData, options = {}) => {
    if (
      !valuesData.variant_type_id ||
      !valuesData.values ||
      !Array.isArray(valuesData.values)
    ) {
      throw new Error("variant_type_id and values array are required");
    }

    if (valuesData.values.length === 0) {
      throw new Error("At least one value is required");
    }

    try {
      return await api.post("/variant-types/values", valuesData, options);
    } catch (error) {
      console.error("Failed to create variant values:", {
        data: valuesData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE SINGLE VARIANT VALUE
   * Updates a specific variant value
   * Can change the value text or move it to different variant type
   * Example: updateValue(5, {value: "Dark Red", variant_type_id: 1})
   */
  updateValue: async (valueId, updateData, options = {}) => {
    if (!valueId) {
      throw new Error("Value ID is required for updates");
    }

    if (!updateData.value && !updateData.variant_type_id) {
      throw new Error("Either value or variant_type_id must be provided");
    }

    try {
      return await api.put(
        `/variant-types/values/${valueId}`,
        updateData,
        options
      );
    } catch (error) {
      console.error(`Failed to update variant value ${valueId}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE SINGLE VARIANT VALUE
   * Removes a specific variant value
   * Example: deleteValue(5) → removes "Red" color value
   */
  deleteValue: async (valueId, options = {}) => {
    if (!valueId) {
      throw new Error("Value ID is required for deletion");
    }

    try {
      return await api.delete(`/variant-types/values/${valueId}`, options);
    } catch (error) {
      console.error(`Failed to delete variant value ${valueId}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default variantTypesApi;
