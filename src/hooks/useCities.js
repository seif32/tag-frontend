import citiesApi from "@/services/citiesApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const useCities = {
  /**
   * 📂 GET ALL CITIES HOOK
   * Fetches the complete list of cities from server with pagination
   * Perfect for city selection dropdowns, admin lists, address forms
   * Returns: isLoadingCities, cities, errorCities
   * Example: const { isLoadingCities, cities } = useCities.useAll({page: 1, limit: 10});
   */
  useAll: (queryParams = {}, options = {}) => {
    const [searchParams] = useSearchParams();
    const limit = parseInt(searchParams.get("limit")) || 99999999;
    const status = searchParams.get("status") || "";
    const allQueryParams = { ...queryParams, limit, status };

    const query = useQuery({
      queryKey: ["cities", allQueryParams, options],
      queryFn: () => citiesApi.getAll(allQueryParams, options),
      staleTime: 10 * 60 * 1000, // 10 minutes - cities don't change often
      cacheTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
      ...options,
    });

    return {
      isLoadingCities: query.isLoading,
      cities: query.data,
      errorCities: query.error,
      isErrorCities: query.isError,
      refetchCities: query.refetch,
    };
  },

  /**
   * 🎯 GET SINGLE CITY HOOK
   * Fetches details of one specific city using its ID
   * Great for city detail pages, edit forms, showing city info
   * Returns: isLoadingCity, city, errorCity
   * Example: const { isLoadingCity, city } = useCities.useById(5);
   */
  useById: (id, options = {}) => {
    const query = useQuery({
      queryKey: ["cities", id],
      queryFn: () => citiesApi.getById(id),
      enabled: !!id, // Only run if ID exists
      staleTime: 10 * 60 * 1000,
      ...options,
    });

    return {
      isLoadingCity: query.isLoading,
      city: query.data,
      errorCity: query.error,
      isErrorCity: query.isError,
      refetchCity: query.refetch,
    };
  },

  /**
   * ➕ CREATE NEW CITY HOOK
   * Handles adding a new city to the database
   * Automatically refreshes the cities list after successful creation
   * Returns: isPendingCities, createCity, errorCreateCity
   * Example: const { isPendingCities, createCity } = useCities.useCreate({
   *            onSuccess: () => { setFormData({}); navigate('/cities'); }
   *          });
   */
  useCreate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: citiesApi.create,
      onSuccess: (data) => {
        // Built-in functionality - always runs first
        queryClient.invalidateQueries({ queryKey: ["cities"] });
        toast.success("City created successfully!");

        // Your custom logic runs after
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
      onError: (error) => {
        toast.error(`Failed to create city: ${error.message}`);

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
      isPendingCities: mutation.isPending,
      createCity: mutation.mutate,
      errorCreateCity: mutation.error,
      isErrorCreateCity: mutation.isError,
      resetCreateCity: mutation.reset,
    };
  },

  /**
   * ✏️ UPDATE EXISTING CITY HOOK
   * Changes information of an existing city
   * Updates both the specific city cache AND the full cities list
   * Returns: isPendingCities, updateCity, errorUpdateCity
   * Example: const { isPendingCities, updateCity } = useCities.useUpdate();
   *          updateCity({id: 5, data: {name: "New Cairo"}});
   */
  useUpdate: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, data }) => citiesApi.update(id, data),
      onSuccess: (data, variables) => {
        // Built-in functionality
        queryClient.setQueryData(["cities", variables.id], data);
        queryClient.invalidateQueries({ queryKey: ["cities"] });
        toast.success("City updated successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
      },
      onError: (error) => {
        toast.error(`Failed to update city: ${error.message}`);

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
      isPendingCities: mutation.isPending,
      updateCity: mutation.mutate,
      errorUpdateCity: mutation.error,
      isErrorUpdateCity: mutation.isError,
      resetUpdateCity: mutation.reset,
    };
  },

  /**
   * 🗑️ DELETE CITY HOOK
   * Permanently removes a city from database
   * Removes city from cache and refreshes the cities list
   * Returns: isPendingCities, deleteCity, errorDeleteCity
   * WARNING: Remember to ask user for confirmation before calling this!
   * Example: const { isPendingCities, deleteCity } = useCities.useDelete();
   *          deleteCity(cityId);
   */
  useDelete: (options = {}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: citiesApi.delete,
      onSuccess: (data, deletedId) => {
        // Built-in functionality
        queryClient.removeQueries({ queryKey: ["cities", deletedId] });
        queryClient.invalidateQueries({ queryKey: ["cities"] });
        toast.success("City deleted successfully!");

        // Your custom logic
        if (options.onSuccess) {
          options.onSuccess(data, deletedId);
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete city: ${error.message}`);

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
      isPendingCities: mutation.isPending,
      deleteCity: mutation.mutate,
      errorDeleteCity: mutation.error,
      isErrorDeleteCity: mutation.isError,
      resetDeleteCity: mutation.reset,
    };
  },
};

export default useCities;
