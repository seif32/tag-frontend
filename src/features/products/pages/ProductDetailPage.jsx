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
const images = [
  {
    original: "https://picsum.photos/id/10/1600/1067",
    thumbnail: "https://picsum.photos/id/10/300/200",
  },
  {
    original: "https://picsum.photos/id/100/1600/1067",
    thumbnail: "https://picsum.photos/id/100/300/200",
  },
  {
    original: "https://picsum.photos/id/237/1600/1067",
    thumbnail: "https://picsum.photos/id/237/300/200",
  },
  {
    original: "https://picsum.photos/id/238/1600/1067",
    thumbnail: "https://picsum.photos/id/238/300/200",
  },
  {
    original: "https://picsum.photos/id/239/1600/1067",
    thumbnail: "https://picsum.photos/id/239/300/200",
  },
  {
    original: "https://picsum.photos/id/240/1600/1067",
    thumbnail: "https://picsum.photos/id/240/300/200",
  },
  {
    original: "https://picsum.photos/id/241/1600/1067",
    thumbnail: "https://picsum.photos/id/241/300/200",
  },
  {
    original: "https://picsum.photos/id/242/1600/1067",
    thumbnail: "https://picsum.photos/id/242/300/200",
  },
  {
    original: "https://picsum.photos/id/243/1600/1067",
    thumbnail: "https://picsum.photos/id/243/300/200",
  },
  {
    original: "https://picsum.photos/id/244/1600/1067",
    thumbnail: "https://picsum.photos/id/244/300/200",
  },
];

function ProductDetailPage() {
  const { id } = useParams();

  const {
    product,
    errorProduct,
    isErrorProduct,
    isLoadingProduct,
    refetchProduct,
  } = useProducts.useById(id);

  if (isLoadingProduct)
    return <LoadingState type="card" rows={20} columns={3} />;

  if (isErrorProduct)
    return (
      <ErrorMessage
        message={errorProduct.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProduct()}
      />
    );

  consoleObject(product);
  const {
    category_name,
    sub_category_name,
    brand_name,
    rating,
    rating_count,
    short_description,
    full_description,
    variant_types,
    variant_values,

    tags,
    variants,
  } = product;

  return (
    <div className="flex flex-col px-32 space-y-8">
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="max-w-[600px]">
          <ReactImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
          />
        </div>
        <div className="flex-1 space-y-8">
          <ProductInfoSection />
          <VariantsSection />
          <ActionButtons />
          <div className="border"></div>
          <ExtraInfoSection />
        </div>
      </div>
      <div className="border"></div>
      <div className="">
        <p>Description:</p>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae totam
          non, expedita, obcaecati molestiae in earum harum a debitis placeat
          saepe culpa id ipsum cum possimus eligendi pariatur modi eaque! Porro,
          in placeat autem rem necessitatibus ratione repellat quasi dicta
          eveniet numquam dolorem. Quas accusamus incidunt optio repellat et,
          placeat deleniti! Incidunt dignissimos quia minus beatae sed voluptas
          voluptatum natus.
        </p>
      </div>
    </div>
  );
}

export default ProductDetailPage;
