import authApi from "@/auth/services/authApi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { Link, useLocation } from "react-router";
import SearchInput from "./SearchInput";
import { useCartStore } from "@/store/cartStore";
import CartBadge from "@/features/cart/components/CartBadge";

const Header = () => {
  const location = useLocation();

  const uniqueItems = useCartStore((state) => state.uniqueItems);

  async function handleLogout() {}

  const navItems = [
    { name: "Home", path: ROUTES.CUSTOMER.HOME },
    { name: "Products", path: ROUTES.CUSTOMER.PRODUCTS },
    { name: "Categories", path: ROUTES.CUSTOMER.CATEGORIES },
  ];

  return (
    <header className="flex items-center justify-between h-16 px-8">
      {/* Logo */}
      <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-800">
        TAG
      </Link>

      {/* Navigation */}
      <nav className="hidden space-x-8 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`text-gray-600 hover:text-gray-800 transition-colors ${
              location.pathname === item.path ? "text-blue-600 font-medium" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* ✅ Replace the basic input with SearchInput component */}
        <div className="hidden md:block">
          <SearchInput />
        </div>

        {/* Cart */}
        <Link
          to={ROUTES.CUSTOMER.CART}
          id="cart-icon"
          className="relative p-2 text-gray-600 hover:text-gray-800"
        >
          🛒
          <CartBadge />
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center space-x-2">
          <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
          <Button
            onClick={handleLogout}
            className="px-4 py-2 text-white transition-colors rounded-lg hover:bg-primary/90 bg-primary"
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Mobile menu toggle */}
      <button className="p-2 md:hidden">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;
