import { Link, useParams } from "react-router";
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { addDays, formatDateShort } from "@/utils/dateUtils";
import ShippingAddress from "../components/ShippingAddress";
import OrderReceipt from "../components/OrderReceipt";
import OrderContainer from "../components/OrderContainer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import IconCard from "@/ui/IconCard";
import useOrders from "@/hooks/useOrders";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { BsBackspaceReverse } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { generateOrderInvoicePDF } from "@/utils/generateInvoicePDF";
import { toast } from "sonner";
import { useState } from "react";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { order, isLoadingOrder, isErrorOrder, errorOrder, refetchOrder } =
    useOrders.useById(orderId);

  console.log(order);

  // 🚀 Handle invoice generation
  async function handleDownloadInvoice() {
    if (!order) return;

    setIsGeneratingPDF(true);
    try {
      await generateOrderInvoicePDF({
        ...order,
        items: order.items || [],
        bundles: order.bundles || [], // Include bundles
      });
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice generation failed:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  if (isLoadingOrder) return <LoadingState type="page" />;

  if (isErrorOrder)
    return (
      <ErrorMessage
        message={errorOrder.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchOrder()}
      />
    );

  return (
    <div className="flex flex-col">
      <Title
        onDownloadInvoice={handleDownloadInvoice}
        isGeneratingPDF={isGeneratingPDF}
      />
      <div className="flex flex-col gap-3 p-3 border rounded-3xl">
        <div className="flex flex-col gap-3 md:flex-row">
          <IconCard
            icon={TfiPackage}
            badge={order.order_status}
            title={`#${orderId}`}
            subtitle={"order id "}
          />
          <IconCard
            icon={LiaShippingFastSolid}
            subtitle={"Estimated Arrival"}
            title={formatDateShort(addDays(order.created_at, 5))}
          />

          <OrderReceipt
            order={order}
            isOrderDetails={false}
            style={"rounded-3xl border border-gray-200"}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-2">
            <OrderContainer
              items={order.items || []}
              bundles={order.bundles || []} // 🚀 Pass bundles
              style={"bg-white p-8 rounded-2xl border"}
            />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <ShippingAddress
              streetAddress={order.address.street_name}
              apartmentNumber={order.address.apartment_number}
              buildingNumber={order.address.building_number}
              city={order.address.city}
              postalCode={order.address.postal_code}
              country={order.address.country}
              description={order.address.description}
              phoneNumber={order.user.phone_number}
              className="bg-white "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

function Title({ onDownloadInvoice, isGeneratingPDF }) {
  return (
    <section className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-1.5 group">
          <FaArrowLeft className="text-accent size-3 group-hover:text-accent/70 cursor-pointer" />
          <Link
            to={"/orders"}
            className="text-accent group-hover:text-accent/70 text-sm"
          >
            Back to orders
          </Link>
        </div>
        <h1 className="mb-5 text-3xl">Order Details</h1>
      </div>
      <Button
        variant={"outline"}
        onClick={onDownloadInvoice}
        disabled={isGeneratingPDF}
        className={"text-xs "}
      >
        {isGeneratingPDF ? "📄 Generating..." : "Download Invoice"}
      </Button>
    </section>
  );
}
