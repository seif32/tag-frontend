import { Link } from "react-router";
import { ROUTES } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🛍️ ProductStore</h3>
            <p className="text-gray-400">
              Your one-stop shop for all categories of products. Quality
              guaranteed!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CATEGORIES}
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CART}
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-md font-medium mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/categories/electronics"
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/clothing"
                  className="hover:text-white transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/home"
                  className="hover:text-white transition-colors"
                >
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/sports"
                  className="hover:text-white transition-colors"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-md font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 support@productstore.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Commerce St, City, State</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ProductStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
