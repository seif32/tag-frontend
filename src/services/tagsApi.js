import { api } from "./api";

/**
 * 🏷️ TAGS API SERVICE
 * Centralized API calls for tag management and product-tag relationships
 * Handles both individual tag operations and product tagging functionality
 * Uses exact endpoints from your backend routes with enhanced error handling
 */
const tagsApi = {
  /**
   * 📥 GET ALL TAGS
   * Fetches the complete list of all tags in the system
   * Perfect for tag selection dropdowns, admin tag management, global tag overview
   * Returns all tags regardless of category for maximum flexibility
   * Example: const tags = await tagsApi.getAll();
   */
  getAll: async (queryParams = {}, options = {}) => {
    try {
      const params = new URLSearchParams();

      if (queryParams.search) params.append("search", queryParams.search);

      const queryString = params.toString();
      const url = `/tags${queryString ? `?${queryString}` : ""}`;
      return await api.get(url, {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch all tags:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
        endpoint: "GET /tags",
      });
      throw error;
    }
  },

  /**
   * 🎯 GET TAGS BY CATEGORY
   * Fetches tags filtered by specific category ID
   * Essential for showing relevant tags when user selects a category
   * Improves UX by showing only applicable tags for the selected category
   * Example: const categoryTags = await tagsApi.getByCategoryId(12);
   */
  getByCategoryId: async (categoryId, options = {}) => {
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    try {
      return await api.get(`/tags/category/${categoryId}`, options);
    } catch (error) {
      console.error(`Failed to fetch tags for category ${categoryId}:`, {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
        categoryId,
        endpoint: `GET /tags/category/${categoryId}`,
      });
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW TAG
   * Adds a new tag to the system
   * Required: name (tag name is mandatory)
   * Optional: description, categoryId (for category-specific tags)
   * Example: const newTag = await tagsApi.create({name: "waterproof", categoryId: 12});
   */
  create: async (tagData, options = {}) => {
    // Input validation based on your backend requirements
    if (!tagData.name) {
      throw new Error("Tag name is required");
    }

    try {
      return await api.post("/tags", tagData, options);
    } catch (error) {
      console.error("Failed to create tag:", {
        data: tagData,
        error: error.details,
        endpoint: "POST /tags",
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING TAG
   * Changes information of an existing tag
   * You can update name, description, category association
   * Uses PUT method to update the complete tag record
   * Example: const updated = await tagsApi.update(5, {name: "Premium Quality", description: "High-end products"});
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Tag ID is required for updates");
    }

    try {
      return await api.put(`/tags/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update tag ${id}:`, {
        updateData,
        error: error.details,
        endpoint: `PUT /tags/${id}`,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE TAG
   * Permanently removes a tag from the system
   * WARNING: This will also remove the tag from ALL products using it!
   * Make sure to inform user about the cascading effects
   * Example: await tagsApi.delete(5);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Tag ID is required for deletion");
    }

    try {
      return await api.delete(`/tags/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete tag ${id}:`, {
        status: error.status,
        details: error.details,
        endpoint: `DELETE /tags/${id}`,
      });
      throw error;
    }
  },

  /**
   * 🔗 ADD TAG TO PRODUCT
   * Associates a tag with a specific product
   * Creates the many-to-many relationship between products and tags
   * Essential for product tagging functionality in your admin interface
   * Example: await tagsApi.addToProduct({productId: 123, tagId: 5});
   */
  addToProduct: async (productTagData, options = {}) => {
    // Validate required fields
    if (!productTagData.productId || !productTagData.tagId) {
      throw new Error("Both productId and tagId are required");
    }

    try {
      return await api.post("/tags/product", productTagData, options);
    } catch (error) {
      console.error("Failed to add tag to product:", {
        data: productTagData,
        error: error.details,
        endpoint: "POST /tags/product",
      });
      throw error;
    }
  },

  /**
   * 🔓 REMOVE TAG FROM PRODUCT
   * Removes the association between a tag and a product
   * Breaks the many-to-many relationship without deleting the tag or product
   * Perfect for when you want to untag products but keep the tag for future use
   * Example: await tagsApi.removeFromProduct(123, 5);
   */
  removeFromProduct: async (productId, tagId, options = {}) => {
    if (!productId || !tagId) {
      throw new Error("Both productId and tagId are required for removal");
    }

    try {
      return await api.delete(`/tags/product/${productId}/${tagId}`, options);
    } catch (error) {
      console.error(
        `Failed to remove tag ${tagId} from product ${productId}:`,
        {
          status: error.status,
          details: error.details,
          productId,
          tagId,
          endpoint: `DELETE /tags/product/${productId}/${tagId}`,
        }
      );
      throw error;
    }
  },
};

export default tagsApi;
