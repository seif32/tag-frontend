export function toggleSection(section, setOpenSections) {
  setOpenSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
}

export function isActiveSection(basePath, location) {
  return location.pathname.startsWith(basePath);
}
