export const addProductDefaultValues = {
  name: "",
  sku: "",
  fullDescription: "",
  shortDescription: "",
  categoryId: "",
  subcategoryId: "",
  brandId: "",
  featured: false,
  isAvailable: true,
  tags: [],
  variants: [
    {
      variantSku: "",
      variantName: "",
      price: "",
      compareAtPrice: "",
      costPrice: "",
      currency: "USD",
      quantity: "",
      types: [
        {
          typeid: "",
          value: "",
        },
      ],
      images: [
        {
          imageUrl: "",
          isPrimary: false,
        },
      ],
    },
  ],
};

export const editProductDefaultValues = (existingProduct) => ({
  name: existingProduct?.name || "",
  sku: existingProduct?.sku || "",
  description: existingProduct?.description || "",
  shortdescription: existingProduct?.shortdescription || "",
  categoryid: existingProduct?.categoryid || "",
  subcategoryid: existingProduct?.subcategoryid || "",
  brandid: existingProduct?.brandid || "",
  featured: existingProduct?.featured || false,
  isavailable: existingProduct?.isavailable ?? true,
  tags: existingProduct?.tags || [],
  variants: existingProduct?.variants || [
    {
      variantsku: "",
      variantname: "",
      price: "",
      compareatprice: "",
      costprice: "",
      currency: "USD",
      hasdiscount: false,
      quantity: "",
      instock: true,
      types: [],
      images: [],
    },
  ],
});
