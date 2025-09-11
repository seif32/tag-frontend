export default function IconCard({ icon: Icon, title, subtitle, badge }) {
  const statusMap = {
    pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
    shipped: { text: "Shipped", className: "bg-blue-100 text-blue-800" },
    delivered: { text: "Delivered", className: "bg-green-100 text-green-600" },
    cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },

    failed: { text: "Failed", className: "bg-red-100 text-red-800" },
    paid: { text: "Paid", className: "bg-green-100 text-green-600" },
    refunded: { text: "Refunded", className: "bg-gray-100 text-gray-700" },
  };

  const status = badge
    ? statusMap[badge] || {
        text: badge,
        className: "bg-gray-200 text-gray-600",
      }
    : null;

  return (
    <div className="flex flex-col justify-between w-full p-5 bg-white border min-h-40 rounded-3xl md:max-w-70  2xl:max-w-120">
      <div className="flex items-center justify-between">
        <Icon size={22} />
        {status && (
          <span
            className={`ml-auto px-2 py-1 text-xs rounded-full font-medium ${status.className}`}
          >
            {status.text}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-gray-400">{subtitle}</p>
        <p className="font-medium ">{title}</p>
      </div>
    </div>
  );
}
