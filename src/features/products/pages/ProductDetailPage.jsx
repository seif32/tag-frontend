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
import { consoleObject } from "@/utils/consoleObject";

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
    variantBlocks, // ✅ Now using blocks instead of individual types
    currentImages,
    handleVariantSelection,
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

  // const firstFourProducts = products?.slice(1, 5);

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
          />
        </div>

        <div className="flex-1 space-y-8">
          <ProductInfoSection
            product={product}
            selectedVariant={selectedVariant}
          />

          {/* ✅ Updated to use variant blocks */}
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

      {/* ... rest of your component */}
    </div>
  );
}

export default ProductDetailPage;
