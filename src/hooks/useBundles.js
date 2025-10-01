import bundlesApi from "@/services/bundlesApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const useBundles = {
  /**
   * 📂 GET ALL BUNDLES HOOK
   * Fetches bundles with pagination support and full details
   * Perfect for admin dashboards, bundle management pages
   * Returns: isLoadingBundles, bundles, errorBundles
   * Example: const { isLoadingBundles, bundles } = useBundles.useAll({page: 1, limit: 10});
   */
  useAll: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || queryParams.page;
    const limit = parseInt(searchParams.get("limit")) || queryParams.limit;

    const mergedFilters = {
      ...queryParams,
      page,
      limit,
    };

    const query = useQuery({
      queryKey: ["bundles", "all", mergedFilters],
      queryFn: () => bundlesApi.getAll(mergedFilters),
      staleTime: 2 * 60 * 1000, // 2 minutes - bundles don't change frequently
      cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
      keepPreviousData: true,
      ...options,
    });

    return {
      isLoadingBundles: query.isLoading,
      bundles: query.data,
      errorBundles: query.error,
      isErrorBundles: query.isError,
      refetchBundles: query.refetch,
      isFetchingBundles: query.isFetching,
      isPreviousData: query.isPreviousData,
    };
  },

  /**
   * 🎯 GET SINGLE BUNDLE HOOK
   * Fetches complete bundle details with product and variant information
   * Great for bundle detail pages, admin bundle management
   * Returns: isLoadingBundle, bundle, errorBundle
   * Example: const { isLoadingBundle, bundle } = useBundles.useById(123);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["bundles", id],
      queryFn: () => bundlesApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 3 * 60 * 1000, // 3 minutes
      ...options,
    });

    return {
      isLoadingBundle: query.isLoading,
      bundle: query.data,
      errorBundle: query.error,
      isErrorBundle: query.isError,
      refetchBundle: query.refetch,
    };
  },

  /**
   * 🔎 GET BUNDLES BY PRODUCT ID HOOK
   * Use: const { bundlesByProduct } = useBundles.useByProductId(34);
   */
  useByProductId: (productId, queryParams = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["bundles", "product_id", productId, queryParams],
      queryFn: () => bundlesApi.getByProductId(productId, queryParams),
      enabled: !!productId,
      staleTime: 3 * 60 * 1000,
      ...options,
    });
    return {
      isLoadingBundlesByProduct: query.isLoading,
      bundlesByProduct: query.data,
      errorBundlesByProduct: query.error,
      isErrorBundlesByProduct: query.isError,
      refetchBundlesByProduct: query.refetch,
    };
  },

  /**
   * 📊 GET BUNDLE STATISTICS HOOK
   * Fetches aggregate statistics for bundle dashboard cards
   * Returns: isLoadingBundleStats, bundleStats, errorBundleStats
   * Example: const { isLoadingBundleStats, bundleStats } = useBundles.useStatistics();
   */
  useStatistics: (options = {}) => {
    const query = useQuery({
      queryKey: ["bundles", "statistics"],
      queryFn: bundlesApi.getStatistics,
      staleTime: 10 * 60 * 1000, // 10 min
      ...options,
    });

    return {
      isLoadingBundleStats: query.isLoading,
      bundleStats: query.data,
      errorBundleStats: query.error,
      isErrorBundleStats: query.isError,
      refetchBundleStats: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW BUNDLE HOOK
   * Handles creating a new bundle with variant and pricing details
   * Automatically refreshes relevant bundle lists after successful creation
   * Returns: isPendingBundles, createBundle, errorCreateBundle
   * Example: const { isPendingBundles, createBundle } = useBundles.useCreate({
   *            onSuccess: (bundle) => { navigate(`/bundles/${bundle.id}`); }
   *          });
   */
  useCreate: (productId, options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: bundlesApi.create,
      onSuccess: (data, variables) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["bundles"], type: "all" });
        queryClient.invalidateQueries({ queryKey: ["products", productId] });

        // queryKey: ["products", productId],

        toast.success("Bundle created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to create bundle: ${error.message}`);

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
      isPendingBundles: mutation.isPending,
      createBundle: mutation.mutate,
      createBundleAsync: mutation.mutateAsync,
      errorCreateBundle: mutation.error,
      isErrorCreateBundle: mutation.isError,
      resetCreateBundle: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING BUNDLE HOOK
   * Changes bundle information (quantity, pricing, status, etc.)
   * Updates both the specific bundle cache AND the bundles list
   * Returns: isPendingBundles, updateBundle, errorUpdateBundle
   * Example: const { isPendingBundles, updateBundle } = useBundles.useUpdate();
   *          updateBundle({id: 123, data: {quantity: 10, is_active: false}});
   */
  useUpdate: (productId, options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => bundlesApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["bundles", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["bundles"] });
        queryClient.invalidateQueries({
          queryKey: ["products", productId],
        });
        toast.success("Bundle updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`Failed to update bundle: ${error.message}`);

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
      isPendingBundles: mutation.isPending,
      updateBundle: mutation.mutate,
      errorUpdateBundle: mutation.error,
      isErrorUpdateBundle: mutation.isError,
      resetUpdateBundle: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE BUNDLE HOOK
   * Removes a bundle from the system
   * Updates cache and shows user feedback
   * Returns: isPendingDelete, deleteBundle, errorDeleteBundle
   * Example: const { isPendingDelete, deleteBundle } = useBundles.useDelete();
   *          deleteBundle(123);
   */
  useDelete: (productId, options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: bundlesApi.delete,
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.invalidateQueries({ queryKey: ["bundles"] });
        queryClient.invalidateQueries({
          queryKey: ["products", productId],
        });
        toast.success("Bundle deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete bundle: ${error.message}`);

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
      isPendingDelete: mutation.isPending,
      deleteBundle: mutation.mutate,
      errorDeleteBundle: mutation.error,
      isErrorDeleteBundle: mutation.isError,
      resetDeleteBundle: mutation.reset,
    };
  },
};

export default useBundles;
