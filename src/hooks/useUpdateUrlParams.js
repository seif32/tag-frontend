import { useSearchParams } from "react-router";

export function useUpdateUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  function updateUrlParams(newParams) {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    setSearchParams(updatedParams);
  }

  return updateUrlParams;
}
