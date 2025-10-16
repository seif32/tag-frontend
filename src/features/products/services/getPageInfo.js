export function getPageInfo(products, categoryId, subcategoryId) {
  if (!products?.data || products.data.length === 0) {
    return {
      title: "Products",
      subtitle: null,
      breadcrumb: [
        { name: "Home", path: "/" },
        { name: "All Products", path: null },
      ],
    };
  }

  const firstProduct = products.data[0];
  const categoryName = firstProduct.category_name;
  const subcategoryName = firstProduct.sub_category_name;

  if (subcategoryId && subcategoryName) {
    return {
      title: subcategoryName,
      subtitle: `in ${categoryName}`,
      breadcrumb: [
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
        { name: categoryName, path: `/categories/${categoryId}` },
        { name: subcategoryName, path: null },
      ],
    };
  }

  if (categoryId && categoryName) {
    return {
      title: categoryName,
      subtitle: "Products",
      breadcrumb: [
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
        { name: categoryName, path: null },
      ],
    };
  }

  return {
    title: "All Products",
    subtitle: null,
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "All Products", path: null },
    ],
  };
}
