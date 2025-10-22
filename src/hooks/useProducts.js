import productsApi from "@/services/productsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

const useProducts = {
  /**
   * 📂 GET ALL PRODUCTS HOOK WITH FILTERING
   * Fetches complete product catalog with variants and images
   * Enhanced with filtering support for active status, category, and subcategory
   * Perfect for admin product lists, data tables, product catalogs with filters
   * Includes smart caching with filter-specific cache keys for optimal performance
   * Cache includes filter parameters to prevent incorrect data reuse
   * Returns: isLoadingProducts, products, errorProducts
   * Example: const { isLoadingProducts, products } = useProducts.useAll({ active: 1, category_id: 2 });
   */
  useAll: (filters = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["products", "list", filters], // Include filters in query key for proper caching
      queryFn: () => productsApi.getAll(filters), // Pass filters to API
      staleTime: 3 * 60 * 1000, // 3 minutes - products change more often than brands
      cacheTime: 8 * 60 * 1000, // Keep in cache for 8 minutes
      ...options,
    });

    return {
      isLoadingProducts: query.isLoading,
      products: query.data,
      errorProducts: query.error,
      isErrorProducts: query.isError,
      refetchProducts: query.refetch,
    };
  },

  /**
   * 📂 GET ALL PRODUCTS WITHOUT VARIANTS HOOK WITH FILTERING
   * Fetches simplified product catalog without variant complexity
   * Enhanced with filtering support for active status, category, and subcategory
   * Perfect for dropdowns, autocomplete, lightweight listings, performance-critical views
   * Faster loading due to reduced data payload - ideal for mobile optimization
   * Smart caching with filter-specific keys prevents data conflicts
   * Returns: isLoadingProducts, products, errorProducts
   * Example: const { products } = useProducts.useAllWithoutVariants({ active: 1 });
   */
  useAllWithoutVariants: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();

    // 🎯 Smart default: if `active` is explicitly passed in queryParams, use it
    // Otherwise, check URL params, then default to null (fetch all for admin)
    const activeFromUrl = searchParams.get("active");
    const active =
      queryParams.active !== undefined
        ? queryParams.active
        : activeFromUrl !== null
        ? activeFromUrl
        : null;

    const page = parseInt(searchParams.get("page")) || queryParams.page || 1;
    const limit =
      parseInt(searchParams.get("limit")) || queryParams.limit || 10;
    const featured = queryParams?.featured || 0;

    const mergedFilters = {
      ...queryParams,
      page,
      limit,
      active,
      featured,
    };

    // 🔥 Remove null/undefined values to avoid sending unnecessary params
    Object.keys(mergedFilters).forEach((key) => {
      if (mergedFilters[key] === null || mergedFilters[key] === undefined) {
        delete mergedFilters[key];
      }
    });

    const query = useQuery({
      queryKey: ["products", "without-variants", mergedFilters],
      queryFn: () => productsApi.getAllWithoutVariants(mergedFilters),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingProducts: query.isLoading,
      products: query.data,
      errorProducts: query.error,
      isErrorProducts: query.isError,
      refetchProducts: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE PRODUCT HOOK
   * Fetches one specific product with all variants, images, and relationships
   * Great for product detail pages, edit forms, variant management screens
   * Automatically includes category, brand, and variant type information
   * Returns: isLoadingProduct, product, errorProduct
   * Example: const { isLoadingProduct, product } = useProducts.useById(123);
   */
  useById: (productId, options = {}) => {
    const query = useQuery({
      queryKey: ["products", productId],
      queryFn: () => productsApi.getById(productId),
      enabled: !!productId, // Only run if product ID exists
      staleTime: 5 * 60 * 1000, // Individual products can cache longer
      ...options,
    });

    return {
      isLoadingProduct: query.isLoading,
      product: query.data,
      errorProduct: query.error,
      isErrorProduct: query.isError,
      refetchProduct: query.refetch,
    };
  },

  /**
   * 🎣 REACT QUERY HOOK: useProductStats
   * TanStack Query wrapper for product statistics
   * Optimized caching for dashboard performance
   * Auto-refresh every 10 minutes to keep stats current
   * Returns loading states and data with consistent naming
   */
  useStats: (options = {}) => {
    const query = useQuery({
      queryKey: ["products", "stats"],
      queryFn: productsApi.getStats,
      staleTime: 5 * 60 * 1000, // 5 minutes - stats change moderately
      cacheTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
      refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
      refetchOnWindowFocus: true, // Refresh when user returns to tab
      ...options,
    });

    return {
      isLoadingStats: query.isLoading,
      stats: query.data,
      errorStats: query.error,
      isErrorStats: query.isError,
      refetchStats: query.refetch,
      isStaleStats: query.isStale,
      lastUpdated: query.dataUpdatedAt,
    };
  },

  /**
   * ➕ CREATE NEW PRODUCT WITH VARIANTS HOOK
   * Handles adding a complete product with all variants and images
   * Automatically refreshes product list after successful creation
   * Provides detailed error handling for complex product creation
   * Returns: isPendingProducts, createProduct, errorCreateProduct
   * Example: const { isPendingProducts, createProduct } = useProducts.useCreate({
   *            onSuccess: (data) => {
   *              navigate(`/admin/products/${data.product_id}`);
   *            }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: productsApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["products"] });

        // Add new product to individual cache if we have the ID
        if (data.product_id) {
          queryClient.setQueryData(["products", data.product_id], data);
        }

        toast.success(" Product created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(` Failed to create product: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingProducts: mutation.isPending,
      createProduct: mutation.mutate,
      errorCreateProduct: mutation.error,
      isErrorCreateProduct: mutation.isError,
      resetCreateProduct: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING PRODUCT HOOK
   * Changes basic product information (not variants or images)
   * Updates both the specific product cache AND the full products list
   * Provides optimistic updates for instant UI feedback
   * Returns: isPendingProducts, updateProduct, errorUpdateProduct
   * Example: const { isPendingProducts, updateProduct } = useProducts.useUpdate();
   *          updateProduct({id: 123, data: {name: "iPhone 15 Pro", price: 1199.99}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => productsApi.update(id, data),

      // ⚡ Optimistic updates for better UX
      onMutate: async ({ id, data }) => {
        await queryClient.cancelQueries({ queryKey: ["products", id] });

        // Snapshot previous value
        const previousProduct = queryClient.getQueryData(["products", id]);

        // Optimistically update the cache
        if (previousProduct) {
          queryClient.setQueryData(["products", id], {
            ...previousProduct,
            ...data,
          });
        }

        return { previousProduct, id };
      },

      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["products", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },

      // Rollback optimistic update on error
      onError: (error, variables, context) => {
        if (context?.previousProduct) {
          queryClient.setQueryData(
            ["products", context.id],
            context.previousProduct
          );
        }

        toast.error(` Failed to update product: ${error.message}`);

        if (options.onError) {
          options.onError(error, variables, context);
        }
      },

      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError", "onMutate"].includes(key)
        )
      ),
    });

    return {
      isPendingProducts: mutation.isPending,
      updateProduct: mutation.mutate,
      errorUpdateProduct: mutation.error,
      isErrorUpdateProduct: mutation.isError,
      resetUpdateProduct: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE PRODUCT HOOK
   * Permanently removes a product and all its variants/images
   * Removes product from cache and refreshes the products list
   * Provides optimistic updates for instant UI feedback
   * Returns: isPendingProducts, deleteProduct, errorDeleteProduct
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingProducts, deleteProduct } = useProducts.useDelete();
   *          deleteProduct(productId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: productsApi.delete,

      // ⚡ Optimistic updates
      onMutate: async (productId) => {
        // Cancel queries
        await queryClient.cancelQueries({ queryKey: ["products"] });

        // Snapshot current state
        const previousProducts = queryClient.getQueryData(["products"]);

        // Optimistically remove from list
        if (previousProducts) {
          const filteredProducts = previousProducts.filter(
            (p) => p.id !== productId
          );
          queryClient.setQueryData(["products"], filteredProducts);
        }

        return { previousProducts, productId };
      },

      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["products", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },

      // Rollback on error
      onError: (error, variables, context) => {
        if (context?.previousProducts) {
          queryClient.setQueryData(["products"], context.previousProducts);
        }

        toast.error(` Failed to delete product: ${error.message}`);

        if (options.onError) {
          options.onError(error, variables, context);
        }
      },

      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError", "onMutate"].includes(key)
        )
      ),
    });

    return {
      isPendingProducts: mutation.isPending,
      deleteProduct: mutation.mutate,
      errorDeleteProduct: mutation.error,
      isErrorDeleteProduct: mutation.isError,
      resetDeleteProduct: mutation.reset,
    };
  },

  // 🎨 VARIANT MANAGEMENT HOOKS

  /**
   * ➕ ADD VARIANT TO PRODUCT HOOK
   * Adds a new variant with types and images to an existing product
   * Automatically refreshes the parent product data after success
   * Perfect for expanding product options in admin panels
   * Returns: isPendingVariants, addVariant, errorAddVariant
   * Example: const { isPendingVariants, addVariant } = useProducts.useAddVariant();
   *          addVariant({productId: 123, variantData: {...}});
   */
  useAddVariant: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ productId, variantData }) =>
        productsApi.addVariant(productId, variantData),
      onSuccess: (data, variables) => {
        // Invalidate parent product to refetch with new variant
        queryClient.invalidateQueries({
          queryKey: ["products", variables.productId],
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Variant added successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(` Failed to add variant: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingVariants: mutation.isPending,
      addVariant: mutation.mutate,
      errorAddVariant: mutation.error,
      isErrorAddVariant: mutation.isError,
      resetAddVariant: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE VARIANT HOOK
   * Changes variant information like price, stock, types
   * Refreshes related product data automatically
   * Returns: isPendingVariants, updateVariant, errorUpdateVariant
   * Example: const { updateVariant } = useProducts.useUpdateVariant();
   *          updateVariant({variantId: 456, variantData: {price: 999.99}});
   */
  useUpdateVariant: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ variantId, variantData }) =>
        productsApi.updateVariant(variantId, variantData),
      onSuccess: (data, variables) => {
        // Invalidate all product queries (we don't know which product this belongs to)
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Variant updated successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(` Failed to update variant: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingVariants: mutation.isPending,
      updateVariant: mutation.mutate,
      errorUpdateVariant: mutation.error,
      isErrorUpdateVariant: mutation.isError,
      resetUpdateVariant: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE VARIANT HOOK
   * Permanently removes a variant and its images
   * Refreshes parent product data automatically
   * Returns: isPendingVariants, deleteVariant, errorDeleteVariant
   * Example: const { deleteVariant } = useProducts.useDeleteVariant();
   *          deleteVariant(variantId);
   */
  useDeleteVariant: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: productsApi.deleteVariant,
      onSuccess: (data, deletedId) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("🗑️ Variant deleted successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(` Failed to delete variant: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingVariants: mutation.isPending,
      deleteVariant: mutation.mutate,
      errorDeleteVariant: mutation.error,
      isErrorDeleteVariant: mutation.isError,
      resetDeleteVariant: mutation.reset,
    };
  },

  // 📸 IMAGE MANAGEMENT HOOKS

  /**
   * ➕ ADD IMAGES TO VARIANT HOOK
   * Uploads multiple images to a specific variant
   * Automatically refreshes variant and product data
   * Returns: isPendingImages, addImages, errorAddImages
   * Example: const { addImages } = useProducts.useAddImages();
   *          addImages({variantId: 456, images: [{image_url: "...", is_primary: true}]});
   */
  useAddImages: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ variantId, images }) =>
        productsApi.addImagesToVariant(variantId, images),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("📸 Images added successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(` Failed to add images: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingImages: mutation.isPending,
      addImages: mutation.mutate,
      errorAddImages: mutation.error,
      isErrorAddImages: mutation.isError,
      resetAddImages: mutation.reset,
    };
  },

  /**
   * 🔧 BULK DELETE PRODUCTS HOOK
   * Deletes multiple products at once for admin efficiency
   * Perfect for data table bulk selection operations
   * Provides detailed feedback for each deletion attempt
   * Returns: isPendingBulk, bulkDeleteProducts, errorBulkDelete
   * Example: const { bulkDeleteProducts } = useProducts.useBulkDelete();
   *          bulkDeleteProducts([123, 456, 789]);
   */
  useBulkDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: productsApi.bulkDelete,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });

        const { successCount, errorCount } = data;
        if (errorCount > 0) {
          toast.warning(
            `⚠️ Bulk operation completed: ${successCount} deleted, ${errorCount} failed`
          );
        } else {
          toast.success(` Successfully deleted ${successCount} products`);
        }

        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(` Bulk delete failed: ${error.message}`);

        if (options.onError) {
          options.onError(error);
        }
      },
      ...Object.fromEntries(
        Object.entries(options).filter(
          ([key]) => !["onSuccess", "onError"].includes(key)
        )
      ),
    });

    return {
      isPendingBulk: mutation.isPending,
      bulkDeleteProducts: mutation.mutate,
      errorBulkDelete: mutation.error,
      isErrorBulkDelete: mutation.isError,
      resetBulkDelete: mutation.reset,
    };
  },

  /**
   * 🔍 CHECK PRODUCT NAME EXISTS HOOK
   * Real-time validation for product name uniqueness
   * Debounced to prevent excessive API calls during typing
   * Perfect for form validation with instant feedback
   * Returns: isCheckingName, nameExists, errorNameCheck
   * Example: const { nameExists, isCheckingName } = useProducts.useCheckNameExists(productName);
   */
  useCheckNameExists: (productName, options = {}) => {
    const query = useQuery({
      queryKey: ["products", "check-name", productName], // ✅ FIX: Include productName in key
      queryFn: () => productsApi.checkNameExists(productName),
      enabled: !!productName && productName.trim().length > 0,
      staleTime: 0, // ✅ Force fresh data every time
      gcTime: 0, // ✅ Don't cache the result (React Query v5)
      // cacheTime: 0, // ✅ Use this if you're on React Query v4
      refetchOnWindowFocus: false,
      retry: false,
      ...options,
    });

    return {
      isCheckingName: query.isLoading,
      nameExists: query.data?.exists || false,
      errorNameCheck: query.error,
      isErrorNameCheck: query.isError,
    };
  },
};

export default useProducts;
