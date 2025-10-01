import ProductHeader from "./ProductHeader";
import GeneralInfoSection from "./GeneralInfoSection/GeneralInfoSection";
import VariantsSection from "./VariantsSection/VariantsSection";
import ProductInstancesSection from "./ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "./SettingsSection";
import CategoryBrandSection from "./CategoryBrandSection";
import TagsSection from "./GeneralInfoSection/TagsSection";
import { useFormContext } from "react-hook-form";

const ProductLayout = ({
  product,
  displayVariants,
  append,
  onEditProduct,
  isPending,
  mode,
}) => {
  const form = useFormContext();
  const isEditMode = mode === "edit";

  return (
    <div className="flex flex-col gap-4 mb-40">
      <ProductHeader
        handleSubmit={form.handleSubmit}
        onSubmit={() => {}} // This will be handled by the form provider
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
            onEditProduct={onEditProduct}
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
          {/* <BundlesSection /> */}
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
