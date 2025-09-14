import { MapPin, Phone } from "lucide-react";

function ShippingAddress({
  streetAddress,
  apartmentNumber,
  buildingNumber,
  city,
  postalCode,
  country,
  phoneNumber,
  description,
  className = "",
}) {
  // Format full street address
  const fullAddress = [buildingNumber, streetAddress, apartmentNumber]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`group relative overflow-hidden  border  rounded-2xl p-5  ${className}`}
    >
      {/* Header with subtle accent */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">
          Shipping Address
        </h4>
      </div>

      {/* Address content */}
      <div className="space-y-1.5">
        {description && (
          <p className="text-xs text-slate-500 italic mb-2">"{description}"</p>
        )}

        <p className="text-sm text-slate-800 font-medium leading-relaxed">
          {fullAddress}
        </p>

        <p className="text-sm text-slate-600">
          {city} {postalCode}
        </p>

        <p className="text-sm text-slate-600 capitalize">{country}</p>

        {phoneNumber && (
          <div className="flex items-center gap-1.5 pt-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm text-slate-600">{phoneNumber}</span>
          </div>
        )}
      </div>

      {/* Subtle corner accent */}
      {/* <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-2xl" /> */}
    </div>
  );
}

export default ShippingAddress;
