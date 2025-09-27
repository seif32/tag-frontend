import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { addProductDefaultValues, productSchema } from "../data/formDefaults";
import VariantsSection from "../components/add-product/VariantsSection/VariantsSection";
import ProductInstancesSection from "../components/add-product/ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "../components/add-product/SettingsSection";
import CategoryBrandSection from "../components/add-product/CategoryBrandSection";
import GeneralInfoSection from "../components/add-product/GeneralInfoSection/GeneralInfoSection";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import useProductStore from "../../store/productStore";
import ProductHeader from "../components/add-product/ProductHeader";
import useVariantStore from "../../store/variantStore";
import { toast } from "sonner";
import TagsSection from "../components/add-product/GeneralInfoSection/TagsSection";
import EditProductDialog from "../components/add-product/ProductInstancesSection/EditProductDialog";
import { useVariantsIDs } from "../hooks/useVariantsIDs";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      clearSelectedTypes();
      clearSelectedValues();
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
      onError: (error) => {
        if (
          error.details?.sqlMessage?.includes("Duplicate entry") &&
          error.details?.sqlMessage?.includes("for key 'products.name'")
        ) {
          toast.error("Product name already exists!", {
            description:
              "Please choose a different product name and try again.",
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

  const { updateProduct, isPendingProducts: isUpdating } =
    useProducts.useUpdate({
      onSuccess: () => {
        navigate("/admin/products");
      },
    });

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

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  }

  function onSubmit(data) {
    if (isViewMode) return;

    // ✅ Filter out empty variants (common for both modes)
    const validVariants =
      data.variants?.filter((variant) => {
        const hasQuantity = variant.quantity && parseInt(variant.quantity) > 0;
        const hasPrice = variant.price && parseFloat(variant.price) > 0;
        return hasQuantity && hasPrice;
      }) || [];

    if (isEditMode) {
      // 🔄 EDIT MODE: Only update product details (no variants)
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

      console.log("🔄 Editing product:", editTransformedData);
      updateProduct({ id, data: editTransformedData });
    } else {
      // ➕ ADD MODE: Create new product with variants
      if (validVariants.length === 0) {
        toast.warning("📦 No valid product variants found", {
          description:
            "Please add at least one variant with quantity and price.",
          duration: 5000,
        });
        return;
      }

      toast.info(
        `🚀 Submitting product with ${validVariants.length} variant${
          validVariants.length === 1 ? "" : "s"
        }`,
        {
          description: `Creating ${
            data.name || "product"
          } with all selected variants`,
          duration: 3000,
        }
      );

      const addTransformedData = {
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
          currency: variant?.currency || "USD",
          has_discount:
            parseFloat(variant?.compare_at_price || 0) >
            parseFloat(variant?.price),
          in_stock: parseInt(variant?.quantity) > 0,
          // ✅ Transform types to expected backend format
          types:
            variant?.types?.map((type) => ({
              type_id: parseInt(type?.typeId),
              value_id: parseInt(type?.selectedValue?.id),
            })) || [],
          images: variant?.images || [],
        })),
      };

      console.log("➕ Creating product:", addTransformedData);
      createProduct(addTransformedData);
    }
  }

  const displayVariants = useVariantsIDs(product, variantsList);

  if (isLoadingProduct && !isAddMode) {
    return <LoadingState />;
  }

  const isPending = isCreating || isUpdating;

  return (
    <>
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
                <GeneralInfoSection />
                <VariantsSection
                  variantValues={product?.variant_values}
                  variantTypes={product?.variant_types}
                />
                <ProductInstancesSection
                  variantsList={displayVariants}
                  append={append}
                  onEditProduct={handleEditProduct}
                  productName={product?.name}
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

      <EditProductDialog
        isDialogOpen={isDialogOpen}
        selectedProduct={selectedProduct}
        onClose={handleDialogClose}
      />
    </>
  );
}
