import addressApi from "@/services/addressApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useAddress = {
  /**
   * 📂 GET USER ADDRESSES HOOK
   * Fetches addresses for a specific user with pagination support
   * Perfect for user profile pages, checkout address selection
   * Returns: isLoadingAddresses, addresses, errorAddresses
   * Example: const { isLoadingAddresses, addresses } = useAddresses.useByUserId(123, {page: 1, limit: 5});
   */
  useByUserId: (userId, queryParams = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["addresses", "user", userId, queryParams],
      queryFn: () => addressApi.getByUserId(userId, queryParams),
      enabled: !!userId, // Only run if userId exists
      staleTime: 3 * 60 * 1000, // 3 minutes - addresses change occasionally
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      ...options,
    });

    return {
      isLoadingAddresses: query.isLoading,
      addresses: query.data,
      errorAddresses: query.error,
      isErrorAddresses: query.isError,
      refetchAddresses: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE ADDRESS HOOK
   * Fetches details of one specific address using its ID
   * Great for address detail pages, edit forms, showing address info
   * Returns: isLoadingAddress, address, errorAddress
   * Example: const { isLoadingAddress, address } = useAddresses.useById(5);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["addresses", id],
      queryFn: () => addressApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 5 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingAddress: query.isLoading,
      address: query.data,
      errorAddress: query.error,
      isErrorAddress: query.isError,
      refetchAddress: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW ADDRESS HOOK
   * Handles adding a new address to the database
   * Automatically refreshes the user's address list after successful creation
   * Returns: isPendingAddresses, createAddress, errorCreateAddress
   * Example: const { isPendingAddresses, createAddress } = useAddresses.useCreate({
   *            onSuccess: () => { setFormData({}); navigate('/addresses'); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: addressApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        // toast.success("Address created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to create address: ${error.message}`);

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
      isPendingAddresses: mutation.isPending,
      createAddress: mutation.mutate,
      createAddressAsync: mutation.mutateAsync,
      errorCreateAddress: mutation.error,
      isErrorCreateAddress: mutation.isError,
      resetCreateAddress: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING ADDRESS HOOK
   * Changes information of an existing address
   * Updates both the specific address cache AND the user's address list
   * Returns: isPendingAddresses, updateAddress, errorUpdateAddress
   * Example: const { isPendingAddresses, updateAddress } = useAddresses.useUpdate();
   *          updateAddress({id: 5, data: {street_address: "123 New St"}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => addressApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["addresses", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        toast.success("Address updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`Failed to update address: ${error.message}`);

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
      isPendingAddresses: mutation.isPending,
      updateAddress: mutation.mutate,
      updateAddressAsync: mutation.mutateAsync,
      errorUpdateAddress: mutation.error,
      isErrorUpdateAddress: mutation.isError,
      resetUpdateAddress: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE ADDRESS HOOK
   * Permanently removes an address from database
   * Removes address from cache and refreshes the user's address list
   * Returns: isPendingAddresses, deleteAddress, errorDeleteAddress
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingAddresses, deleteAddress } = useAddresses.useDelete();
   *          deleteAddress(addressId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: addressApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["addresses", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        toast.success("Address deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete address: ${error.message}`);

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
      isPendingAddresses: mutation.isPending,
      deleteAddress: mutation.mutate,
      errorDeleteAddress: mutation.error,
      isErrorDeleteAddress: mutation.isError,
      resetDeleteAddress: mutation.reset,
    };
  },
};

export default useAddress;
