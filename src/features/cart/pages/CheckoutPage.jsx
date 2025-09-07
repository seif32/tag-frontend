import { useForm } from "react-hook-form";
import CheckoutForm from "../components/CheckoutForm";
import CustomerInfo from "../components/CustomerInfo";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
    resolver: zodResolver(formSchema),
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

  function onSubmit(data) {
    console.log(data);
  }
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-3 flex-2">
        <CustomerInfo />
        <CheckoutForm form={form} onSubmit={onSubmit} />
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <div className="p-6 border rounded-xl">Summary</div>
        <div className="p-6 border rounded-xl">
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
  );
}

export default CheckoutPage;
