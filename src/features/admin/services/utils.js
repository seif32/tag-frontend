export function toggleSection(section, setOpenSections) {
  setOpenSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
}

export function isActiveSection(basePath, location) {
  return location.pathname.startsWith(basePath);
}

export function isOrderFromToday(orderDate) {
  const today = new Date();
  const orderCreated = new Date(orderDate);

  return (
    today.getDate() === orderCreated.getDate() &&
    today.getMonth() === orderCreated.getMonth() &&
    today.getFullYear() === orderCreated.getFullYear()
  );
}

export const getStatusColor = (status, type = "item") => {
  if (!status) return "bg-gray-100 text-gray-800";

  const normalizedStatus = status.toLowerCase();

  const statusMap = {
    order: {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    },
    payment: {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-purple-100 text-purple-800",
    },
    item: {
      fulfilled: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      backordered: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-purple-100 text-purple-800",
    },
  };

  return statusMap[type]?.[normalizedStatus] || "bg-gray-100 text-gray-800";
};

// Helper functions
export function calculateTaxRate(location, items) {
  // UK: 20%, Egypt: 14%, etc.
  const taxRates = {
    uk: 20,
    eg: 14,
    us: 8.5, // average
  };
  return taxRates[location.country] || 0;
}

export function calculateShippingCost(address, items, method = "standard") {
  // Free shipping over £50
  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (totalValue >= 50) return 0;

  // Otherwise calculate based on distance/method
  return method === "express" ? 15 : 8;
}
