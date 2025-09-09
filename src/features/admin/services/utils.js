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
