import categoriesApi from "@/services/categoriesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCategories = {
  /**
   * 📂 GET ALL CATEGORIES HOOK
   * Returns pre-aliased properties: isLoadingCategories, categories
   * No more destructuring needed!
   * Example: const { isLoadingCategories, categories } = useCategoriesQueries.useAll();
   */
  useAll: (options = {}) => {
    const query = useQuery({
      queryKey: ["categories"],
      queryFn: categoriesApi.getAll,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      ...options,
    });

    return {
      // Pre-aliased for your exact naming pattern! 🎯
      isLoadingCategories: query.isLoading,
      categories: query.data,
      errorCategories: query.error,
      isErrorCategories: query.isError,
      refetchCategories: query.refetch,
      // Include original query object for advanced usage
      ...query,
    };
  },

  /**
   * 🎯 GET SINGLE CATEGORY HOOK
   * Returns: isLoadingCategory, category
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["categories", id],
      queryFn: () => categoriesApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingCategory: query.isLoading,
      category: query.data,
      errorCategory: query.error,
      isErrorCategory: query.isError,
      refetchCategory: query.refetch,
      ...query,
    };
  },

  /**
   * ➕ CREATE NEW CATEGORY HOOK
   * Returns: isPendingCategories, createCategory
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.create,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("✅ Category created successfully!");
        options.onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(`❌ Failed to create category: ${error.message}`);
        options.onError?.(error);
      },
      ...options,
    });

    return {
      // Your preferred naming pattern! 🎪
      isPendingCategories: mutation.isPending,
      createCategory: mutation.mutate,
      errorCreateCategory: mutation.error,
      isErrorCreateCategory: mutation.isError,
      resetCreateCategory: mutation.reset,
      // Include original mutation for advanced usage
      ...mutation,
    };
  },

  /**
   * ✏️ UPDATE EXISTING CATEGORY HOOK
   * Returns: isPendingCategories, updateCategory
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => categoriesApi.update(id, data),
      onSuccess: (data, variables) => {
        queryClient.setQueryData(["categories", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("✅ Category updated successfully!");
        options.onSuccess?.(data, variables);
      },
      onError: (error) => {
        toast.error(`❌ Failed to update category: ${error.message}`);
        options.onError?.(error);
      },
      ...options,
    });

    return {
      isPendingCategories: mutation.isPending,
      updateCategory: mutation.mutate,
      errorUpdateCategory: mutation.error,
      isErrorUpdateCategory: mutation.isError,
      resetUpdateCategory: mutation.reset,
      ...mutation,
    };
  },

  /**
   * 🗑️ DELETE CATEGORY HOOK
   * Returns: isPendingCategories, deleteCategory
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.delete,
      onSuccess: (data, deletedId) => {
        queryClient.removeQueries({ queryKey: ["categories", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("✅ Category deleted successfully!");
        options.onSuccess?.(data, deletedId);
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete category: ${error.message}`);
        options.onError?.(error);
      },
      ...options,
    });

    return {
      isPendingCategories: mutation.isPending,
      deleteCategory: mutation.mutate,
      errorDeleteCategory: mutation.error,
      isErrorDeleteCategory: mutation.isError,
      resetDeleteCategory: mutation.reset,
      ...mutation,
    };
  },
};

export default useCategories;
