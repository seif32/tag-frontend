import categoriesApi from "@/services/categoriesApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const useCategories = {
  /**
   * 📂 GET ALL CATEGORIES HOOK
   * Fetches the complete list of categories with nested subcategories
   * Perfect for your categories page, navigation, dropdowns
   * Returns: isLoadingCategories, categories, errorCategories
   * Example: const { isLoadingCategories, categories } = useCategory.useAll();
   */
  useAll: (queryParams = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["categories"],
      queryFn: () => categoriesApi.getAll(queryParams),
      staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      ...options,
    });

    return {
      isLoadingCategories: query.isLoading,
      categories: query.data,
      errorCategories: query.error,
      isErrorCategories: query.isError,
      refetchCategories: query.refetch,
    };
  },

  /**
   * 📊 GET CATEGORY STATS HOOK
   * Fetches statistics for your dashboard section
   * Returns: isLoadingStats, stats, errorStats
   * Example: const { isLoadingStats, stats } = useCategory.useStats();
   */
  useStats: (options = {}) => {
    const query = useQuery({
      queryKey: ["categories", "stats"],
      queryFn: categoriesApi.getStats,
      staleTime: 10 * 60 * 1000, // 10 minutes - stats change less frequently
      ...options,
    });

    return {
      isLoadingStats: query.isLoading,
      stats: query.data,
      errorStats: query.error,
      isErrorStats: query.isError,
      refetchStats: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE CATEGORY HOOK
   * Fetches details of one specific category using its ID
   * Great for category detail pages, edit forms
   * Returns: isLoadingCategory, category, errorCategory
   * Example: const { isLoadingCategory, category } = useCategory.useById(5);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["categories", id],
      queryFn: () => categoriesApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingCategory: query.isLoading,
      category: query.data,
      errorCategory: query.error,
      isErrorCategory: query.isError,
      refetchCategory: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW CATEGORY HOOK
   * Handles adding a new category to the database
   * Automatically refreshes the categories list and stats after successful creation
   * Returns: isPendingCreateCategory, createCategory, errorCreateCategory
   * Example: const { isPendingCreateCategory, createCategory } = useCategory.useCreate({
   *            onSuccess: () => { setFormData({}); navigate('/categories'); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Category created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(` Failed to create category: ${error.message}`);

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
      isPendingCreateCategory: mutation.isPending,
      createCategory: mutation.mutate,
      errorCreateCategory: mutation.error,
      isErrorCreateCategory: mutation.isError,
      resetCreateCategory: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING CATEGORY HOOK
   * Changes information of an existing category
   * Updates both the specific category cache AND the full categories list
   * Returns: isPendingUpdateCategory, updateCategory, errorUpdateCategory
   * Example: const { isPendingUpdateCategory, updateCategory } = useCategory.useUpdate();
   *          updateCategory({id: 5, data: {name: "Updated Electronics"}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => categoriesApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["categories", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Category updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(` Failed to update category: ${error.message}`);

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
      isPendingUpdateCategory: mutation.isPending,
      updateCategory: mutation.mutate,
      errorUpdateCategory: mutation.error,
      isErrorUpdateCategory: mutation.isError,
      resetUpdateCategory: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE CATEGORY HOOK
   * Permanently removes a category from database
   * Removes category from cache and refreshes the categories list
   * Returns: isPendingDeleteCategory, deleteCategory, errorDeleteCategory
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingDeleteCategory, deleteCategory } = useCategory.useDelete();
   *          deleteCategory(categoryId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["categories", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Category deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(` Failed to delete category: ${error.message}`);

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
      isPendingDeleteCategory: mutation.isPending,
      deleteCategory: mutation.mutate,
      errorDeleteCategory: mutation.error,
      isErrorDeleteCategory: mutation.isError,
      resetDeleteCategory: mutation.reset,
    };
  },

  // --------- Subcategory Hooks ---------

  /**
   * 📂 GET ALL SUBCATEGORIES HOOK
   * Fetches all subcategories in a flat list format
   * Perfect for your subcategory-focused table instead of nested transformation
   * Returns: isLoadingAllSubCategories, allSubCategories, errorAllSubCategories
   * Example: const { isLoadingAllSubCategories, allSubCategories } = useCategory.useAllSubCategories();
   */
  useAllSubCategories: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;

    const allParams = { ...queryParams, limit, page };

    const query = useQuery({
      queryKey: ["subcategories", "all", allParams],
      queryFn: () => categoriesApi.getAllSubCategories(allParams),
      staleTime: 5 * 60 * 1000, // 5 minutes - subcategories don't change often
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      ...options,
    });

    return {
      isLoadingAllSubCategories: query.isLoading,
      allSubCategories: query.data,
      errorAllSubCategories: query.error,
      isErrorAllSubCategories: query.isError,
      refetchAllSubCategories: query.refetch,
    };
  },

  /**
   * 🎯 GET SUBCATEGORIES BY CATEGORY ID HOOK
   * Fetches all subcategories for a specific parent category
   * Perfect for category-specific subcategory management
   * Returns: isLoadingSubCategories, subcategories, errorSubCategories
   * Example: const { isLoadingSubCategories, subcategories } = useCategory.useSubCategoriesByCategoryId(1);
   */
  useSubCategoriesByCategoryId: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["subcategories", id],
      queryFn: () => categoriesApi.getSubCategoriesByCategoryId(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingSubCategories: query.isLoading,
      subcategories: query.data,
      errorSubCategories: query.error,
      isErrorSubCategories: query.isError,
      refetchSubCategories: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW SUBCATEGORY HOOK
   * Handles adding a new subcategory under a parent category
   * Automatically refreshes the categories list after successful creation
   * Returns: isPendingCreateSubCategory, createSubCategory, errorCreateSubCategory
   * Example: const { isPendingCreateSubCategory, createSubCategory } = useCategory.useCreateSubCategory({
   *            onSuccess: () => { setFormData({}); }
   *          });
   */
  useCreateSubCategory: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.createSubCategory,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Subcategory created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(` Failed to create subcategory: ${error.message}`);

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
      isPendingCreateSubCategory: mutation.isPending,
      createSubCategory: mutation.mutate,
      errorCreateSubCategory: mutation.error,
      isErrorCreateSubCategory: mutation.isError,
      resetCreateSubCategory: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING SUBCATEGORY HOOK
   * Changes information of an existing subcategory
   * Updates both the specific subcategory cache AND the full categories list
   * Returns: isPendingUpdateSubCategory, updateSubCategory, errorUpdateSubCategory
   * Example: const { isPendingUpdateSubCategory, updateSubCategory } = useCategory.useUpdateSubCategory();
   *          updateSubCategory({id: 5, data: {name: "Mobile Phones"}});
   */
  useUpdateSubCategory: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => categoriesApi.updateSubCategory(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["subcategories", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Subcategory updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(` Failed to update subcategory: ${error.message}`);

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
      isPendingUpdateSubCategory: mutation.isPending,
      updateSubCategory: mutation.mutate,
      errorUpdateSubCategory: mutation.error,
      isErrorUpdateSubCategory: mutation.isError,
      resetUpdateSubCategory: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE SUBCATEGORY HOOK
   * Permanently removes a subcategory from database
   * Removes subcategory from cache and refreshes the categories list
   * Returns: isPendingDeleteSubCategory, deleteSubCategory, errorDeleteSubCategory
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingDeleteSubCategory, deleteSubCategory } = useCategory.useDeleteSubCategory();
   *          deleteSubCategory(subCategoryId);
   */
  useDeleteSubCategory: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: categoriesApi.deleteSubCategory,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["subcategories", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["categories", "stats"] });
        toast.success(" Subcategory deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(` Failed to delete subcategory: ${error.message}`);

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
      isPendingDeleteSubCategory: mutation.isPending,
      deleteSubCategory: mutation.mutate,
      errorDeleteSubCategory: mutation.error,
      isErrorDeleteSubCategory: mutation.isError,
      resetDeleteSubCategory: mutation.reset,
    };
  },
};

export default useCategories;
