import { api } from "./api";

const categoriesApi = {
  /**
   * 📥 GET ALL CATEGORIES
   * Fetches all categories in a tree structure with nested subcategories
   * Perfect for your categories page, dropdowns, navigation menus
   * Example: const categories = await categoryApi.getAll();
   */
  getAll: async (options = {}) => {
    try {
      return await api.get("/categories", {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch categories:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 📊 GET CATEGORY STATISTICS
   * Fetches category stats like total, active, with products, etc.
   * Perfect for your stats dashboard section
   * Example: const stats = await categoryApi.getStats();
   */
  getStats: async (options = {}) => {
    try {
      return await api.get("/categories/stats", options);
    } catch (error) {
      console.error("Failed to fetch category stats:", error.details);
      throw error;
    }
  },

  /**
   * 🎯 GET SINGLE CATEGORY BY ID
   * Fetches details of one specific category with its children
   * Great for category detail pages, edit forms, or showing category info
   * Example: const category = await categoryApi.getById(5);
   */
  getById: async (id, options = {}) => {
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
   * Adds a new category to the database
   * Required: name, image_url (category name and image are mandatory)
   * Optional: parent_id (for subcategories)
   * Example: const newCategory = await categoryApi.create({name: "Electronics", image_url: "https://..."});
   */
  create: async (categoryData, options = {}) => {
    // Input validation based on your backend controller requirements
    if (!categoryData.name) {
      throw new Error("Category name is required");
    }

    try {
      return await api.post("/categories", categoryData, options);
    } catch (error) {
      console.error("Failed to create category:", {
        data: categoryData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING CATEGORY
   * Changes information of an existing category
   * You can update name, image_url, or parent_id
   * Uses PUT method to update the complete category record
   * Example: const updated = await categoryApi.update(5, {name: "Updated Electronics"});
   */
  update: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Category ID is required for updates");
    }

    try {
      return await api.put(`/categories/${id}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update category ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE CATEGORY
   * Permanently removes a category from database
   * WARNING: This action cannot be undone!
   * Make sure no products are still using this category before deletion
   * Example: await categoryApi.delete(5);
   */
  delete: async (id, options = {}) => {
    if (!id) {
      throw new Error("Category ID is required for deletion");
    }

    try {
      return await api.delete(`/categories/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  // ----- Subcategories Methods -----

  /**
   * 📥 GET ALL SUBCATEGORIES
   * Fetches all subcategories in a flat list (without parent nesting)
   * Perfect for populating subcategory dropdowns, filters, or your table
   * Example: const allSubs = await categoryApi.getAllSubCategories();
   */
  getAllSubCategories: async (options = {}) => {
    try {
      return await api.get("/categories/subcategories/all", options);
    } catch (error) {
      console.error("Failed to fetch all subcategories:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 🎯 GET SUBCATEGORIES BY CATEGORY ID
   * Fetches all subcategories belonging to a specific parent category
   * Perfect for populating subcategory dropdowns or filtering
   * Example: const subcats = await categoryApi.getSubCategoriesByCategoryId(1);
   */
  getSubCategoriesByCategoryId: async (id, options = {}) => {
    if (!id) {
      throw new Error("Category ID is required to fetch subcategories");
    }

    try {
      return await api.get(`/categories/subcategories/${id}`, options);
    } catch (error) {
      console.error(
        `Failed to fetch subcategories for category ${id}:`,
        error.details
      );
      throw error;
    }
  },

  /**
   * ➕ CREATE SUBCATEGORY
   * Adds a new subcategory under a parent category
   * Required: name, categoryId (subcategory name and parent category ID)
   * Example: const newSubCat = await categoryApi.createSubCategory({name: "Smartphones", categoryId: 1});
   */
  createSubCategory: async (subCategoryData, options = {}) => {
    if (!subCategoryData.name || !subCategoryData.parent_id) {
      throw new Error("Subcategory name and parent category ID are required");
    }

    try {
      return await api.post(
        "/categories/subcategories",
        subCategoryData,
        options
      );
    } catch (error) {
      console.error("Failed to create subcategory:", {
        data: subCategoryData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE SUBCATEGORY
   * Changes information of an existing subcategory
   * You can update name, active status, or move to different parent
   * Example: const updated = await categoryApi.updateSubCategory(5, {name: "Mobile Phones"});
   */
  updateSubCategory: async (id, updateData, options = {}) => {
    if (!id) {
      throw new Error("Subcategory ID is required for updates");
    }

    try {
      return await api.put(
        `/categories/subcategories/${id}`,
        updateData,
        options
      );
    } catch (error) {
      console.error(`Failed to update subcategory ${id}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE SUBCATEGORY
   * Permanently removes a subcategory from database
   * WARNING: This action cannot be undone!
   * Make sure no products are still using this subcategory before deletion
   * Example: await categoryApi.deleteSubCategory(5);
   */
  deleteSubCategory: async (id, options = {}) => {
    if (!id) {
      throw new Error("Subcategory ID is required for deletion");
    }

    try {
      return await api.delete(`/categories/subcategories/${id}`, options);
    } catch (error) {
      console.error(`Failed to delete subcategory ${id}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },
};

export default categoriesApi;
