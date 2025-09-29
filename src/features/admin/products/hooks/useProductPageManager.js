import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductDefaultValues, productSchema } from "../data/formDefaults";
import { useProductModeSetup } from "./useProductModeSetup";
import { useProductOperations } from "./useProductOperations";
import { useVariantsIDs } from "./useVariantsIDs";
import useProducts from "@/hooks/useProducts";

export const useProductPageManager = (mode) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const isViewMode = mode === "view";

  useProductModeSetup(mode, id);

  const { product, isLoadingProduct } = useProducts.useById(id, {
    enabled: mode !== "add",
  });

  const { createProduct, updateProduct, isPending } =
    useProductOperations(navigate);

  const form = useForm({
    resolver: isAddMode ? zodResolver(productSchema) : undefined,
    defaultValues: addProductDefaultValues,
    mode: "onChange",
  });

  const { fields: variantsList, append } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  useEffect(() => {
    if (product && mode !== "add") {
      form.reset({ ...product, variants: [] });
    }
  }, [product, form, mode]);

  const displayVariants = useVariantsIDs(product, variantsList);

  const onSubmit = (data) => {
    if (isViewMode) return;

    const validVariants =
      data.variants?.filter((variant) => {
        const hasQuantity = variant.quantity && parseInt(variant.quantity) > 0;
        const hasPrice = variant.price && parseFloat(variant.price) > 0;
        return hasQuantity && hasPrice;
      }) || [];

    if (isEditMode) {
      const editTransformedData = {
        name: data.name,
        description: data.description,
        short_description: data.short_description,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        brand_id: data.brand_id,
        featured: data.featured,
        active: Boolean(data.active),
      };

      updateProduct({ id, data: editTransformedData });
    } else {
      createProduct(data, validVariants);
    }
  };

  return {
    form,
    product,
    isLoadingProduct,
    isPending,
    displayVariants,
    variantsList,
    append,
    onSubmit,
    isAddMode,
    isEditMode,
    isViewMode,
  };
};
