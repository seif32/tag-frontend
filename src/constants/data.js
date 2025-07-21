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
              path: "/admin/products/categories",
              iconName: "Tags",
            },
            {
              name: "Inventory",
              path: "/admin/products/inventory",
              iconName: "Warehouse",
              badge: {
                content: "12 Low",
                variant: "outline",
              },
            },
          ],
        },
      },
      {
        menuButton: {
          name: "Orders",
          path: "/admin/orders",
          iconName: "ShoppingCart",
          badge: {
            content: "5",
            variant: "destructive",
          },
          submenuButtons: [
            {
              name: "All Orders",
              path: "/admin/orders",
              iconName: "ShoppingCart",
            },
            {
              name: "Pending",
              path: "/admin/orders/pending",
              iconName: "RefreshCw",
              badge: {
                content: "5",
                variant: "secondary",
              },
            },
            {
              name: "Shipping",
              path: "/admin/orders/shipping",
              iconName: "Truck",
            },
            {
              name: "Payments",
              path: "/admin/orders/payments",
              iconName: "CreditCard",
            },
          ],
        },
      },
      {
        menuButton: {
          name: "Users",
          path: "/admin/users",
          iconName: "Users",
          submenuButtons: [
            {
              name: "All Users",
              path: "/admin/users",
              iconName: "Users",
            },
            {
              name: "Customers",
              path: "/admin/users/customers",
              iconName: "UserCheck",
            },
            {
              name: "Admins",
              path: "/admin/users/admins",
              iconName: "Shield",
            },
            {
              name: "Add User",
              path: "/admin/users/new",
              iconName: "UserPlus",
            },
          ],
        },
      },
    ],
  },
  {
    groupLabel: "Analytics",
    menuItems: [
      {
        menuButton: {
          name: "Analytics",
          path: "/admin/analytics",
          iconName: "BarChart3",
          badge: {
            content: "Pro",
            variant: "secondary",
          },
          submenuButtons: [
            {
              name: "Sales",
              path: "/admin/analytics/sales",
              iconName: "TrendingUp",
            },
            {
              name: "Revenue",
              path: "/admin/analytics/revenue",
              iconName: "DollarSign",
            },
            {
              name: "Reports",
              path: "/admin/analytics/reports",
              iconName: "PieChart",
            },
          ],
        },
      },
    ],
  },
  {
    groupLabel: "",
    menuItems: [
      {
        menuButton: {
          name: "Settings",
          path: "/admin/settings",
          iconName: "Settings",
        },
      },
    ],
  },
];
