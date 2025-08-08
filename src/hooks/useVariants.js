import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import variantTypesApi from "../../../services/variantTypesApi";
import { toast } from "sonner";

const useVariants = {
  // 🏷️ ===== VARIANT TYPES HOOKS (High Level Management) =====

  /**
   * 📂 GET ALL VARIANT TYPES HOOK
   * Fetches all variant types for admin management and product creation
   * Perfect for variant type dropdowns, admin lists, system setup
   * Returns: isLoadingVariantTypes, variantTypes, errorVariantTypes
   * Example: const { isLoadingVariantTypes, variantTypes } = useVariantTypesQueries.useAllTypes();
   */
  useAllTypes: (options = {}) => {
    const query = useQuery({
      queryKey: ["variant-types"],
      queryFn: variantTypesApi.getAllTypes,
      staleTime: 10 * 60 * 1000, // 10 minutes - variant types change rarely
      cacheTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
      ...options,
    });

    return {
      isLoadingVariantTypes: query.isLoading,
      variantTypes: query.data,
      errorVariantTypes: query.error,
      isErrorVariantTypes: query.isError,
      refetchVariantTypes: query.refetch,
      ...query,
    };
  },

  /**
   * ➕ CREATE VARIANT TYPE HOOK
   * Creates new variant types like "Material", "Finish", etc.
   * Automatically refreshes variant types list after creation
   * Returns: isPendingVariantTypes, createVariantType, errorCreateVariantType
   * Example: const { isPendingVariantTypes, createVariantType } = useVariantTypesQueries.useCreateType();
   */
  useCreateType: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: variantTypesApi.createType,
      onSuccess: (data) => {
        // Built-in functionality - refresh the types list
        queryClient.invalidateQueries({ queryKey: ["variant-types"] });
        toast.success("✅ Variant type created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to create variant type: ${error.message}`);

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
      isPendingVariantTypes: mutation.isPending,
      createVariantType: mutation.mutate,
      errorCreateVariantType: mutation.error,
      isErrorCreateVariantType: mutation.isError,
      resetCreateVariantType: mutation.reset,
      ...mutation,
    };
  },

  /**
   * ✏️ UPDATE VARIANT TYPE HOOK
   * Updates variant type names and properties
   * Refreshes both specific type cache and the types list
   * Returns: isPendingVariantTypes, updateVariantType, errorUpdateVariantType
   */
  useUpdateType: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => variantTypesApi.updateType(id, data),
      onSuccess: (data, variables) => {
        // Refresh the types list
        queryClient.invalidateQueries({ queryKey: ["variant-types"] });
        // Also invalidate values for this type since relationship might change
        queryClient.invalidateQueries({
          queryKey: ["variant-values", variables.id],
        });

        toast.success("✅ Variant type updated successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to update variant type: ${error.message}`);

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
      isPendingVariantTypes: mutation.isPending,
      updateVariantType: mutation.mutate,
      errorUpdateVariantType: mutation.error,
      isErrorUpdateVariantType: mutation.isError,
      resetUpdateVariantType: mutation.reset,
      ...mutation,
    };
  },

  /**
   * 🗑️ DELETE VARIANT TYPE HOOK
   * Deletes variant types and all their associated values
   * WARNING: This is a destructive operation that removes all values too!
   * Returns: isPendingVariantTypes, deleteVariantType, errorDeleteVariantType
   */
  useDeleteType: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: variantTypesApi.deleteType,
      onSuccess: (data, deletedId) => {
        // Remove from types list
        queryClient.invalidateQueries({ queryKey: ["variant-types"] });
        // Remove values cache for this type
        queryClient.removeQueries({ queryKey: ["variant-values", deletedId] });
        // Remove from all values list too
        queryClient.invalidateQueries({ queryKey: ["variant-values"] });

        toast.success("✅ Variant type deleted successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete variant type: ${error.message}`);

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
      isPendingVariantTypes: mutation.isPending,
      deleteVariantType: mutation.mutate,
      errorDeleteVariantType: mutation.error,
      isErrorDeleteVariantType: mutation.isError,
      resetDeleteVariantType: mutation.reset,
      ...mutation,
    };
  },

  // 🎨 ===== VARIANT VALUES HOOKS (Granular Management) =====

  /**
   * 📊 GET ALL VARIANT VALUES HOOK
   * Fetches all variant values across all types
   * Useful for global management and search functionality
   * Returns: isLoadingVariantValues, variantValues, errorVariantValues
   */
  useAllValues: (options = {}) => {
    const query = useQuery({
      queryKey: ["variant-values"],
      queryFn: variantTypesApi.getAllValues,
      staleTime: 5 * 60 * 1000, // 5 minutes - values change more frequently
      cacheTime: 10 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingVariantValues: query.isLoading,
      variantValues: query.data,
      errorVariantValues: query.error,
      isErrorVariantValues: query.isError,
      refetchVariantValues: query.refetch,
      ...query,
    };
  },

  /**
   * 🎯 GET VALUES BY VARIANT TYPE HOOK
   * Fetches values for a specific variant type (like all colors or all sizes)
   * Perfect for populating dropdowns and type-specific management
   * Returns: isLoadingVariantValues, variantValues, errorVariantValues
   * Example: const { variantValues } = useVariantTypesQueries.useValuesByType(colorTypeId);
   */
  useValuesByType: (variantTypeId, options = {}) => {
    const query = useQuery({
      queryKey: ["variant-values", variantTypeId],
      queryFn: () => variantTypesApi.getValuesByTypeId(variantTypeId),
      enabled: !!variantTypeId, // Only run if we have a variant type ID
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingVariantValues: query.isLoading,
      variantValues: query.data,
      errorVariantValues: query.error,
      isErrorVariantValues: query.isError,
      refetchVariantValues: query.refetch,
      ...query,
    };
  },

  /**
   * ➕ CREATE MULTIPLE VALUES HOOK
   * Adds multiple values to a variant type in bulk
   * Perfect for initial setup and batch operations
   * Returns: isPendingVariantValues, createManyValues, errorCreateManyValues
   * Example: createManyValues({variant_type_id: 1, values: ["Red", "Blue", "Green"]})
   */
  useCreateManyValues: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: variantTypesApi.createManyValues,
      onSuccess: (data, variables) => {
        // Refresh values for this specific type
        queryClient.invalidateQueries({
          queryKey: ["variant-values", variables.variant_type_id],
        });
        // Also refresh all values list
        queryClient.invalidateQueries({ queryKey: ["variant-values"] });

        toast.success(
          `✅ Added ${variables.values.length} variant values successfully!`
        );

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to create variant values: ${error.message}`);

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
      isPendingVariantValues: mutation.isPending,
      createManyValues: mutation.mutate,
      errorCreateManyValues: mutation.error,
      isErrorCreateManyValues: mutation.isError,
      resetCreateManyValues: mutation.reset,
      ...mutation,
    };
  },

  /**
   * ✏️ UPDATE SINGLE VALUE HOOK
   * Updates a specific variant value
   * Can change the value text or move it to different variant type
   * Returns: isPendingVariantValues, updateValue, errorUpdateValue
   */
  useUpdateValue: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => variantTypesApi.updateValue(id, data),
      onSuccess: (data, variables) => {
        // Refresh the values list for the old type
        if (variables.data.variant_type_id) {
          queryClient.invalidateQueries({
            queryKey: ["variant-values", variables.data.variant_type_id],
          });
        }
        // Refresh all values list
        queryClient.invalidateQueries({ queryKey: ["variant-values"] });

        toast.success("✅ Variant value updated successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to update variant value: ${error.message}`);

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
      isPendingVariantValues: mutation.isPending,
      updateValue: mutation.mutate,
      errorUpdateValue: mutation.error,
      isErrorUpdateValue: mutation.isError,
      resetUpdateValue: mutation.reset,
      ...mutation,
    };
  },

  /**
   * 🗑️ DELETE SINGLE VALUE HOOK
   * Removes a specific variant value
   * Updates all relevant caches automatically
   * Returns: isPendingVariantValues, deleteValue, errorDeleteValue
   */
  useDeleteValue: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: variantTypesApi.deleteValue,
      onSuccess: (data, deletedId) => {
        // Refresh all values (we don't know which type it belonged to)
        queryClient.invalidateQueries({ queryKey: ["variant-values"] });
        // Also refresh individual type caches
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "variant-values" &&
            typeof query.queryKey[1] === "number",
        });

        toast.success("✅ Variant value deleted successfully!");

        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete variant value: ${error.message}`);

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
      isPendingVariantValues: mutation.isPending,
      deleteValue: mutation.mutate,
      errorDeleteValue: mutation.error,
      isErrorDeleteValue: mutation.isError,
      resetDeleteValue: mutation.reset,
      ...mutation,
    };
  },
};

export default useVariants;
