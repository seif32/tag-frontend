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
import { consoleObject } from "@/utils/consoleObject";

function ProductDetailPage() {
  const { id } = useParams();

  const {
    product,
    errorProduct,
    isErrorProduct,
    isLoadingProduct,
    refetchProduct,
  } = useProducts.useById(id);

  const {
    selectedVariant,
    variantBlocks,
    currentImages,
    handleVariantSelection,
    isLoading: isVariantLoading,
  } = useVariantSelector(product?.variants);

  if (isLoadingProduct || isVariantLoading) {
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

  consoleObject("selectedVariant", selectedVariant);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col md:flex-row md:gap-8">
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
            product={product}
            selectedVariant={selectedVariant}
          />

          <VariantsSection
            variantBlocks={variantBlocks}
            onVariantChange={handleVariantSelection}
          />

          <ActionButtons selectedVariant={selectedVariant} product={product} />

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
    <div className="grid grid-cols-4 gap-6">
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
