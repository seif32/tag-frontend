import promoCodeApi from "@/services/promoCodeApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const usePromoCode = {
  /**
   * 📂 GET ALL PROMO CODES HOOK
   * Fetches promo codes with pagination support
   * Perfect for admin dashboards, promo code management
   * Returns: isLoadingPromoCodes, promoCodes, errorPromoCodes
   * Example: const { isLoadingPromoCodes, promoCodes } = usePromoCodes.useAll({page: 1, limit: 10});
   */
  useAll: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const status = searchParams.get("status") || "";
    const allQueryParams = { ...queryParams, limit, status, page };

    const query = useQuery({
      queryKey: ["promoCodes", "all", allQueryParams],
      queryFn: () => promoCodeApi.getAll(allQueryParams),
      staleTime: 5 * 60 * 1000, // 5 minutes - promo codes don't change often
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      ...options,
    });

    return {
      isLoadingPromoCodes: query.isLoading,
      promoCodes: query.data,
      errorPromoCodes: query.error,
      isErrorPromoCodes: query.isError,
      refetchPromoCodes: query.refetch,
    };
  },

  /**
   * 🎯 GET PROMO CODE BY ID HOOK
   * Fetches promo code details using its unique ID
   * Great for admin edit forms, promo code management
   * Returns: isLoadingPromoCode, promoCode, errorPromoCode
   * Example: const { isLoadingPromoCode, promoCode } = usePromoCodes.useById(123);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["promoCodes", "id", id],
      queryFn: () => promoCodeApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingPromoCode: query.isLoading,
      promoCode: query.data,
      errorPromoCode: query.error,
      isErrorPromoCode: query.isError,
      refetchPromoCode: query.refetch,
    };
  },

  /**
   * 🔍 GET PROMO CODE BY CODE HOOK
   * Fetches promo code details using the actual code string
   * Perfect for checkout validation, applying discounts in cart
   * Returns: isLoadingPromoCode, promoCode, errorPromoCode
   * Example: const { isLoadingPromoCode, promoCode } = usePromoCodes.useByCode("SAVE20");
   */
  useByCode: (code, options = {}) => {
    const query = useQuery({
      queryKey: ["promoCodes", "code", code],
      queryFn: () => promoCodeApi.getByCode(code),
      enabled: !!code, // Only run if code exists
      staleTime: 2 * 60 * 1000, // 2 minutes - for active validation
      retry: false, // Don't retry failed promo code validations
      ...options,
    });

    return {
      isLoadingPromoCode: query.isLoading,
      promoCode: query.data,
      errorPromoCode: query.error,
      isErrorPromoCode: query.isError,
      refetchPromoCode: query.refetch,
    };
  },

  /**
   * ✅ CHECK PROMO CODE EXISTS HOOK
   * Validates if a promo code already exists (for creation forms)
   * Returns: isLoadingExists, exists, errorExists
   * Example: const { isLoadingExists, exists } = usePromoCodes.useCheckExists("SAVE20");
   */
  useCheckExists: (code, options = {}) => {
    const query = useQuery({
      queryKey: ["promoCodes", "exists", code],
      queryFn: () => promoCodeApi.checkExists(code),
      enabled: !!code && code.length >= 3, // Only check codes with 3+ characters
      staleTime: 1 * 60 * 1000, // 1 minute
      retry: false,
      ...options,
    });

    return {
      isLoadingExists: query.isLoading,
      exists: query.data?.exists,
      errorExists: query.error,
      isErrorExists: query.isError,
    };
  },

  /**
   * ➕ CREATE NEW PROMO CODE HOOK
   * Handles creating a new promo code
   * Automatically refreshes the promo codes list after successful creation
   * Returns: isPendingPromoCodes, createPromoCode, errorCreatePromoCode
   * Example: const { isPendingPromoCodes, createPromoCode } = usePromoCodes.useCreate({
   *            onSuccess: () => { setFormData({}); navigate('/promo-codes'); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: promoCodeApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
        toast.success("🎫 Promo code created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to create promo code: ${error.message}`);

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
      isPendingPromoCodes: mutation.isPending,
      createPromoCode: mutation.mutate,
      errorCreatePromoCode: mutation.error,
      isErrorCreatePromoCode: mutation.isError,
      resetCreatePromoCode: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING PROMO CODE HOOK
   * Changes promo code information (discount, expiry, status, etc.)
   * Updates both the specific promo code cache AND the promo codes list
   * Returns: isPendingPromoCodes, updatePromoCode, errorUpdatePromoCode
   * Example: const { isPendingPromoCodes, updatePromoCode } = usePromoCodes.useUpdate();
   *          updatePromoCode({id: 123, data: {discount_value: 25}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => promoCodeApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["promoCodes", "id", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
        toast.success("🎫 Promo code updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to update promo code: ${error.message}`);

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
      isPendingPromoCodes: mutation.isPending,
      updatePromoCode: mutation.mutate,
      errorUpdatePromoCode: mutation.error,
      isErrorUpdatePromoCode: mutation.isError,
      resetUpdatePromoCode: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE PROMO CODE HOOK
   * Permanently removes a promo code from database
   * Removes promo code from cache and refreshes the promo codes list
   * Returns: isPendingPromoCodes, deletePromoCode, errorDeletePromoCode
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingPromoCodes, deletePromoCode } = usePromoCodes.useDelete();
   *          deletePromoCode(promoCodeId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: promoCodeApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({
          queryKey: ["promoCodes", "id", deletedId],
        });
        queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
        toast.success("🎫 Promo code deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`❌ Failed to delete promo code: ${error.message}`);

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
      isPendingPromoCodes: mutation.isPending,
      deletePromoCode: mutation.mutate,
      errorDeletePromoCode: mutation.error,
      isErrorDeletePromoCode: mutation.isError,
      resetDeletePromoCode: mutation.reset,
    };
  },
};

export default usePromoCode;
