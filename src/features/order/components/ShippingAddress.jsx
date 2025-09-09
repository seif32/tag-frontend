function ShippingAddress({
  streetAddress,
  city,
  postalCode,
  country,
  phoneNumber,
  style,
}) {
  return (
    <div className={`flex flex-col gap-1 ${style}`}>
      <h4 className="w-full font-bold">Shipping Address</h4>
      <div className="flex flex-col justify-between text-sm whitespace-nowrap ">
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
