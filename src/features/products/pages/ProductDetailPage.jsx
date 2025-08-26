// src/features/products/pages/ProductDetailPage.jsx
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
import { useMemo } from "react";
import ProductCard from "../components/ProductCard";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    product,
    errorProduct,
    isErrorProduct,
    isLoadingProduct,
    refetchProduct,
  } = useProducts.useById(id);

  const {
    selectedVariant,
    selections,
    currentImages,
    handleVariantSelection,
    getAvailableValues,
    isValueAvailable,
    isLoading: isVariantLoading,
  } = useVariantSelector(product?.variants);

  const filters = useMemo(() => {
    if (!product) return null;
    return {
      active: 1,
      ...(product.category_id && {
        category_id: parseInt(product.category_id),
      }),
      ...(product.subcategory_id && {
        subcategory_id: parseInt(product.subcategory_id),
      }),
    };
  }, [product]);

  const { products = [], isLoadingProducts } =
    useProducts.useAllWithoutVariants(filters || {});

  const firstFourProducts = products.slice(1, 5);

  if (isLoadingProduct || isVariantLoading || isLoadingProducts) {
    return <LoadingState type="card" rows={20} columns={3} />;
  }

  if (isErrorProduct)
    return (
      <ErrorMessage
        message={errorProduct.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProduct()}
      />
    );

  function handleViewProductDetails(productId) {
    navigate(`/products/${productId}`);
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="w-[600px] h-[400px]">
          <ReactImageGallery
            items={currentImages}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
            renderItem={(item) => (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <img
                  src={item.original}
                  alt={item.originalAlt || "Product image"}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            )}
            renderThumbInner={(item) => (
              <img
                src={item.thumbnail}
                alt={item.thumbnailAlt || "Product thumbnail"}
                className="object-cover w-full h-16 rounded"
              />
            )}
          />
        </div>
        <div className="flex-1 space-y-8">
          <ProductInfoSection
            product={product}
            selectedVariant={selectedVariant}
          />

          <VariantsSection
            variantTypes={product?.variant_types || []}
            selections={selections}
            onVariantChange={handleVariantSelection}
            getAvailableValues={getAvailableValues}
            isValueAvailable={isValueAvailable}
          />

          <ActionButtons selectedVariant={selectedVariant} product={product} />

          <div className="border"></div>

          <ExtraInfoSection
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>

      <div className="border"></div>
      <div className="">
        <p>Description:</p>
        <p className="text-sm text-muted-foreground">
          {product?.description ||
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae totam non, expedita, obcaecati molestiae in earum harum a debitis placeat saepe culpa id ipsum cum possimus eligendi pariatur modi eaque! "}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {firstFourProducts.map((product) => (
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
        ))}
      </div>
    </div>
  );
}

export default ProductDetailPage;
