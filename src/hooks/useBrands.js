import brandsApi from "@/services/brandsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useBrands = {
  /**
   * 📂 GET ALL BRANDS HOOK
   * Fetches the complete list of brands from server
   * Perfect for brand selection dropdowns, admin lists, product creation forms
   * Returns: isLoadingBrands, brands, errorBrands
   * Example: const { isLoadingBrands, brands } = useBrandsQueries.useAll();
   */
  useAll: (options = {}) => {
    const query = useQuery({
      queryKey: ["brands"],
      queryFn: brandsApi.getAll,
      staleTime: 5 * 60 * 1000, // 5 minutes - brands don't change often
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      ...options,
    });

    return {
      isLoadingBrands: query.isLoading,
      brands: query.data,
      errorBrands: query.error,
      isErrorBrands: query.isError,
      refetchBrands: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE BRAND HOOK
   * Fetches details of one specific brand using its ID
   * Great for brand detail pages, edit forms, showing brand info
   * Returns: isLoadingBrand, brand, errorBrand
   * Example: const { isLoadingBrand, brand } = useBrandsQueries.useById(5);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["brands", id],
      queryFn: () => brandsApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingBrand: query.isLoading,
      brand: query.data,
      errorBrand: query.error,
      isErrorBrand: query.isError,
      refetchBrand: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW BRAND HOOK
   * Handles adding a new brand to the database
   * Automatically refreshes the brands list after successful creation
   * Returns: isPendingBrands, createBrand, errorCreateBrand
   * Example: const { isPendingBrands, createBrand } = useBrandsQueries.useCreate({
   *            onSuccess: () => { setFormData({}); navigate('/brands'); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: brandsApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        toast.success("Brand created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to create brand: ${error.message}`);

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
      isPendingBrands: mutation.isPending,
      createBrand: mutation.mutate,
      errorCreateBrand: mutation.error,
      isErrorCreateBrand: mutation.isError,
      resetCreateBrand: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING BRAND HOOK
   * Changes information of an existing brand
   * Updates both the specific brand cache AND the full brands list
   * Returns: isPendingBrands, updateBrand, errorUpdateBrand
   * Example: const { isPendingBrands, updateBrand } = useBrandsQueries.useUpdate();
   *          updateBrand({id: 5, data: {name: "Apple Inc."}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => brandsApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["brands", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        toast.success(" Brand updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to update brand: ${error.message}`);

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
      isPendingBrands: mutation.isPending,
      updateBrand: mutation.mutate,
      errorUpdateBrand: mutation.error,
      isErrorUpdateBrand: mutation.isError,
      resetUpdateBrand: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE BRAND HOOK
   * Permanently removes a brand from database
   * Removes brand from cache and refreshes the brands list
   * Returns: isPendingBrands, deleteBrand, errorDeleteBrand
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingBrands, deleteBrand } = useBrandsQueries.useDelete();
   *          deleteBrand(brandId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: brandsApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["brands", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        toast.success(" Brand deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete brand: ${error.message}`);

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
      isPendingBrands: mutation.isPending,
      deleteBrand: mutation.mutate,
      errorDeleteBrand: mutation.error,
      isErrorDeleteBrand: mutation.isError,
      resetDeleteBrand: mutation.reset,
    };
  },
};

export default useBrands;
