// src/features/products/pages/ProductDetailPage.jsx
import ReactImageGallery from "react-image-gallery";
import { useParams } from "react-router";
import ProductInfoSection from "../components/product-details/ProductInfoSection";
import VariantsSection from "../components/product-details/VariantsSection";
import ActionButtons from "../components/product-details/ActionButtons";
import ExtraInfoSection from "../components/product-details/ExtraInfoSection";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { consoleObject } from "@/utils/consoleObject";
import useVariantSelector from "../components/useVariantSelector";

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
    selections,
    currentImages,
    handleVariantSelection,
    getAvailableValues,
    isValueAvailable,
    isLoading: isVariantLoading,
  } = useVariantSelector(product?.variants);

  if (isLoadingProduct || isVariantLoading)
    return <LoadingState type="card" rows={20} columns={3} />;

  if (isErrorProduct)
    return (
      <ErrorMessage
        message={errorProduct.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProduct()}
      />
    );

  consoleObject({ product, selectedVariant, selections });

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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime quam
          aliquid aspernatur ea eveniet. Id voluptate incidunt, error commodi
          dolorem vel enim veniam architecto eius blanditiis. Incidunt fugiat
          pariatur dicta. Doloribus aliquid ex repellendus saepe voluptatum
          facilis in, animi delectus optio molestiae magni architecto alias non
          iusto sapiente aspernatur magnam ad reiciendis impedit! Dicta dolores
          nisi sint perspiciatis sapiente architecto.
        </p>
        {/* <p className="text-sm text-muted-foreground">
          {product?.description ||
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae totam non, expedita, obcaecati molestiae in earum harum a debitis placeat saepe culpa id ipsum cum possimus eligendi pariatur modi eaque! "}
        </p> */}
      </div>
    </div>
  );
}

export default ProductDetailPage;
