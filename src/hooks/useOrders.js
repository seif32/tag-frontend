import ordersApi from "@/services/ordersApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useOrders = {
  /**
   * 📂 GET ALL ORDERS HOOK
   * Fetches orders with pagination support and full details
   * Perfect for admin dashboards, order management pages
   * Returns: isLoadingOrders, orders, errorOrders
   * Example: const { isLoadingOrders, orders } = useOrders.useAll({page: 1, limit: 10});
   */
  useAll: (queryParams = {}, options = {}) => {
    const query = useQuery({
      queryKey: ["orders", "all", queryParams],
      queryFn: () => ordersApi.getAll(queryParams),
      staleTime: 2 * 60 * 1000, // 2 minutes - orders change frequently
      cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
      ...options,
    });

    return {
      isLoadingOrders: query.isLoading,
      orders: query.data,
      errorOrders: query.error,
      isErrorOrders: query.isError,
      refetchOrders: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE ORDER HOOK
   * Fetches complete order details with items and product information
   * Great for order detail pages, admin order management
   * Returns: isLoadingOrder, order, errorOrder
   * Example: const { isLoadingOrder, order } = useOrders.useById(123);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["orders", id],
      queryFn: () => ordersApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 3 * 60 * 1000, // 3 minutes
      ...options,
    });

    return {
      isLoadingOrder: query.isLoading,
      order: query.data,
      errorOrder: query.error,
      isErrorOrder: query.isError,
      refetchOrder: query.refetch,
    };
  },

  /**
   * 👤 GET USER ORDERS HOOK
   * Fetches all orders for a specific user
   * Perfect for user profiles, order history, customer dashboards
   * Returns: isLoadingUserOrders, userOrders, errorUserOrders
   * Example: const { isLoadingUserOrders, userOrders } = useOrders.useByUserId(456);
   */
  useByUserId: (userId, options = {}) => {
    const { page = 1, limit = 10, ...queryOptions } = options;

    const query = useQuery({
      queryKey: ["orders", "user", userId, { page, limit }],
      queryFn: () => ordersApi.getByUserId(userId, { page, limit }),
      enabled: !!userId,
      staleTime: 2 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      keepPreviousData: true,
      ...queryOptions,
    });

    return {
      isLoadingUserOrders: query.isLoading,
      userOrders: query.data,
      errorUserOrders: query.error,
      isErrorUserOrders: query.isError,
      refetchUserOrders: query.refetch,
      isFetchingUserOrders: query.isFetching,
      isPreviousData: query.isPreviousData,
    };
  },

  /**
   * ➕ CREATE NEW ORDER HOOK
   * Handles creating a complete order with items in a single transaction
   * Automatically refreshes relevant order lists after successful creation
   * Returns: isPendingOrders, createOrder, errorCreateOrder
   * Example: const { isPendingOrders, createOrder } = useOrders.useCreate({
   *            onSuccess: (order) => { navigate(`/orders/${order.id}`); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ordersApi.create,
      onSuccess: (data, variables) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["orders"], type: "all" });

        toast.success("Order created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["products"],
          type: "all",
        });

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to create order: ${error.message}`);

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
      isPendingOrders: mutation.isPending,
      createOrder: mutation.mutate,
      createOrderAsync: mutation.mutateAsync,
      errorCreateOrder: mutation.error,
      isErrorCreateOrder: mutation.isError,
      resetCreateOrder: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING ORDER HOOK
   * Changes order information (status, shipping details, etc.)
   * Updates both the specific order cache AND the orders list
   * Returns: isPendingOrders, updateOrder, errorUpdateOrder
   * Example: const { isPendingOrders, updateOrder } = useOrders.useUpdate();
   *          updateOrder({id: 123, data: {status: 'shipped', tracking_number: 'TRACK123'}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => ordersApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["orders", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("Order updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`Failed to update order: ${error.message}`);

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
      isPendingOrders: mutation.isPending,
      updateOrder: mutation.mutate,
      errorUpdateOrder: mutation.error,
      isErrorUpdateOrder: mutation.isError,
      resetUpdateOrder: mutation.reset,
    };
  },
};

export default useOrders;
