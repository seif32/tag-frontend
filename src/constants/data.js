export const AdminSidebarGroups = [
  {
    groupLabel: "Dashboard",
    menuItems: [
      {
        menuButton: {
          name: "Overview",
          path: "/admin",
          iconName: "Home",
        },
      },
    ],
  },
  {
    groupLabel: "E-commerce",
    menuItems: [
      {
        menuButton: {
          name: "Products",
          path: "/admin/products",
          iconName: "ShoppingBag",
          submenuButtons: [
            {
              name: "All Products",
              path: "/admin/products",
              iconName: "Package",
            },
            {
              name: "Categories",
              path: "/admin/categories",
              iconName: "Tags",
            },
          ],
        },
      },
      {
        menuButton: {
          name: "Catalog",
          path: "/admin/catalog",
          iconName: "Package",
          submenuButtons: [
            {
              name: "Brands",
              path: "/admin/brands",
              iconName: "Award",
            },
            {
              name: "Tags",
              path: "/admin/tags",
              iconName: "Tag",
            },
            {
              name: "Variants",
              path: "/admin/variants",
              iconName: "SwatchBook",
            },
          ],
        },
      },
      {
        menuButton: {
          name: "Orders",
          path: "/admin/orders",
          iconName: "ShoppingCart",
          submenuButtons: [
            {
              name: "All Orders",
              path: "/admin/orders",
              iconName: "ShoppingBasket",
            },
            {
              name: "Shipping",
              path: "/admin/shipping",
              iconName: "Truck",
            },
            {
              name: "Promo codes",
              path: "/admin/promo-codes",
              iconName: "TicketPercent",
            },
          ],
        },
      },
    ],
  },
  {
    groupLabel: "Preferences",
    menuItems: [
      {
        menuButton: {
          name: "Settings",
          path: "/admin/settings",
          iconName: "Settings",
        },
      },
      {
        menuButton: {
          name: "Chats",
          path: "/admin/chat",
          iconName: "MessageCircleMore",
        },
      },
    ],
  },
];
