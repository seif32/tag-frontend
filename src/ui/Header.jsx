import { Link, useLocation } from "react-router";
import { ROUTES } from "@/constants";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: ROUTES.HOME },
    { name: "Products", path: ROUTES.PRODUCTS },
    { name: "Categories", path: ROUTES.CATEGORIES },
  ];

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-800">
            🛍️ ProductStore
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
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
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2 text-gray-600 hover:text-gray-800"
            >
              🛒
              {/* Static cart badge for UI */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center space-x-2">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
