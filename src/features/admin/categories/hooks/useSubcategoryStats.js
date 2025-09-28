import React from "react";

export const useSubcategoryStats = (
  allSubCategories,
  isLoadingAllSubCategories
) => {
  const flatSubCategories = React.useMemo(() => {
    if (!allSubCategories || isLoadingAllSubCategories) return [];
    return allSubCategories.data;
  }, [allSubCategories, isLoadingAllSubCategories]);

  return {
    flatSubCategories,
  };
};
