// src/ui/layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ShoppingBag,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Package,
  Tags,
  Warehouse,
  CreditCard,
  Truck,
  RefreshCw,
  UserCheck,
  UserPlus,
  Shield,
  TrendingUp,
  PieChart,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";

function AdminLayout() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    products: false,
    orders: false,
    users: false,
    analytics: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 🎯 Check if current path matches any sub-item
  const isActiveSection = (basePath) => {
    return location.pathname.startsWith(basePath);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar className="border-r">
          <SidebarContent>
            {/* 🏢 Brand Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">TAG</h2>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>

            {/* 📊 Main Dashboard */}
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin"}
                    >
                      <NavLink to="/admin">
                        <Home className="h-4 w-4" />
                        <span>Overview</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* 🛍️ E-commerce Section */}
            <SidebarGroup>
              <SidebarGroupLabel>E-commerce</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* 📦 Products with Sub-menu */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleSection("products")}
                      isActive={isActiveSection("/admin/products")}
                      className="w-full justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Products</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openSections.products ||
                          isActiveSection("/admin/products")
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </SidebarMenuButton>

                    {/* Products Sub-menu */}
                    {(openSections.products ||
                      isActiveSection("/admin/products")) && (
                      <SidebarMenuSub className="transition-all duration-200">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === "/admin/products"}
                          >
                            <NavLink to="/admin/products">
                              <Package className="h-4 w-4" />
                              <span>All Products</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/products/categories"
                            }
                          >
                            <NavLink to="/admin/products/categories">
                              <Tags className="h-4 w-4" />
                              <span>Categories</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/products/inventory"
                            }
                          >
                            <NavLink to="/admin/products/inventory">
                              <Warehouse className="h-4 w-4" />
                              <span>Inventory</span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                12 Low
                              </Badge>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>

                  {/* 🛒 Orders with Sub-menu */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleSection("orders")}
                      isActive={isActiveSection("/admin/orders")}
                      className="w-full justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          5
                        </Badge>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openSections.orders ||
                            isActiveSection("/admin/orders")
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </div>
                    </SidebarMenuButton>

                    {/* Orders Sub-menu */}
                    {(openSections.orders ||
                      isActiveSection("/admin/orders")) && (
                      <SidebarMenuSub className="transition-all duration-200">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === "/admin/orders"}
                          >
                            <NavLink to="/admin/orders">
                              <ShoppingCart className="h-4 w-4" />
                              <span>All Orders</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/orders/pending"
                            }
                          >
                            <NavLink to="/admin/orders/pending">
                              <RefreshCw className="h-4 w-4" />
                              <span>Pending</span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-xs"
                              >
                                5
                              </Badge>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/orders/shipping"
                            }
                          >
                            <NavLink to="/admin/orders/shipping">
                              <Truck className="h-4 w-4" />
                              <span>Shipping</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/orders/payments"
                            }
                          >
                            <NavLink to="/admin/orders/payments">
                              <CreditCard className="h-4 w-4" />
                              <span>Payments</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>

                  {/* 👥 Users with Sub-menu */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleSection("users")}
                      isActive={isActiveSection("/admin/users")}
                      className="w-full justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openSections.users || isActiveSection("/admin/users")
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </SidebarMenuButton>

                    {/* Users Sub-menu */}
                    {(openSections.users ||
                      isActiveSection("/admin/users")) && (
                      <SidebarMenuSub className="transition-all duration-200">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === "/admin/users"}
                          >
                            <NavLink to="/admin/users">
                              <Users className="h-4 w-4" />
                              <span>All Users</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/users/customers"
                            }
                          >
                            <NavLink to="/admin/users/customers">
                              <UserCheck className="h-4 w-4" />
                              <span>Customers</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/users/admins"
                            }
                          >
                            <NavLink to="/admin/users/admins">
                              <Shield className="h-4 w-4" />
                              <span>Admins</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === "/admin/users/new"}
                          >
                            <NavLink to="/admin/users/new">
                              <UserPlus className="h-4 w-4" />
                              <span>Add User</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* 📊 Analytics Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleSection("analytics")}
                      isActive={isActiveSection("/admin/analytics")}
                      className="w-full justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Pro
                        </Badge>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openSections.analytics ||
                            isActiveSection("/admin/analytics")
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </div>
                    </SidebarMenuButton>

                    {/* Analytics Sub-menu */}
                    {(openSections.analytics ||
                      isActiveSection("/admin/analytics")) && (
                      <SidebarMenuSub className="transition-all duration-200">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/analytics/sales"
                            }
                          >
                            <NavLink to="/admin/analytics/sales">
                              <TrendingUp className="h-4 w-4" />
                              <span>Sales</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/analytics/revenue"
                            }
                          >
                            <NavLink to="/admin/analytics/revenue">
                              <DollarSign className="h-4 w-4" />
                              <span>Revenue</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              location.pathname === "/admin/analytics/reports"
                            }
                          >
                            <NavLink to="/admin/analytics/reports">
                              <PieChart className="h-4 w-4" />
                              <span>Reports</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* ⚙️ Settings Section */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === "/admin/settings"}
                    >
                      <NavLink to="/admin/settings">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* 🎯 Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* 🎨 Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-4">
              {/* 📱 Mobile Sidebar Trigger */}
              <SidebarTrigger className="md:hidden" />

              {/* 🔍 Search & Actions */}
              <div className="flex-1" />

              {/* 🔔 Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* 👨‍💼 User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/admin-avatar.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">John Admin</p>
                    <p className="text-xs text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* 📄 Main Content */}
          <main className="flex-1 overflow-auto bg-muted/10">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
