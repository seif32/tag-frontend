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
      pending: "bg-yellow-100 text-yellow-800 ",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    },
    payment: {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
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
