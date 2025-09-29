import { useForm } from "react-hook-form";
import CheckoutForm from "../components/CheckoutForm";
import { Button } from "@/components/ui/button";
import z from "zod";
import { IoArrowBack } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router";
import OrderSummary from "../components/OrderSummary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/auth/store/authStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import useAddress from "@/hooks/useAddress";
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useCartStore } from "@/store/cartStore";
import useOrders from "@/hooks/useOrders";
import { useOrderStore } from "@/store/orderStore";

const formSchema = z.object({
  description: z.string().optional(),
  city_id: z.coerce.string().min(1, "City is required"), // 🔥 Auto converts any type to string
  postal_code: z.string().min(1, "Postal code is required"),
  location_url: z.string().optional(),
  is_default: z.boolean(),
  apartment_number: z.string().min(1, "Apartment is required"),
  building_number: z.string().min(1, "Building is required"),
  street_name: z.string().min(1, "Street address is required"),
});

function CheckoutPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      city_id: "", // Keep as empty string
      postal_code: "",
      country: "uk",
      location_url: "",
      is_default: true,
      apartment_number: "",
      building_number: "",
      street_name: "",
    },
  });

  const [selectAddress, setSelectAddress] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  const navigate = useNavigate();
  const promoCode = useCartStore((state) => state.promoCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const taxPercent = useCartStore((state) => state.taxPercent);
  const shippingAmount = useCartStore((state) => state.shippingAmount);
  const setOrderSuccess = useOrderStore((state) => state.setOrderSuccess);
  const order = useOrderStore((state) => state.order);
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.cartItems);

  const { createAddressAsync, isPendingAddresses: isCreatingAddress } =
    useAddress.useCreate();
  const { updateAddressAsync, isPendingAddresses: isUpdatingAddress } =
    useAddress.useUpdate();
  const { createOrderAsync, isPendingOrders } = useOrders.useCreate();
  const {
    addresses,
    isLoadingAddresses,
    isErrorAddresses,
    errorAddresses,
    refetchAddresses,
  } = useAddress.useByUserId(user?.id, { limit: 9999999 });

  const isBusy =
    isCreatingAddress ||
    isUpdatingAddress ||
    isPendingOrders ||
    isLoadingAddresses;

  async function onSubmit(address) {
    try {
      let addressId;

      if (!selectAddress) {
        // const payload = {
        //   ...address,
        //   city_id: Number(address.city_id), // Convert to number for API
        // };
        const newAddressData = await createAddressAsync(address);
        addressId = newAddressData.id;
      } else if (!isEditMode) {
        addressId = selectAddress.id;
      } else {
        await updateAddressAsync({ id: selectAddress.id, data: address });
        addressId = selectAddress.id;
      }

      const order = {
        user_id: user?.id,
        address_id: addressId,
        // tax_percent: taxPercent,
        shipping_amount: shippingAmount,
        promo_code_id: promoCode || null,
        items: cartItems.map((item) => ({
          variant_id: item.id,
          quantity: item.quantity,
        })),
      };

      const newOrderData = await createOrderAsync(order);

      setOrderSuccess(newOrderData);

      navigate(`/order/success/${newOrderData.id}`);
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  }

  if (cartItems.length === 0 && !order) return <Navigate to="/cart" replace />;

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
          <CheckoutForm
            form={form}
            onSubmit={onSubmit}
            addresses={addresses?.data}
            selectAddress={selectAddress}
            setSelectAddress={setSelectAddress}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            isLoadingAddresses={isLoadingAddresses}
            errorAddresses={errorAddresses}
            isErrorAddresses={isErrorAddresses}
            refetchAddresses={refetchAddresses}
          />

          <AddressGuide />
          {/* <ShippingMethod /> */}
        </div>
        <div className="flex flex-col flex-1 gap-3">
          <OrderSummary />
          <ActionButton form={form} isBusy={isBusy} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

function CustomerInfo() {
  const user = useAuthStore((state) => state.user);
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="flex flex-col gap-6 px-6 py-6 bg-white border border-gray-200 rounded-xl">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Customer Information</h2>
        <div className="border border-gray-100"></div>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="">
          <span className="mr-2 text-muted-foreground">Name:</span> {fullName}
        </p>
        <p className="">
          <span className="mr-2 text-muted-foreground">Email:</span>{" "}
          {user.email}
        </p>
        <p className="">
          <span className="mr-2 text-muted-foreground">Phone:</span>{" "}
          {formatPhoneNumber(user.phone_number)}
        </p>
      </div>
    </div>
  );
}

function AddressGuide() {
  return (
    <div className="mb-6 p-4 bg-accent/6 border border-accent/30 rounded-xl">
      <div className="flex items-start gap-2 mb-3">
        {/* <CiCircleInfo /> */}
        <h3 className="text-sm font-semibold text-accent">
          Quick Address Guide
        </h3>
      </div>

      <div className="space-y-3">
        {/* First Time User */}
        <div className="flex items-start gap-2">
          <div>
            <CiCircleInfo className="text-accent w-5 h-5" />
          </div>{" "}
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">First time?</span> Just fill in the
              fields, review the total, and complete your order.
            </p>
          </div>
        </div>

        {/* Returning User */}
        <div className="flex items-start gap-2">
          <div>
            <CiCircleInfo className="text-accent w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Returning customer?</span> Your
              saved addresses are in the dropdown above - pick whatever suits
              you best!
            </p>
          </div>
        </div>

        {/* Edit Mode */}
        <div className="flex items-start gap-2">
          <div>
            <CiCircleInfo className="text-accent w-5 h-5" />
          </div>{" "}
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Need to edit?</span> Select a saved
              address and click "Edit" to make changes, then proceed to complete
              your order.
            </p>
          </div>
        </div>

        {/* Cancel Edit */}
        <div className="flex items-center gap-2">
          <div>
            <CiCircleInfo className="text-accent w-5 h-5" />
          </div>{" "}
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Changed your mind?</span> Click
              "Cancel" while editing to restore the original values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ form, onSubmit, isBusy }) {
  return (
    <div className="p-6 bg-white border rounded-xl">
      <Button
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        className={`w-full flex items-center justify-center gap-2 ${
          isBusy && "bg-accent/50  hover:cursor-not-allowed hover:bg-accent/50"
        }`}
        disabled={isBusy}
      >
        {isBusy ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Completing...</span>
          </>
        ) : (
          "Complete Order"
        )}
      </Button>
    </div>
  );
}
