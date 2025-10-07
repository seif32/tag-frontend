import tagsApi from "@/services/tagsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useTags = {
  /**
   * 📂 GET ALL TAGS HOOK
   * Fetches the complete list of all tags in the system
   * Perfect for global tag management, admin overviews, comprehensive tag selection
   * Returns: isLoadingTags, tags, errorTags
   * Example: const { isLoadingTags, tags } = useTags.useAll();
   */
  useAll: (queryParams = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["tags", queryParams],
      queryFn: () => tagsApi.getAll(queryParams),
      staleTime: 10 * 60 * 1000, // 10 minutes - tags change less frequently than products
      cacheTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
      ...options,
    });

    return {
      isLoadingTags: query.isLoading,
      tags: query.data,
      errorTags: query.error,
      isErrorTags: query.isError,
      refetchTags: query.refetch,
    };
  },

  /**
   * 🎯 GET TAGS BY CATEGORY HOOK
   * Fetches tags filtered by specific category ID
   * Essential for category-specific tag selection in product forms
   * Returns: isLoadingCategoryTags, categoryTags, errorCategoryTags
   * Example: const { isLoadingCategoryTags, categoryTags } = useTags.useByCategoryId(12);
   */
  useByCategoryId: (categoryId, options = {}) => {
    const query = useQuery({
      queryKey: ["tags", "category", categoryId],
      queryFn: () => tagsApi.getByCategoryId(categoryId),
      enabled: !!categoryId, // Only run if categoryId exists
      staleTime: 8 * 60 * 1000, // 8 minutes - category tags are fairly stable
      cacheTime: 12 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingCategoryTags: query.isLoading,
      categoryTags: query.data,
      errorCategoryTags: query.error,
      isErrorCategoryTags: query.isError,
      refetchCategoryTags: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW TAG HOOK
   * Handles adding a new tag to the system
   * Automatically refreshes relevant tag lists after successful creation
   * Returns: isPendingTag, createTag, errorCreateTag
   * Example: const { isPendingTag, createTag } = useTags.useCreate({
   *            onSuccess: () => { setFormData({}); closeModal(); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: tagsApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["tags"] });

        // If the tag has a category, also refresh category-specific tags
        if (data.categoryId) {
          queryClient.invalidateQueries({
            queryKey: ["tags", "category", data.categoryId],
          });
        }

        toast.success("Tag created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to create tag: ${error.message}`);

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
      isPendingTag: mutation.isPending,
      createTag: mutation.mutate,
      errorCreateTag: mutation.error,
      isErrorCreateTag: mutation.isError,
      resetCreateTag: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING TAG HOOK
   * Changes information of an existing tag
   * Updates cache strategically based on what changed
   * Returns: isPendingTag, updateTag, errorUpdateTag
   * Example: const { isPendingTag, updateTag } = useTags.useUpdate();
   *          updateTag({id: 5, data: {name: "Premium Quality"}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => tagsApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.invalidateQueries({ queryKey: ["tags"] });

        // If category changed, refresh both old and new category caches
        if (variables.data.categoryId) {
          queryClient.invalidateQueries({ queryKey: ["tags", "category"] });
        }

        toast.success("Tag updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to update tag: ${error.message}`);

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
      isPendingTag: mutation.isPending,
      updateTag: mutation.mutate,
      errorUpdateTag: mutation.error,
      isErrorUpdateTag: mutation.isError,
      resetUpdateTag: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE TAG HOOK
   * Permanently removes a tag from the system
   * WARNING: Also removes tag from ALL products - use with caution!
   * Returns: isPendingTag, deleteTag, errorDeleteTag
   * Example: const { isPendingTag, deleteTag } = useTags.useDelete();
   *          deleteTag(tagId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: tagsApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.invalidateQueries({ queryKey: ["tags"] });
        // Also refresh product queries since products might have had this tag
        queryClient.invalidateQueries({ queryKey: ["products"] });

        toast.success("Tag deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete tag: ${error.message}`);

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
      isPendingTag: mutation.isPending,
      deleteTag: mutation.mutate,
      errorDeleteTag: mutation.error,
      isErrorDeleteTag: mutation.isError,
      resetDeleteTag: mutation.reset,
    };
  },

  /**
   * 🔗 ADD TAG TO PRODUCT HOOK
   * Associates a tag with a specific product
   * Essential for product tagging functionality in your admin
   * Returns: isPendingProductTag, addTagToProduct, errorAddTagToProduct
   * Example: const { isPendingProductTag, addTagToProduct } = useTags.useAddToProduct();
   *          addTagToProduct({productId: 123, tagId: 5});
   */
  useAddToProduct: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: tagsApi.addToProduct,
      onSuccess: (data, variables) => {
        // Refresh product data to show new tag association
        queryClient.invalidateQueries({
          queryKey: ["products", variables.productId],
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });

        toast.success("Tag added to product successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to add tag to product: ${error.message}`);

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
      isPendingProductTag: mutation.isPending,
      addTagToProduct: mutation.mutate,
      errorAddTagToProduct: mutation.error,
      isErrorAddTagToProduct: mutation.isError,
      resetAddTagToProduct: mutation.reset,
    };
  },

  /**
   * 🔓 REMOVE TAG FROM PRODUCT HOOK
   * Removes the association between a tag and a product
   * Keeps both tag and product, just breaks the relationship
   * Returns: isPendingProductTag, removeTagFromProduct, errorRemoveTagFromProduct
   * Example: const { isPendingProductTag, removeTagFromProduct } = useTags.useRemoveFromProduct();
   *          removeTagFromProduct({productId: 123, tagId: 5});
   */
  useRemoveFromProduct: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ productId, tagId }) =>
        tagsApi.removeFromProduct(productId, tagId),
      onSuccess: (data, variables) => {
        // Refresh product data to remove tag association
        queryClient.invalidateQueries({
          queryKey: ["products", variables.productId],
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });

        toast.success("Tag removed from product successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to remove tag from product: ${error.message}`);

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
      isPendingProductTag: mutation.isPending,
      removeTagFromProduct: mutation.mutate,
      errorRemoveTagFromProduct: mutation.error,
      isErrorRemoveTagFromProduct: mutation.isError,
      resetRemoveTagFromProduct: mutation.reset,
    };
  },
};

export default useTags;
