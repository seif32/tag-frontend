import { api } from "./api";

const productsApi = {
  /**
   * 📥 GET ALL PRODUCTS WITH FILTERS
   * Fetches complete product catalog with optional filtering capabilities
   * Perfect for product listings, admin tables, search and filter operations
   * Supports filtering by active status, category ID, and subcategory ID
   * Returns products with full variant and image information
   * Example: const products = await productsApi.getAll({ active: 1, category_id: 2 });
   */
  getAll: async (filters = {}, options = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters.active !== undefined)
        queryParams.append("active", filters.active);
      if (filters.category_id)
        queryParams.append("category_id", filters.category_id);
      if (filters.subcategory_id)
        queryParams.append("subcategory_id", filters.subcategory_id);

      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch products:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  /**
   * 📥 GET ALL PRODUCTS WITHOUT VARIANTS WITH FILTERS
   * Fetches simplified product catalog without variant complexity
   * Perfect for dropdowns, autocomplete, lightweight listings, performance-critical views
   * Supports same filtering options as full product list but with reduced payload
   * Example: const products = await productsApi.getAllWithoutVariants({ active: 1 });
   */
  getAllWithoutVariants: async (filters = {}, options = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.active !== undefined)
        queryParams.append("active", filters.active);
      if (filters.category_id)
        queryParams.append("category_id", filters.category_id);
      if (filters.subcategory_id)
        queryParams.append("subcategory_id", filters.subcategory_id);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/products/without-variants?${queryString}`
        : "/products/without-variants";

      return await api.get(url, options);
    } catch (error) {
      console.error("Failed to fetch products without variants:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
      });
      throw error;
    }
  },

  getById: async (productId, options = {}) => {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      return await api.get(`/products/${productId}`, options);
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error.details);
      throw error;
    }
  },

  /**
   * 📊 GET PRODUCT STATISTICS OVERVIEW
   * Fetches comprehensive product statistics for dashboard analytics
   * Perfect for overview cards, KPI displays, business intelligence
   * Returns essential metrics: totals, active/inactive counts, stock alerts
   * Example: const stats = await productsApi.getStats();
   */
  getStats: async (options = {}) => {
    try {
      return await api.get("/products/stats", {
        ...options,
      });
    } catch (error) {
      console.error("Failed to fetch product statistics:", {
        status: error.status,
        method: error.method,
        url: error.url,
        responseTime: error.responseTime,
        endpoint: "GET /products/stats",
      });
      throw error;
    }
  },

  /**
   * ➕ CREATE NEW PRODUCT WITH VARIANTS AND IMAGES
   * Adds a complete product with all its variants and images in one transaction
   * Required: product object (name, sku, description), variants array
   * Optional: category_id, brand_id, tags, featured flag
   * Each variant can have dynamic types, pricing, images, and stock info
   * Example: const newProduct = await productsApi.create({
   *   product: { name: "iPhone 15", sku: "IP15-001", description: "Latest iPhone" },
   *   variants: [{ variant_sku: "IP15-BLK-128", price: 999.99, types: [...], images: [...] }]
   * });
   */
  create: async (productData, options = {}) => {
    console.log("🚀 Original product data:", productData);

    if (!productData.name || !productData.sku) {
      throw new Error("Product name and SKU are required");
    }
    if (!productData.variants || !Array.isArray(productData.variants)) {
      throw new Error("Variants array is required");
    }

    productData.variants.forEach((variant, index) => {
      if (!variant.variant_name || !variant.variant_sku) {
        throw new Error(`Variant ${index + 1}: name and SKU are required`);
      }
      if (!variant.types || variant.types.length === 0) {
        throw new Error(
          `Variant ${index + 1}: must have at least one type selection`
        );
      }
    });

    const apiPayload = {
      product: {
        name: productData.name,
        sku: productData.sku,
        description: productData.description,
        short_description: productData.short_description,
        brand_id: productData.brand_id,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id,
        active: productData.active ?? true,
        featured: productData.featured ?? false,
      },
      tags: productData.tags || [],
      variants: productData.variants, // ✅ Already transformed with correct structure
    };

    console.log("🔄 API payload:", apiPayload);

    try {
      return await api.post("/products", apiPayload, options);
    } catch (error) {
      console.error("❌ Failed to create product:", {
        originalData: productData,
        apiPayload: apiPayload,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE PRODUCT BASIC INFORMATION
   * Updates only the main product details, not variants or images
   * You can update name, description, category, brand, tags, etc.
   * For variant updates, use variant-specific methods
   * Uses PUT method to update the complete product record
   * Example: const updated = await productsApi.update(123, {
   *   name: "iPhone 15 Pro",
   *   description: "Updated description",
   *   category_id: 2
   * });
   */
  update: async (productId, updateData, options = {}) => {
    if (!productId) {
      throw new Error("Product ID is required for updates");
    }

    try {
      return await api.put(`/products/${productId}`, updateData, options);
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, {
        updateData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE PRODUCT WITH ALL VARIANTS AND IMAGES
   * Permanently removes a product and ALL its related data
   * WARNING: This deletes variants, images, and all relationships!
   * This action cannot be undone - use with extreme caution
   * Perfect for admin bulk delete operations in data tables
   * Example: await productsApi.delete(123);
   */
  delete: async (productId, options = {}) => {
    if (!productId) {
      throw new Error("Product ID is required for deletion");
    }

    try {
      return await api.delete(`/products/${productId}`, options);
    } catch (error) {
      console.error(`Failed to delete product ${productId}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  // 🎨 VARIANT MANAGEMENT OPERATIONS

  /**
   * ➕ ADD NEW VARIANT TO EXISTING PRODUCT
   * Adds a single variant with types and pricing to an existing product
   * Required: variant_sku, price, and the types array for dynamic attributes
   * Optional: images, stock quantity, discount pricing
   * Great for expanding product options after initial creation
   * Example: const newVariant = await productsApi.addVariant(123, {
   *   variant_sku: "IP15-RED-256",
   *   price: 1099.99,
   *   types: [{type_id: 1, value_id: 3}],
   *   images: [{image_url: "...", is_primary: true}]
   * });
   */
  addVariant: async (productId, variantData, options = {}) => {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!variantData.variant_sku || !variantData.price) {
      throw new Error("Variant SKU and price are required");
    }

    try {
      return await api.post(
        `/products/variant/${productId}`,
        variantData,
        options
      );
    } catch (error) {
      console.error(`Failed to add variant to product ${productId}:`, {
        variantData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE EXISTING VARIANT INFORMATION
   * Changes any aspect of a variant: pricing, stock, types, or basic info
   * You can update price, compare_at_price, quantity, types array
   * Does NOT update images - use image-specific methods for that
   * Uses PUT method for complete variant record update
   * Example: const updated = await productsApi.updateVariant(456, {
   *   price: 899.99,
   *   quantity: 25,
   *   types: [{type_id: 1, value_id: 2}]
   * });
   */
  updateVariant: async (variantId, variantData, options = {}) => {
    if (!variantId) {
      throw new Error("Variant ID is required");
    }

    try {
      return await api.put(
        `/products/variant/${variantId}`,
        variantData,
        options
      );
    } catch (error) {
      console.error(`Failed to update variant ${variantId}:`, {
        variantData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE VARIANT AND ITS IMAGES
   * Permanently removes a variant and all its associated images
   * WARNING: This cannot be undone! All variant data will be lost
   * Useful for removing discontinued color/size combinations
   * Example: await productsApi.deleteVariant(456);
   */
  deleteVariant: async (variantId, options = {}) => {
    if (!variantId) {
      throw new Error("Variant ID is required");
    }

    try {
      return await api.delete(`/products/variant/${variantId}`, options);
    } catch (error) {
      console.error(`Failed to delete variant ${variantId}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  // 📸 IMAGE MANAGEMENT OPERATIONS

  /**
   * ➕ ADD IMAGES TO SPECIFIC VARIANT
   * Uploads multiple images to a variant at once
   * Required: images array with image_url for each image
   * Optional: is_primary flag to set main variant image
   * Perfect for product photo galleries and variant visualization
   * Example: const addedImages = await productsApi.addImagesToVariant(456, [
   *   {image_url: "https://...", is_primary: true},
   *   {image_url: "https://...", is_primary: false}
   * ]);
   */
  addImagesToVariant: async (variantId, images, options = {}) => {
    if (!variantId) {
      throw new Error("Variant ID is required");
    }

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("Images array is required and must not be empty");
    }

    // Validate image structure
    const invalidImages = images.filter((img) => !img.image_url);
    if (invalidImages.length > 0) {
      throw new Error("All images must have image_url");
    }

    try {
      return await api.post(
        `/products/variant/${variantId}/images`,
        { images },
        options
      );
    } catch (error) {
      console.error(`Failed to add images to variant ${variantId}:`, {
        images,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * ✏️ UPDATE SINGLE IMAGE INFORMATION
   * Changes image URL or primary status for one specific image
   * You can update the image_url or toggle is_primary flag
   * Useful for replacing images or changing the main product photo
   * Example: const updated = await productsApi.updateImage(789, {
   *   image_url: "https://new-image-url.jpg",
   *   is_primary: true
   * });
   */
  updateImage: async (imageId, imageData, options = {}) => {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      return await api.put(
        `/products/variant/images/${imageId}`,
        imageData,
        options
      );
    } catch (error) {
      console.error(`Failed to update image ${imageId}:`, {
        imageData,
        error: error.details,
      });
      throw error;
    }
  },

  /**
   * 🗑️ DELETE SINGLE IMAGE
   * Permanently removes one specific image from a variant
   * WARNING: This cannot be undone! Image will be lost forever
   * Make sure this isn't the only image for a variant
   * Example: await productsApi.deleteImage(789);
   */
  deleteImage: async (imageId, options = {}) => {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      return await api.delete(`/products/variant/images/${imageId}`, options);
    } catch (error) {
      console.error(`Failed to delete image ${imageId}:`, {
        status: error.status,
        details: error.details,
      });
      throw error;
    }
  },

  // 🔧 UTILITY AND BULK OPERATIONS

  /**
   * 🗑️ BULK DELETE PRODUCTS
   * Deletes multiple products at once for admin efficiency
   * Perfect for data table bulk selection operations
   * Processes deletions sequentially to avoid overwhelming the server
   * Returns detailed results for each deletion attempt
   * Example: const results = await productsApi.bulkDelete([123, 456, 789]);
   */
  bulkDelete: async (productIds, options = {}) => {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("Product IDs array is required");
    }

    try {
      // Process deletions sequentially for better error handling
      const results = [];
      for (const productId of productIds) {
        try {
          await productsApi.delete(productId);
          results.push({ productId, success: true });
        } catch (error) {
          results.push({
            productId,
            success: false,
            error: error.message,
          });
        }
      }

      return {
        message: `Processed ${productIds.length} products`,
        results,
        successCount: results.filter((r) => r.success).length,
        errorCount: results.filter((r) => !r.success).length,
      };
    } catch (error) {
      console.error("Failed to bulk delete products:", {
        productIds,
        error: error.details,
      });
      throw error;
    }
  },
};

export default productsApi;
