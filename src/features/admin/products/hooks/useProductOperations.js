import { toast } from "sonner";
import useProducts from "@/hooks/useProducts";
import useVariantStore from "../../store/variantStore";

export const useProductOperations = (navigate) => {
  const clearSelectedTypes = useVariantStore(
    (state) => state.clearSelectedTypes
  );
  const clearSelectedValues = useVariantStore(
    (state) => state.clearSelectedValues
  );
  const clearSelectedCombination = useVariantStore(
    (state) => state.clearSelectedCombination
  );

  const {
    createProduct: createProductMutation,
    isPendingProducts: isCreating,
  } = useProducts.useCreate({
    onSuccess: () => {
      navigate("/admin/products");
      clearSelectedTypes();
      clearSelectedValues();
      clearSelectedCombination();
    },
    onError: (error) => {
      if (
        error.details?.sqlMessage?.includes("Duplicate entry") &&
        error.details?.sqlMessage?.includes("for key 'products.name'")
      ) {
        toast.error("Product name already exists!", {
          description: "Please choose a different product name and try again.",
          duration: 5000,
        });
      } else {
        toast.error("❌ Failed to create product", {
          description:
            error.message || "Something went wrong. Please try again.",
          duration: 5000,
        });
      }
    },
  });

  const {
    updateProduct: updateProductMutation,
    isPendingProducts: isUpdating,
  } = useProducts.useUpdate({
    onSuccess: () => {
      navigate("/admin/products");
    },
  });

  const createProduct = (data, validVariants) => {
    if (validVariants.length === 0) {
      toast.warning("📦 No valid product variants found", {
        description: "Please add at least one variant with quantity and price.",
        duration: 5000,
      });
      return;
    }

    // toast.info(
    //   `🚀 Submitting product with ${validVariants.length} variant${
    //     validVariants.length === 1 ? "" : "s"
    //   }`,
    //   {
    //     description: `Creating ${
    //       data.name || "product"
    //     } with all selected variants`,
    //     duration: 3000,
    //   }
    // );

    const addTransformedData = {
      ...data,
      name: data?.name?.trim(),
      description: data?.description?.trim(),
      short_description: data?.short_description?.trim(),
      brand_id: parseInt(data?.brand_id),
      category_id: parseInt(data?.category_id),
      subcategory_id: parseInt(data?.subcategory_id),
      variants: validVariants?.map((variant) => ({
        vat: parseInt(variant?.vat),
        quantity: parseInt(variant?.quantity),
        price: parseFloat(variant?.price),
        compare_at_price:
          variant?.compare_at_price && parseFloat(variant.compare_at_price) > 0
            ? parseFloat(variant.compare_at_price)
            : undefined,
        cost_price: parseFloat(variant?.cost_price || 0),
        currency: variant?.currency || "GBP",
        types:
          variant?.types?.map((type) => ({
            type_id: parseInt(type?.typeId),
            value_id: parseInt(type?.selectedValue?.id),
          })) || [],
        images: variant?.images || [],
      })),
    };

    console.log("➕ Creating product:", addTransformedData);
    createProductMutation(addTransformedData);
  };

  const updateProduct = ({ id, data }) => {
    console.log("🔄 Editing product:", data);
    updateProductMutation({ id, data });
  };

  return {
    createProduct,
    updateProduct,
    isPending: isCreating || isUpdating,
  };
};
