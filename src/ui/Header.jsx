import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { Link, useLocation, useNavigate } from "react-router";
import SearchInput from "./SearchInput";
import CartBadge from "@/features/cart/components/CartBadge";
import { useAuthStore } from "@/auth/store/authStore";
import {
  FiPackage,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiAlertTriangle,
} from "react-icons/fi";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const hasIncompleteProfile = useAuthStore(
    (state) => state.hasIncompleteProfile
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName =
    user?.first_name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "User";

  // Get initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return displayName[0]?.toUpperCase() || "U";
  };

  function handleLogout() {
    clearCart();
    logout();
    navigate("/");
    localStorage.setItem("isAgeVerified", "false");
    setIsMenuOpen(false);
  }

  const navItems = [
    { name: "Home", path: ROUTES.CUSTOMER.HOME },
    { name: "Products", path: ROUTES.CUSTOMER.PRODUCTS },
    { name: "Categories", path: ROUTES.CUSTOMER.CATEGORIES },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur bg-white/95">
      {/* Warning Banner for Incomplete Profile */}
      {isAuthenticated && hasIncompleteProfile && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 text-sm text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="flex-shrink-0" />
              <span>
                Your profile isn't fully loaded.{" "}
                <span className="font-semibold">
                  Some features may not work.
                </span>
              </span>
            </div>
            <button className="px-3 py-1 rounded bg-amber-200 text-amber-900 hover:bg-amber-300 text-xs font-semibold whitespace-nowrap transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-xl font-bold text-gray-800 hover:text-gray-900 transition-colors"
        >
          TAG
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-gray-600 hover:text-gray-800 transition-colors ${
                location.pathname === item.path
                  ? "text-blue-600 font-medium"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search */}
          <div className="hidden md:block">
            <SearchInput />
          </div>

          {isAuthenticated ? (
            <>
              {/* Orders */}
              <Link
                to={"/orders"}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                title="My Orders"
              >
                <FiPackage size={20} />
              </Link>

              {/* Cart */}
              <Link
                to={ROUTES.CUSTOMER.CART}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                id="cart-icon"
                title="Shopping Cart"
              >
                <FiShoppingCart size={20} />
                <CartBadge />
              </Link>

              {/* 🆕 User Profile Dropdown (Desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {displayName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {displayName}
                      </p>
                      {user?.email && (
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      )}
                      {hasIncompleteProfile && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <FiAlertTriangle size={12} />
                          Profile incomplete
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={ROUTES.CUSTOMER.ORDER_HISTORY}
                      className="cursor-pointer"
                    >
                      <FiPackage className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={"/chat"} className="cursor-pointer">
                      <FiUser className="mr-2 h-4 w-4" />
                      Support Chat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                Login
              </Link>
              <Button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-white bg-primary hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 md:hidden text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white shadow-lg">
          <nav className="flex flex-col p-4 space-y-3 max-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="pb-3 border-b border-border">
              <SearchInput />
            </div>

            {/* 🆕 User Info Card (Mobile) */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {displayName}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                  )}
                  {hasIncompleteProfile && (
                    <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                      <FiAlertTriangle size={12} />
                      Profile incomplete
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Nav Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-600 hover:text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 font-medium bg-blue-50"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <div className="pt-2 border-t border-border" />
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <FiLogOut size={16} />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/register");
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
