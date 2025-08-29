import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { addProductDefaultValues } from "../data/formDefaults";
import VariantsSection from "../components/add-product/VariantsSection/VariantsSection";
import ProductInstancesSection from "../components/add-product/ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "../components/add-product/SettingsSection";
import CategoryBrandSection from "../components/add-product/CategoryBrandSection";
import GeneralInfoSection from "../components/add-product/GeneralInfoSection/GeneralInfoSection";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import useProductStore from "../../store/productStore";
import { consoleObject } from "@/utils/consoleObject";
import ProductHeader from "../components/add-product/ProductHeader";
import useVariantStore from "../../store/variantStore";
import { toast } from "sonner";
import TagsSection from "../components/add-product/GeneralInfoSection/TagsSection";

export default function AdminProductPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const setProductId = useProductStore((state) => state.setProductId);
  const setMode = useProductStore((state) => state.setMode);
  const resetProductState = useProductStore((state) => state.setMode);
  const clearSelectedTypes = useVariantStore(
    (state) => state.clearSelectedTypes
  );
  const clearSelectedValues = useVariantStore(
    (state) => state.clearSelectedValues
  );
  const clearSelectedCombination = useVariantStore(
    (state) => state.clearSelectedCombination
  );

  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const isViewMode = mode === "view";

  useEffect(() => {
    resetProductState();
    setMode(mode);
    setProductId(id);
  }, [mode, id]);

  useEffect(() => {
    return () => {
      resetProductState();
    };
  }, []);

  const { product, isLoadingProduct } = useProducts.useById(id, {
    enabled: mode !== "add",
  });

  const { createProduct, isPendingProducts: isCreating } =
    useProducts.useCreate({
      onSuccess: () => {
        clearSelectedTypes();
        clearSelectedValues();
        clearSelectedCombination();
        navigate("/admin/products");
      },
    });
  const { updateProduct, isPendingProducts: isUpdating } =
    useProducts.useUpdate({
      onSuccess: () => {
        navigate("/admin/products");
      },
    });

  const form = useForm({
    defaultValues: addProductDefaultValues,
  });

  const { fields: variantsList, append } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  useEffect(() => {
    if (product && mode !== "add") {
      form.reset(product);
    }
  }, [product, form, mode]);

  function onSubmit(data) {
    if (isViewMode) return;

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

    if (isEditMode) {
      consoleObject(editTransformedData);
      // updateProduct({ id, data: editTransformedData });
    } else {
      const addTransformedData = {
        ...data,
        brand_id: parseInt(data.brand_id),
        category_id: parseInt(data.category_id),
        subcategory_id: parseInt(data.subcategory_id),
        variants: data.variants.map((variant) => ({
          quantity: parseInt(variant.quantity),
          price: parseFloat(variant.price),
          compare_at_price: parseFloat(variant.compare_at_price || 0),
          cost_price: parseFloat(variant.cost_price || 0),
          currency: variant.currency || "USD",
          has_discount:
            parseFloat(variant.compare_at_price || 0) >
            parseFloat(variant.price),
          in_stock: parseInt(variant.quantity) > 0,
          types: variant.types
            ? variant.types.map((type) => ({
                type_id: parseInt(type.typeId),
                value_id: parseInt(type.selectedValue.id),
              }))
            : [],
          images: variant.images || [],
        })),
      };
      const validVariants =
        data?.variants?.filter(
          (v) => v.quantity?.trim() !== "" && v.price?.trim() !== ""
        ) || [];

      if (validVariants.length === 0) {
        toast.warning("No product variants added", {
          description:
            "Please add at least one product variant before submitting. Use the 'Add Product' button to create variants.",
          duration: 5000,
          action: {
            label: "Got it",
            onClick: () => console.log("User acknowledged"),
          },
        });
        return;
      }

      data.variants = validVariants;

      toast.info(
        `Submitting product with ${validVariants.length} variant${
          validVariants.length === 1 ? "" : "s"
        }`,
        {
          description: `Creating ${
            data.name || "product"
          } with all selected variants`,
          duration: 3000,
        }
      );

      consoleObject(addTransformedData);
      createProduct(addTransformedData);
    }
  }

  if (isLoadingProduct && !isAddMode) {
    return <LoadingState />;
  }

  const isPending = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 mb-40">
          <ProductHeader
            handleSubmit={form.handleSubmit}
            onSubmit={onSubmit}
            isPending={isPending}
            productName={product?.name}
            isProductActive={product?.active}
            productSku={product?.sku}
          />
          <div className="flex flex-col flex-1 gap-4 lg:flex-row">
            <div className="flex flex-col gap-4 flex-5/8">
              <GeneralInfoSection form={form} />
              {!isEditMode && (
                <VariantsSection
                  variantValues={product?.variant_values}
                  variantTypes={product?.variant_types}
                />
              )}
              <ProductInstancesSection
                variantsList={variantsList}
                append={append}
              />
            </div>

            <div className="flex flex-col gap-4 flex-3/8">
              <SettingsSection
                isActive={product?.active}
                isFeatured={product?.featured}
              />
              <CategoryBrandSection />
              {!isEditMode && (
                <TagsSection form={form} productTags={product?.tags} />
              )}
            </div>
          </div>
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}
