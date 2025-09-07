import { useForm } from "react-hook-form";
import CheckoutForm from "../components/CheckoutForm";
import CustomerInfo from "../components/CustomerInfo";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import ShippingMethod from "../components/ShippingMethod";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import OrderSummary from "../components/OrderSummary";

const formSchema = z.object({
  street_address: z.string().min(1, "Street address is required"),
  apartment: z.string().min(1, "Apartment is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  // location_url: z.string().url("Please enter a valid URL").optional(),
  is_default: z.boolean(),
});

function CheckoutPage() {
  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      city: "",
      street_address: "",
      apartment: "",
      postal_code: "",
      location_url: "",
      is_default: true,
    },
  });

  const navigate = useNavigate();

  function onSubmit(data) {
    console.log(data);
    navigate(`/order/success/1`);
  }
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="flex items-center gap-1 w-fit hover:text-accent"
        variant={"ghost"}
        onClick={() => navigate("/cart")}
      >
        <IoArrowBack />
        <p>Back to cart</p>
      </Button>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-col gap-3 flex-2">
          <CustomerInfo />
          <CheckoutForm form={form} onSubmit={onSubmit} />
          {/* <ShippingMethod /> */}
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <OrderSummary delivery={45} discount={32} tax={0} total={1500} />
          <div className="p-6 bg-white border rounded-xl">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              Complete Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
