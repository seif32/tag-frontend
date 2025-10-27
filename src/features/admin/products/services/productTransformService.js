export const transformProductDataForCreate = (data, validVariants) => {
  return {
    ...data,
    brand_id: parseInt(data?.brand_id),
    category_id: parseInt(data?.category_id),
    subcategory_id: parseInt(data?.subcategory_id),
    variants: validVariants?.map((variant) => ({
      vat: parseInt(variant?.vat),
      quantity: parseInt(variant?.quantity),
      price: parseFloat(variant?.price),
      compare_at_price: parseFloat(variant?.compare_at_price || 0),
      cost_price: parseFloat(variant?.cost_price || 0),
      currency: variant?.currency || "GBP",
      has_discount:
        parseFloat(variant?.compare_at_price || 0) > parseFloat(variant?.price),
      in_stock: parseInt(variant?.quantity) > 0,
      types:
        variant?.types?.map((type) => ({
          type_id: parseInt(type?.typeId),
          value_id: parseInt(type?.selectedValue?.id),
        })) || [],
      images: variant?.images || [],
    })),
  };
};

export const transformProductDataForEdit = (data) => {
  return {
    name: data.name,
    description: data.description,
    short_description: data.short_description,
    category_id: data.category_id,
    subcategory_id: data.subcategory_id,
    brand_id: data.brand_id,
    featured: data.featured,
    active: Boolean(data.active),
  };
};

export const validateVariants = (variants) => {
  return (
    variants?.filter((variant) => {
      const hasQuantity = variant.quantity && parseInt(variant.quantity) > 0;
      const hasPrice = variant.price && parseFloat(variant.price) > 0;
      return hasQuantity && hasPrice;
    }) || []
  );
};
