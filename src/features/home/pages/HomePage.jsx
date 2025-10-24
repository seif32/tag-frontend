import { Button } from "@/components/ui/button";
import HeroImage from "@/assets/hero-product.png";
import BulkOrders from "@/assets/promo-bulk-orders.jpg";
import DeliveryNetwork from "@/assets/promo-delivery-network.jpg";
import MultiCategory from "@/assets/promo-multi-category.jpg";
import Hand from "@/assets/hand-home.png";
import {
  Headphones,
  MoveRight,
  Package,
  RefreshCcw,
  ShieldCheck,
  ShipIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import ProductCard from "@/features/products/components/ProductCard";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import useCategories from "@/hooks/useCategories";
import { IconEmptyState } from "@/ui/IconEmptyState";
import DashedIconEmptyState from "@/ui/DashedIconEmptyState";

function HomePage() {
  return (
    <main className="mb-10 space-y-25">
      <HeroBanner />
      <ServiceHighlights />
      <CategoriesSection />
      <FeaturedProducts />
      <BusinessHighlights />
      <Banner />
    </main>
  );
}

export default HomePage;

function HeroBanner() {
  return (
    <section className="flex justify-between gap-2 items-center ">
      <div className="flex-1 flex gap-5 flex-col">
        <h1 className="text-6xl font-bold capitalize">
          your <span className="text-accent">one-stop shop</span> for everything
          you need
        </h1>
        <p className="text-lg ">
          Fast shipping, friendly customer service, and secure transactions
          guaranteed
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={"/products"}>
            <Button className={"capitalize h-15 sm:w-55 w-full rounded-full"}>
              see all products
            </Button>
          </Link>
          <Link to={"/categories"}>
            <Button
              className={"capitalize h-15 sm:w-55 w-full rounded-full"}
              variant={"outline"}
            >
              shop by category
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 sm:block hidden">
        <img src={HeroImage} alt="hero-image" className="w-full h-full " />
      </div>
    </section>
  );
}

function CategoriesSection() {
  const {
    categories,
    errorCategories,
    isErrorCategories,
    isLoadingCategories,
    refetchCategories,
  } = useCategories.useAll({ limit: 4 });
  const navigate = useNavigate();

  if (isLoadingCategories) return <LoadingState />;

  if (isErrorCategories)
    return (
      <ErrorMessage
        message={errorCategories?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchCategories()}
      />
    );

  return (
    <section className="flex flex-col gap-3 w-full">
      <div className="w-full capitalize flex justify-between font-semibold ">
        <Link to={"/categories"} className="hover:text-accent">
          shop by categories
        </Link>
        <Link to={"/categories"} className="flex gap-1 hover:text-accent">
          <span>all departments</span>
          <MoveRight />
        </Link>
      </div>
      {categories?.data?.length === 0 ? (
        <DashedIconEmptyState
          title={"No Categories yet"}
          subtitle={"Will be added soon"}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ">
          {categories?.data?.map((category) => (
            <div
              key={category?.id}
              className="h-80 sm:h-100 bg-stone-200 relative hover:shadow transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`categories/${category?.id}/products`)}
            >
              <img
                src={category?.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white">
                <span className="font-semibold text-lg">{category?.name}</span>
                <p className="text-sm opacity-80">
                  +{category?.active_product_count || 0} items
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ServiceHighlights() {
  const services = [
    {
      id: 1,
      title: "Free Shipping",
      subtitle: "On all orders over $50",
      icon: ShipIcon,
    },
    {
      id: 2,
      title: "Money Guarantee",
      subtitle: "30-day money-back policy",
      icon: RefreshCcw,
    },
    {
      id: 3,
      title: "Secure Payment",
      subtitle: "100% protected checkout",
      icon: ShieldCheck,
    },
    {
      id: 4,
      title: "24/7 Support",
      subtitle: "We're here to help anytime",
      icon: Headphones,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-stone-100 py-6 md:py-9 px-4 md:px-8 rounded-md">
      {services?.map((service) => {
        const Icon = service?.icon;
        return (
          <div className="flex gap-3 items-center" key={service?.id}>
            <Icon className="w-10 h-10 md:w-11 md:h-11 text-accent flex-shrink-0" />
            <div className="capitalize flex flex-col">
              <span className="font-semibold text-sm md:text-base">
                {service?.title}
              </span>
              <span className="text-stone-500 font-medium text-xs">
                {service?.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function FeaturedProducts() {
  const navigate = useNavigate();
  const {
    products,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
    refetchProducts,
  } = useProducts.useAllWithoutVariants({ limit: 4, featured: 1, active: 1 });

  if (isLoadingProducts) return <LoadingState />;

  if (isErrorProducts)
    return (
      <ErrorMessage
        message={errorProducts?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchProducts()}
      />
    );

  function handleViewProductDetails(productId) {
    navigate(`products/${productId}`);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="capitalize flex justify-between font-semibold ">
        <Link to={"/products"} className="hover:text-accent">
          featured products
        </Link>
        <Link to={"/products"} className="flex gap-1 hover:text-accent">
          <span>all products</span>
          <MoveRight />
        </Link>
      </div>
      {products?.data?.length === 0 ? (
        <DashedIconEmptyState
          title={"No Featured Products yet"}
          subtitle={"Will be added soon"}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {products?.data?.map((product) => (
            <ProductCard
              key={product?.id}
              brand={product?.brand_name}
              category={product?.category_name}
              name={product?.name}
              productId={product?.id}
              onViewProductDetails={handleViewProductDetails}
              variantCount={product?.variant_count}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BusinessHighlights() {
  const navigate = useNavigate();
  const promos = [
    {
      id: 1,
      title: "Bulk Orders, Bigger Savings",
      subtitle: "Enjoy exclusive discounts on large-volume purchases.",
      image: BulkOrders,
      buttonText: "Start Ordering",
      buttonLink: "/products",
    },
    {
      id: 2,
      title: "Reliable Delivery Network",
      subtitle: "Fast, secure, and nationwide bulk shipping solutions.",
      image: DeliveryNetwork,
      buttonText: "Explore Shipping",
      buttonLink: "/products",
    },
    {
      id: 3,
      title: "Multi-Category Sourcing",
      subtitle: "Electronics, snacks, and more — all from verified suppliers.",
      image: MultiCategory,
      buttonText: "Browse Categories",
      buttonLink: "/categories",
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <p className="capitalize flex justify-between font-semibold ">
        What we offer?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 h-100 min-h-[600px] md:min-h-[600px]">
        {/* First promo takes full width on mobile, left column on desktop */}
        <div className="relative rounded-lg overflow-hidden lg:row-span-2">
          <img
            src={promos[0]?.image}
            alt={promos[0]?.title}
            className="w-full h-full object-cover min-h-[300px] md:min-h-full"
          />
          <div className="bg-black/45 w-full h-full absolute top-0 right-0" />
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-white space-y-2 md:space-y-3">
            <p className="text-xl md:text-2xl font-bold">{promos[0]?.title}</p>
            <p className="text-xs md:text-sm">{promos[0]?.subtitle}</p>
            <Button
              className="bg-stone-100 text-black hover:bg-stone-200 text-sm"
              onClick={() => navigate(promos[0]?.buttonLink)}
            >
              {promos[0]?.buttonText}
            </Button>
          </div>
        </div>

        {/* Second and third promos stack on mobile, right column on desktop */}
        {promos.slice(1).map((promo) => (
          <div key={promo?.id} className="relative rounded-lg overflow-hidden">
            <img
              src={promo?.image}
              alt={promo?.title}
              className="w-full h-full object-cover min-h-[250px] md:min-h-[290px]"
            />
            <div className="bg-black/45 w-full h-full absolute top-0 right-0" />
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-white space-y-2 md:space-y-3">
              <p className="text-xl md:text-2xl font-bold">{promo?.title}</p>
              <p className="text-xs md:text-sm">{promo?.subtitle}</p>
              <Button
                className="bg-stone-100 text-black hover:bg-stone-200 text-sm"
                onClick={() => navigate(promo?.buttonLink)}
              >
                {promo?.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Banner() {
  const navigate = useNavigate();
  return (
    <section className="relative h-80 bg-neutral-100 border px-8 pt-4 flex items-center">
      {/* Text content */}
      <div className="z-10 max-w-md">
        <h2 className="text-3xl font-bold mb-2">
          Power Your Business with Smart Sourcing
        </h2>
        <p className="text-stone-600 mb-4">
          Get access to reliable bulk suppliers and unbeatable deals on every
          order.
        </p>
        <button
          className="bg-accent text-white cursor-pointer px-5 py-2 rounded-full font-medium hover:bg-accent/80 transition"
          onClick={() => navigate("/products")}
        >
          Start Shopping
        </button>
      </div>

      {/* Banner image */}
      <div className="absolute right-8 top-0 bottom-0">
        <img
          src={Hand}
          alt="Business sourcing illustration"
          className="w-auto h-full object-contain object-right"
        />
      </div>
    </section>
  );
}
