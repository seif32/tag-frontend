export const addProductDefaultValues = {
  name: "",
  sku: "",
  description: "",
  short_description: "",
  category_id: "",
  subcategory_id: "",
  brand_id: "",
  featured: false,
  active: true,
  tags: [],
  variants: [
    {
      variant_sku: "",
      variant_name: "",
      price: "",
      compare_at_price: "",
      cost_price: "",
      currency: "USD",
      quantity: "",
      types: [
        {
          type_id: "",
          value_id: "",
        },
      ],
      images: [
        {
          image_url:
            "https://images.unsplash.com/photo-1723223440648-dc41fb3d9a7f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          is_primary: false,
        },
      ],
    },
  ],
};
