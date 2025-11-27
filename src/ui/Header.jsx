import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { Link, useLocation, useNavigate } from "react-router";
import SearchInput from "./SearchInput";
import CartBadge from "@/features/cart/components/CartBadge";
import { useAuthStore } from "@/auth/store/authStore";
import { FiPackage, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const hasIncompleteProfile = useAuthStore(
    (state) => state.hasIncompleteProfile
  ); // 🆕
  const clearCart = useCartStore((state) => state.clearCart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🆕 Smart display name extraction
  const displayName =
    user?.first_name ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "User";

  console.log(user);

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
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur">
      {/* 🆕 Warning Banner for Incomplete Profile */}
      {isAuthenticated && hasIncompleteProfile && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 text-sm text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <span>
              ⚠️ Your profile isn't fully loaded.{" "}
              <span className="font-semibold">Some features may not work.</span>
            </span>
            <button className="px-3 py-1 rounded bg-amber-200 text-amber-900 hover:bg-amber-300 text-xs font-semibold whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link to={"/"} className="text-xl font-bold text-gray-800">
          TAG
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex items-center">
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

          {/* 🆕 Better User Display */}
          {isAuthenticated && (
            <p className="text-gray-700 text-sm flex items-center gap-2">
              Hi, <span className="font-semibold">{displayName}</span> 👋
              {hasIncompleteProfile && (
                <span className="text-xs text-amber-600 ml-1">
                  (profile incomplete)
                </span>
              )}
            </p>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search */}
          <div className="hidden md:block">
            <SearchInput />
          </div>

          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.CUSTOMER.ORDER_HISTORY}
                className="relative p-1.5 text-gray-600 hover:text-gray-800"
              >
                <FiPackage size={20} />
              </Link>
              <Link
                to={ROUTES.CUSTOMER.CART}
                className="relative p-1.5 text-gray-600 hover:text-gray-800"
                id="cart-icon"
              >
                <FiShoppingCart size={20} />
                <CartBadge />
              </Link>
              <Button
                onClick={handleLogout}
                size="sm"
                className="hidden md:block bg-red-500 hover:bg-red-600"
              >
                Log out
              </Button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
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
            className="p-2 md:hidden text-gray-600 hover:text-gray-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col p-4 space-y-3">
            {/* Mobile Search */}
            <div className="pb-3 border-b border-border">
              <SearchInput />
            </div>

            {/* Nav Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-600 hover:text-gray-800 py-2 transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 font-medium"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* 🆕 User Info with Warning */}
            {isAuthenticated && (
              <div className="pt-2 border-t border-border text-gray-700 text-sm">
                <p>
                  Hi, <span className="font-semibold">{displayName}</span> 👋
                </p>
                {hasIncompleteProfile && (
                  <div className="text-xs mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-800">
                    ⚠️ Your profile is incomplete.{" "}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/support");
                      }}
                      className="underline font-semibold"
                    >
                      Contact support
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 mt-2"
              >
                Log out
              </Button>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2 text-gray-600 hover:text-gray-800"
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
