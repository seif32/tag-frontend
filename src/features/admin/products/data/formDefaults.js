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
          value: "",
        },
      ],
      images: [
        {
          image_url: "",
          is_primary: false,
        },
      ],
    },
  ],
};
