// // features/products/hooks/productQueries.js
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import productApi from "../services/productApi";
// import { toast } from "sonner"; // For notifications

// // 🎯 This is the MAGIC object that gives you autocomplete!
// export const productQueries = {
//   // 📋 QUERIES (for fetching data)
//   useAll: (params = {}) => {
//     return useQuery({
//       queryKey: ["products", params],
//       queryFn: () => productApi.getAll(params),
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       gcTime: 10 * 60 * 1000, // 10 minutes
//     });
//   },

//   useById: (id, options = {}) => {
//     return useQuery({
//       queryKey: ["products", id],
//       queryFn: () => productApi.getById(id),
//       enabled: !!id, // Only run if ID exists
//       staleTime: 5 * 60 * 1000,
//       ...options,
//     });
//   },

//   useByCategory: (categoryId) => {
//     return useQuery({
//       queryKey: ["products", "category", categoryId],
//       queryFn: () => productApi.getAll({ category: categoryId }),
//       enabled: !!categoryId,
//     });
//   },

//   useFeatured: () => {
//     return useQuery({
//       queryKey: ["products", "featured"],
//       queryFn: () => productApi.getAll({ featured: true }),
//       staleTime: 10 * 60 * 1000, // Featured products can be cached longer
//     });
//   },

//   // 🔄 MUTATIONS (for creating/updating/deleting)
//   useCreate: () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//       mutationFn: productApi.create,
//       onSuccess: (newProduct) => {
//         // ✅ Invalidate and refetch products list
//         queryClient.invalidateQueries({ queryKey: ["products"] });

//         // 🎯 Optimistically add to cache (advanced!)
//         queryClient.setQueryData(["products", newProduct.id], newProduct);

//         toast.success("Product created successfully! 🎉");
//       },
//       onError: (error) => {
//         toast.error("Failed to create product 😞");
//         console.error("Create product error:", error);
//       },
//     });
//   },

//   useUpdate: () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//       mutationFn: productApi.update,
//       onSuccess: (updatedProduct, { id }) => {
//         // 🎯 Update specific product in cache
//         queryClient.setQueryData(["products", id], updatedProduct);

//         // ♻️ Invalidate products list to refresh
//         queryClient.invalidateQueries({ queryKey: ["products"], exact: false });

//         toast.success("Product updated successfully! ✨");
//       },
//       onError: () => {
//         toast.error("Failed to update product 😞");
//       },
//     });
//   },

//   useDelete: () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//       mutationFn: productApi.delete,
//       onSuccess: (_, deletedId) => {
//         // 🗑️ Remove from all relevant caches
//         queryClient.removeQueries({ queryKey: ["products", deletedId] });
//         queryClient.invalidateQueries({ queryKey: ["products"] });

//         toast.success("Product deleted successfully! 🗑️");
//       },
//       onError: () => {
//         toast.error("Failed to delete product 😞");
//       },
//     });
//   },

//   // 🎯 UTILITY METHODS (bonus!)
//   prefetch: {
//     all: (queryClient, params) => {
//       return queryClient.prefetchQuery({
//         queryKey: ["products", params],
//         queryFn: () => productApi.getAll(params),
//       });
//     },

//     byId: (queryClient, id) => {
//       return queryClient.prefetchQuery({
//         queryKey: ["products", id],
//         queryFn: () => productApi.getById(id),
//       });
//     },
//   },

//   // 🎯 INVALIDATION HELPERS
//   invalidate: {
//     all: (queryClient) => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },

//     byId: (queryClient, id) => {
//       queryClient.invalidateQueries({ queryKey: ["products", id] });
//     },
//   },
// };
