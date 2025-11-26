import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery Section */}
        <div className="w-full">
          <div className="sticky top-4">
            <ImageGallerySection images={currentImages} />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col space-y-6">
          <ProductInfoSection
            selectedBundle={selectedBundle}
            product={product}
            selectedVariant={selectedVariant}
            effectivePrice={effectivePrice}
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

          <div className="border-t pt-6">
            <ExtraInfoSection
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="border-t pt-8 mb-12">
        <FullDescription description={product.description} />
      </div>

      {/* Related Products */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        <RelatedProducts subcategoryId={product.subcategory_id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;

// 🆕 Image Gallery Component with inline styles
function ImageGallerySection({ images }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg
            className="w-24 h-24 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🎨 Inline Styles */}
      <style>{`
        .custom-gallery .image-gallery-slide img {
          max-height: 600px;
          width: 100%;
          object-fit: contain;
          background-color: #f9fafb;
        }

        .custom-gallery .image-gallery-thumbnail img {
          height: 80px;
          width: 80px;
          object-fit: cover;
          border-radius: 0.375rem;
        }

        .custom-gallery .image-gallery-thumbnail.active {
          border: 2px solid #3b82f6;
        }

        .custom-gallery .image-gallery-thumbnail:hover {
          border: 2px solid #60a5fa;
        }

        .custom-gallery .image-gallery-thumbnails-wrapper {
          margin-top: 1rem;
        }

        .custom-gallery .image-gallery-icon {
          color: #374151;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          transition: all 0.2s;
        }

        .custom-gallery .image-gallery-icon:hover {
          color: #3b82f6;
        }

        .custom-gallery .image-gallery-left-nav,
        .custom-gallery .image-gallery-right-nav {
          padding: 20px 10px;
        }

        @media (max-width: 768px) {
          .custom-gallery .image-gallery-slide img {
            max-height: 400px;
          }

          .custom-gallery .image-gallery-thumbnail img {
            height: 60px;
            width: 60px;
          }
        }
      `}</style>

      <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <ReactImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={true}
          showNav={images.length > 1}
          showThumbnails={images.length > 1}
          thumbnailPosition="bottom"
          useBrowserFullscreen={true}
          showIndex={false}
          lazyLoad={true}
          slideDuration={300}
          slideInterval={3000}
          additionalClass="custom-gallery"
          renderLeftNav={(onClick, disabled) =>
            images.length > 1 && (
              <button
                type="button"
                className="image-gallery-icon image-gallery-left-nav"
                disabled={disabled}
                onClick={onClick}
                aria-label="Previous Slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )
          }
          renderRightNav={(onClick, disabled) =>
            images.length > 1 && (
              <button
                type="button"
                className="image-gallery-icon image-gallery-right-nav"
                disabled={disabled}
                onClick={onClick}
                aria-label="Next Slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )
          }
        />
      </div>
    </>
  );
}

function BundlesSection({ bundles, selectedBundle, onBundleSelect }) {
  if (!bundles?.length) return null;

  const activeBundles =
    bundles?.filter((bundle) => bundle.is_active === 1) || [];

  if (activeBundles.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-semibold text-base">Volume Discounts</p>
      </div>
      <div className="grid gap-3">
        {activeBundles.map((bundle) => {
          const isSelected = selectedBundle?.id === bundle.id;
          const unitPrice = parseFloat(bundle.subtotal) / bundle.quantity;

          return (
            <div
              key={bundle.id}
              onClick={() => onBundleSelect(bundle)}
              className={`
                border-2 p-4 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">
                    Buy {bundle.quantity} for {formatCurrency(bundle.subtotal)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(unitPrice)} each • Total:{" "}
                    <span className="font-medium">
                      {formatCurrency(bundle.total)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    +{bundle.vat}% VAT
                  </p>
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
  if (!description) return null;

  return (
    <div className="max-w-none">
      <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </div>
    </div>
  );
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

  if (isLoadingProducts) {
    return <LoadingState type="card" rows={1} columns={4} />;
  }

  if (!products?.data?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products?.data?.map((product) => (
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
  );
}
