import ReactImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router";
import ProductInfoSection from "../components/product-details/ProductInfoSection";
import VariantsSection from "../components/product-details/VariantsSection";
import ActionButtons from "../components/product-details/ActionButtons";
import ExtraInfoSection from "../components/product-details/ExtraInfoSection";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import useVariantSelector from "../components/useVariantSelector";
import ProductCard from "../components/ProductCard";
import { useAuthStore } from "@/auth/store/authStore";

import { formatCurrency } from "@/utils/formatCurrency";

function ProductDetailPage() {
  const { id } = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    product,
    errorProduct,
    isErrorProduct,
    isLoadingProduct,
    refetchProduct,
  } = useProducts.useById(id);

  const {
    selectedVariant,
    selectedBundle,
    variantBlocks,
    currentImages,
    effectivePrice,
    handleVariantSelection,
    handleBundleSelection,
    isLoading: isVariantLoading,
  } = useVariantSelector(product?.variants);

  if (isLoadingProduct || isVariantLoading) {
    return <LoadingState type="dashboard" />;
  }

  if (isErrorProduct)
    return (
      <ErrorMessage
        message={errorProduct?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProduct()}
      />
    );

  return (
    <div className="flex flex-col space-y-8 ">
      <div className="flex flex-col md:flex-row md:gap-8 ">
        <div className="w-[600px] h-[400px]">
          <ReactImageGallery
            items={currentImages}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
          />
        </div>
        <div className="flex-1 space-y-8">
          <ProductInfoSection
            selectedBundle={selectedBundle}
            product={product}
            selectedVariant={selectedVariant}
            effectivePrice={effectivePrice} // Pass pricing info
          />

          {isAuthenticated && (
            <BundlesSection
              bundles={selectedVariant?.bundles}
              selectedBundle={selectedBundle}
              onBundleSelect={handleBundleSelection}
            />
          )}

          <VariantsSection
            variantBlocks={variantBlocks}
            onVariantChange={handleVariantSelection}
          />

          {isAuthenticated && (
            <ActionButtons
              selectedVariant={selectedVariant}
              selectedBundle={selectedBundle}
              product={product}
            />
          )}
          <div className="border"></div>

          <ExtraInfoSection
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>
      <FullDescription description={product.description} />
      <div className="my-8 border"></div>
      <RelatedProducts subcategoryId={product.subcategory_id} />
    </div>
  );
}

export default ProductDetailPage;

function BundlesSection({ bundles, selectedBundle, onBundleSelect }) {
  if (!bundles?.length) return null;

  return (
    <div className="space-y-3">
      <p className="font-medium text-sm">Volume Discounts</p>
      <div className="grid gap-2">
        {bundles.map((bundle) => {
          const isSelected = selectedBundle?.id === bundle.id;
          const unitPrice = parseFloat(bundle.subtotal) / bundle.quantity;
          // const savings = bundle.quantity * (/* original price needed */) - parseFloat(bundle.subtotal);

          return (
            <div
              key={bundle.id}
              onClick={() => onBundleSelect(bundle)}
              className={`
                border-2 p-3 rounded-lg transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Buy {bundle.quantity} for {formatCurrency(bundle.subtotal)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(unitPrice)} each • Total:{" "}
                    {formatCurrency(bundle.total)}
                  </p>
                </div>
                <div className="text-right">
                  {/* {savings > 0 && (
                    <p className="text-green-600 text-sm font-medium">
                      Save {formatCurrency(savings)}
                    </p>
                  )} */}
                  <p className="text-xs text-gray-500">+{bundle.vat}% VAT</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FullDescription({ description }) {
  return <div className="text-muted-foreground">{description}</div>;
}

function RelatedProducts({ subcategoryId }) {
  const navigate = useNavigate();

  function handleViewProductDetails(productId) {
    navigate(`/products/${productId}`);
  }

  const filters = {
    limit: 4,
    active: 1,
    subcategory_id: subcategoryId,
  };
  const { products, isLoadingProducts } =
    useProducts.useAllWithoutVariants(filters);

  if (isLoadingProducts)
    return <LoadingState type="card" rows={4} columns={2} />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {products?.data?.map((product) => {
        return (
          <ProductCard
            key={product.id}
            image={product.primary_image}
            category={product.category_name}
            name={product.name}
            variantCount={product.variant_count}
            brand={product.brand_name}
            onViewProductDetails={handleViewProductDetails}
            productId={product.id}
          />
        );
      })}
    </div>
  );
}
