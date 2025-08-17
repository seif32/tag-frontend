import { Link } from "react-router";
import { ROUTES } from "@/constants";

const Footer = () => {
  return (
    <footer className="mt-auto text-white bg-primary">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">TAG</h3>
            <p className="text-gray-400">
              Your one-stop shop for all categories of products. Quality
              guaranteed!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-medium text-md">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="transition-colors hover:text-white"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CATEGORIES}
                  className="transition-colors hover:text-white"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CART}
                  className="transition-colors hover:text-white"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-medium text-md">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/categories/electronics"
                  className="transition-colors hover:text-white"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/clothing"
                  className="transition-colors hover:text-white"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/home"
                  className="transition-colors hover:text-white"
                >
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/sports"
                  className="transition-colors hover:text-white"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-medium text-md">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 support@productstore.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Commerce St, City, State</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; 2025 ProductStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
