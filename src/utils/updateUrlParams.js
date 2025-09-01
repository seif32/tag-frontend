export function updateUrlParams(newParams, searchParams, setSearchParams) {
  const updatedParams = new URLSearchParams(searchParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value && value !== "") {
      updatedParams.set(key, value);
    } else {
      updatedParams.delete(key);
    }
  });

  setSearchParams(updatedParams);
}
