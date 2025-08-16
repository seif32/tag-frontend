import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { addProductDefaultValues } from "../data/formDefaults";
import VariantsSection from "../components/add-product/VariantsSection/VariantsSection";
import ProductInstancesSection from "../components/add-product/ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "../components/add-product/SettingsSection";
import CategoryBrandSection from "../components/add-product/CategoryBrandSection";
import GeneralInfoSection from "../components/add-product/GeneralInfoSection/GeneralInfoSection";
import TagsManager from "../components/add-product/GeneralInfoSection/TagsSection";
import { useParams } from "react-router";
import { useEffect } from "react";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import useProductStore from "../../store/productStore";
import { consoleObject } from "@/utils/consoleObject";
import ProductHeader from "../components/add-product/ProductHeader";

export default function AdminProductPage({ mode }) {
  const { id } = useParams();
  const setProductId = useProductStore((state) => state.setProductId);
  const setMode = useProductStore((state) => state.setMode);
  const resetProductState = useProductStore((state) => state.setMode);

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
    useProducts.useCreate();
  const { updateProduct, isPendingProducts: isUpdating } =
    useProducts.useUpdate();

  const form = useForm({
    defaultValues: addProductDefaultValues,
  });

  useEffect(() => {
    if (product && mode !== "add") {
      form.reset(product);
    }
  }, [product, form, mode]);

  function onSubmit(data) {
    if (mode === "view") return;

    data.variants = data.variants.filter(
      (v) => v.variant_name.trim() !== "" && v.variant_sku.trim() !== ""
    );

    if (mode === "edit") {
      // updateProduct({ id, data });
    } else {
      consoleObject(data);
      createProduct(data);
    }
  }

  if (isLoadingProduct && mode !== "add") {
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
            productName={product.name}
            product={product}
          />
          <div className="flex flex-col flex-1 gap-4 lg:flex-row">
            <div className="flex flex-col gap-4 flex-5/8">
              <GeneralInfoSection form={form} />
              <VariantsSection product={product} />
              <ProductInstancesSection control={form.control} />
            </div>

            <div className="flex flex-col gap-4 flex-3/8">
              <SettingsSection
                isActive={product.active}
                isFeatured={product.featured}
              />
              <CategoryBrandSection />
              <TagsManager form={form} />
            </div>
          </div>
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}
