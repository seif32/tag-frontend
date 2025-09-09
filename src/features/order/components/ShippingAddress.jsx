function ShippingAddress({
  streetAddress,
  city,
  postalCode,
  country,
  phoneNumber,
}) {
  return (
    <div className="gap-1 flex flex-col ">
      <h4 className="font-bold w-full">Shipping Address</h4>
      <div className="flex flex-col  text-sm whitespace-nowrap justify-between ">
        <span>{streetAddress}</span>
        <span>
          {city}, {postalCode}
        </span>
        <span>{country}</span>
        <span className="">Phone: {phoneNumber}</span>
      </div>
    </div>
  );
}

export default ShippingAddress;
