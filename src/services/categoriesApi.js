import { api } from "./api";

const categoriesApi = {
  /**
   * 📥 GET ALL CATEGORIES
   * Fetches the complete list of categories from the server
   * Returns them in a tree structure (parent categories with their children)
   * Example: Electronics -> Phones, Laptops, etc.
   */
  getAll: async (options = {}) => {
    try {
      return await api.get("/categories", {
        ...options,
      });
    } catch (error) {
      // Log detailed error info to help developers debug issues
      console.error("Failed to fetch categories:", {
        status: error.status, // HTTP status code (404, 500, etc.)
        method: error.method, // GET, POST, PUT, DELETE
        url: error.url, // Which URL failed
        responseTime: error.responseTime, // How long it took to fail
      });
      throw error; // Pass error to React Query for proper handling
    }
  },

  /**
   * 📋 GET ONE CATEGORY BY ID
   * Fetches details of a single category using its unique ID
   * Useful for category detail pages or editing forms
   * Example: getById(5) -> returns "Electronics" category info
   */
  getById: async (id, options = {}) => {
    // Make sure we have an ID before making the request
    if (!id) {
      throw new Error("Category ID is required");
    }

    try {
      return await api.get(`/categories/${id}`, options);
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error.details);
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW CATEGORY
   * Adds a brand new category to the database
   * Requires: category name and image URL
   * Optional: parent category ID (to make it a subcategory)
   * Example: create({name: "Smartphones", imageurl: "phone.jpg"})
   */
  create: async (categoryData, options = {}) => {
    // Check if we have the minimum required fields
    if (!categoryData.name || !categoryData.imageurl) {
      throw new Error("Category name and image URL are required");
    }

    try {
      return await api.post("/categories", categoryData, options);
    } catch (error) {
      console.error("Failed to create category:", {
        data: categoryData, // What data we tried to send
        error: error.details, // What went wrong
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING CATEGORY
   * Changes information of an existing category
   * You can update just the name, just the image, or both
   * Uses PATCH method - only sends the fields you want to change
   * Example: update(5, {name: "New Category Name"})
   */
  update: async (id, updateData, options = {}) => {
    // Make sure we know which category to update
    if (!id) {
      throw new Error("Category ID is required for updates");
    }

    try {
      // PATCH only updates the fields you send (partial update)
      return await api.patch(`/categories/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update category ${id}:`, {
        updateData, // What we tried to change
        error: error.details, // Why it failed
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE CATEGORY
   * Permanently removes a category from the database
   * WARNING: This action cannot be undone!
   * If category has children, they become orphans (parentid = null)
   * Example: delete(5) -> removes category with ID 5
   */
  delete: async (id, options = {}) => {
    // Make sure we know which category to delete
    if (!id) {
      throw new Error("Category ID is required for deletion");
    }

    try {
      return await api.delete(`/categories/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, {
        status: error.status, // HTTP error code
        details: error.details, // Server error message
      });
      throw error;
    }
  },
};

export default categoriesApi;
