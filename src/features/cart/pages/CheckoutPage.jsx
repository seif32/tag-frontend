import { useForm } from "react-hook-form";
import CheckoutForm from "../components/CheckoutForm";
import { Button } from "@/components/ui/button";
import z from "zod";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import OrderSummary from "../components/OrderSummary";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/auth/store/authStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import useAddress from "@/hooks/useAddress";
import LoadingState from "@/ui/LoadingState";
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useCartStore } from "@/store/cartStore";
import {
  calculateShippingCost,
  calculateTaxRate,
} from "@/features/admin/services/utils";
import useOrders from "@/hooks/useOrders";

const formSchema = z.object({
  description: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
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
      city: "",
      postal_code: "",
      country: "",
      location_url: "",
      is_default: true,
      apartment_number: "",
      building_number: "",
      street_name: "",
    },
  });

  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const promoCode = useCartStore((state) => state.promoCode);
  const clearCart = useCartStore((state) => state.clearCart);

  const { createAddressAsync, isPendingAddresses: isCreatingAddress } =
    useAddress.useCreate();
  const { updateAddressAsync, isPendingAddresses: isUpdatingAddress } =
    useAddress.useUpdate();
  const { addresses, isLoadingAddresses, isErrorAddresses, errorAddresses } =
    useAddress.useByUserId(1);
  const { createOrderAsync, isPendingOrders } = useOrders.useCreate();

  const [selectAddress, setSelectAddress] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  if (isLoadingAddresses) return <LoadingState />;

  // function onSubmit(address) {
  //   let addressId;

  //   // const calculatedTax = calculateTaxRate(address, cartItems);
  //   // const calculatedShipping = calculateShippingCost(
  //   //   address,
  //   //   cartItems,
  //   //   shippingMethod
  //   // );

  //   const calculatedTax = 65;
  //   const calculatedShipping = 50;

  //   if (!selectAddress) {
  //     console.log("Creating new address...");

  //     createAddress(address, {
  //       onSuccess: (newAddressData) => {
  //         console.log("Address created successfully:", newAddressData);
  //         addressId = newAddressData.id;

  //         const order = {
  //           user_id: 1,
  //           address_id: addressId,
  //           tax_percent: calculatedTax,
  //           shipping_amount: calculatedShipping,
  //           promo_code_id: promoCode || null,
  //           items: cartItems.map((item) => ({
  //             variant_id: item.id,
  //             quantity: item.quantity,
  //           })),
  //         };

  //         console.log("Order object:", order);
  //         createOrder(order, {
  //           onSuccess: (newOrderData) => {
  //             navigate(`/order/success/${newOrderData.order.id}`);
  //             clearCart();
  //           },
  //         });
  //       },
  //     });
  //   } else if (!isEditMode) {
  //     console.log("Using existing address without changes...", selectAddress);
  //     addressId = selectAddress.id;

  //     const order = {
  //       user_id: 1,
  //       address_id: addressId,
  //       tax_percent: calculatedTax,
  //       shipping_amount: calculatedShipping,
  //       promo_code_id: promoCode || null,
  //       items: cartItems.map((item) => ({
  //         variant_id: item.id,
  //         quantity: item.quantity,
  //       })),
  //     };

  //     console.log("Order object:", order);
  //     createOrder(order, {
  //       onSuccess: (newOrderData) => {
  //         navigate(`/order/success/${newOrderData.order.id}`);
  //         clearCart();
  //       },
  //     });
  //   } else {
  //     console.log("Updating existing address...", address);

  //     updateAddress(
  //       { id: selectAddress.id, data: address },
  //       {
  //         onSuccess: () => {
  //           addressId = selectAddress.id;

  //           const order = {
  //             user_id: 1,
  //             address_id: addressId,
  //             tax_percent: calculatedTax,
  //             shipping_amount: calculatedShipping,
  //             promo_code_id: promoCode || null,
  //             items: cartItems.map((item) => ({
  //               variant_id: item.id,
  //               quantity: item.quantity,
  //             })),
  //           };

  //           console.log("Order object:", order);
  //           createOrder(order, {
  //             onSuccess: (newOrderData) => {
  //               navigate(`/order/success/${newOrderData.order.id}`);
  //               clearCart();
  //             },
  //           });
  //         },
  //       }
  //     );
  //   }
  // }

  async function onSubmit(address) {
    try {
      let addressId;

      // const calculatedTax = calculateTaxRate(address, cartItems);
      // const calculatedShipping = calculateShippingCost(
      //   address,
      //   cartItems,
      //   shippingMethod
      // );

      const calculatedTax = 65;
      const calculatedShipping = 50;

      if (!selectAddress) {
        const newAddressData = await createAddressAsync(address);
        addressId = newAddressData.id;
        console.log("1 addressId", addressId);
      } else if (!isEditMode) {
        addressId = selectAddress.id;
        console.log("2 addressId", addressId);
      } else {
        await updateAddressAsync({ id: selectAddress.id, data: address });
        addressId = selectAddress.id;
        console.log("3 addressId", addressId);
      }

      const order = {
        user_id: 1,
        address_id: addressId,
        tax_percent: calculatedTax,
        shipping_amount: calculatedShipping,
        promo_code_id: promoCode || null,
        items: cartItems.map((item) => ({
          variant_id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("order", order);

      const newOrderData = await createOrderAsync(order);

      navigate(`/order/success/${newOrderData.order.id}`);
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
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
          <CheckoutForm
            form={form}
            onSubmit={onSubmit}
            addresses={addresses?.data}
            selectAddress={selectAddress}
            setSelectAddress={setSelectAddress}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />

          <AddressGuide />
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
