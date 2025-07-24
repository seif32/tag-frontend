// // features/products/services/productApi.js
// const productApi = {
//   getAll: async (params) => {
//     const response = await fetch(
//       `/api/products?${new URLSearchParams(params)}`
//     );
//     return response.json();
//   },

//   getById: async (id) => {
//     const response = await fetch(`/api/products/${id}`);
//     return response.json();
//   },

//   create: async (productData) => {
//     const response = await fetch("/api/products", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(productData),
//     });
//     return response.json();
//   },

//   update: async ({ id, data }) => {
//     const response = await fetch(`/api/products/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     return response.json();
//   },

//   delete: async (id) => {
//     const response = await fetch(`/api/products/${id}`, {
//       method: "DELETE",
//     });
//     return response.json();
//   },
// };

// export default productApi;
