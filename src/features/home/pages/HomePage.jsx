import { Button } from "@/components/ui/button";
import HeroImage from "@/assets/hero-product.png";
import Product1 from "@/assets/product2.jpg";
import Product2 from "@/assets/product7.jpg";
import Product3 from "@/assets/product4.jpg";
import Product4 from "@/assets/product5.jpg";
import BulkOrders from "@/assets/promo-bulk-orders.jpg";
import DeliveryNetwork from "@/assets/promo-delivery-network.jpg";
import MultiCategory from "@/assets/promo-multi-category.jpg";
import Hand from "@/assets/hand-home.png";
import {
  ArrowRight,
  Headphones,
  MoveRight,
  RefreshCcw,
  ShieldCheck,
  ShipIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import ProductCard from "@/features/products/components/ProductCard";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";

function HomePage() {
  return (
    <main className="mb-10 space-y-25">
      <HeroBanner />
      <ServiceHighlights />
      <CategoriesSection />
      <BusinessHighlights />
      <FeaturedProducts />
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
        <div className="flex gap-2">
          <Button className={"capitalize"}>see all products</Button>
          <Button className={"capitalize"} variant={"outline"}>
            shop by category
          </Button>
        </div>
      </div>
      <div className="flex-1 ">
        <img src={HeroImage} alt="hero-image" className="w-full h-full " />
      </div>
    </section>
  );
}

function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      img: Product1,
    },
    {
      id: 2,
      name: "Tablets",
      img: Product2,
    },
    {
      id: 3,
      name: "Candies",
      img: Product3,
    },
    {
      id: 3,
      name: "Toys",
      img: Product4,
    },
  ];
  return (
    <section className="flex flex-col gap-3">
      <div className="capitalize flex justify-between font-semibold ">
        <Link className="hover:text-accent">shop by categories</Link>
        <Link className="flex gap-1 hover:text-accent">
          <span>all departments</span>
          <MoveRight />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {categories?.map((category) => (
          <div
            key={category?.id}
            className="h-100 bg-stone-200 relative hover:shadow transition-all duration-300 cursor-pointer"
          >
            <img
              src={category?.img}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white">
              <span className="font-semibold text-lg">{category?.name}</span>
              <p className="text-sm opacity-80">
                +{category?.itemCount || 0} items
              </p>
            </div>
          </div>
        ))}
      </div>
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
      subtitle: "We’re here to help anytime",
      icon: Headphones,
    },
  ];
  return (
    <section className="flex justify-between bg-stone-100 py-9 px-8 rounded-md">
      {services?.map((service) => {
        const Icon = service?.icon;
        return (
          <div className="flex gap-2 items-center" key={service?.id}>
            <Icon className="size-11 text-accent" />
            <div className="capitalize flex flex-col">
              <span className="font-semibold">{service?.title}</span>
              <span className="text-stone-400 font-medium text-xs">
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
  } = useProducts.useAllWithoutVariants({ limit: 4 });

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
        <Link className="hover:text-accent">featured products</Link>
        <Link to={"/products"} className="flex gap-1 hover:text-accent">
          <span>all products</span>
          <MoveRight />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
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
      style: "row-span-full border",
    },
    {
      id: 2,
      title: "Reliable Delivery Network",
      subtitle: "Fast, secure, and nationwide bulk shipping solutions.",
      image: DeliveryNetwork,
      buttonText: "Explore Shipping",
      buttonLink: "/products",
      style: "col-start-2 border",
    },
    {
      id: 3,
      title: "Multi-Category Sourcing",
      subtitle: "Electronics, snacks, and more — all from verified suppliers.",
      image: MultiCategory,
      buttonText: "Browse Categories",
      buttonLink: "/categories",
      style: "col-start-2 border",
    },
  ];

  return (
    <section className="grid grid-cols-2 grid-rows-2 h-110 gap-5">
      {promos?.map((promo) => (
        <div key={promo?.id} className={`${promo?.style} relative`}>
          <img
            src={promo?.image}
            alt="pic"
            className="w-full h-full object-cover"
          />
          <div className="bg-black/45 w-full h-full absolute top-0 right-0" />
          <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-3">
            <p className="text-2xl font-bold">{promo?.title}</p>
            <p className="text-sm">{promo?.subtitle}</p>
            <Button
              className={"bg-stone-100 text-black"}
              onClick={() => navigate(promo?.buttonLink)}
            >
              {promo?.buttonText}
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}

function Banner() {
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
        <button className="bg-accent text-white px-5 py-2 rounded-full font-medium hover:bg-accent/80 transition">
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
