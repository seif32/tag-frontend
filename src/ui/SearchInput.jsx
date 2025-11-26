import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router";
import useDebounce from "@/hooks/useDebounce";
import useProducts from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Fetch products based on search term
  const { products, isLoadingProducts } = useProducts.useAllWithoutVariants(
    {
      search: debouncedSearchTerm,
      active: 1,
      limit: 8,
    },
    {
      enabled: debouncedSearchTerm.length > 2,
    }
  );

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save to recent searches
  const saveToRecent = (productName) => {
    const updated = [
      productName,
      ...recentSearches.filter((item) => item !== productName),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    saveToRecent(product.name);
    navigate(`/products/${product.id}`);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Handle recent search click
  const handleRecentClick = (searchText) => {
    setSearchTerm(searchText);
    setIsOpen(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  // Clear recent searches
  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Close on escape key or click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasResults = products?.data && products.data.length > 0;
  const showRecent = searchTerm.length === 0 && recentSearches.length > 0;
  const showNoResults =
    !isLoadingProducts && debouncedSearchTerm.length > 2 && !hasResults;

  return (
    <div ref={searchRef} className="relative w-full max-w-md sm:max-w-lg">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute w-4 h-4 sm:w-5 sm:h-5 -translate-y-1/2 left-3 top-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 sm:pl-11 pr-10 h-10 sm:h-11 text-sm sm:text-base rounded-full border-2 focus:border-primary transition-all shadow-sm focus:shadow-md"
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 border-2 rounded-2xl shadow-2xl top-full bg-white backdrop-blur-sm overflow-hidden">
          {/* Loading State */}
          {isLoadingProducts && debouncedSearchTerm.length > 2 && (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-600">
                Searching for products...
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {showRecent && (
            <div className="p-4 border-b bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Recent Searches
                  </h3>
                </div>
                <button
                  onClick={clearRecent}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentClick(search)}
                    className="px-3 py-1.5 bg-white border rounded-full text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {hasResults && debouncedSearchTerm.length > 2 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {products.data.length} Result
                  {products.data.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="overflow-y-auto max-h-96">
                {products.data.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-all group ${
                      idx !== products.data.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 group-hover:border-blue-300 transition-colors">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            <Package />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {product.category_name}
                          </Badge>
                          {product.brand_name && (
                            <span className="text-xs text-gray-500">
                              {product.brand_name}
                            </span>
                          )}
                        </div>
                        {product.variant_count > 1 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {product.variant_count} variants available
                          </p>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 self-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Results */}
              {/* <div className="p-3 bg-gray-50 border-t">
                <button
                  onClick={() => {
                    navigate(`/products?search=${debouncedSearchTerm}`);
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2 group"
                >
                  View All Results
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div> */}
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                We couldn't find any products matching "
                <span className="font-medium text-gray-700">
                  {debouncedSearchTerm}
                </span>
                "
              </p>
              <button
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Tips (when empty and no recent) */}
          {searchTerm.length === 0 && recentSearches.length === 0 && (
            <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Search Tips
              </h3>
              <ul className="text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                <li>• Try searching by product name </li>
                <li>• Use specific keywords for better results</li>
                {/* <li>• Browse categories for more options</li> */}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchInput;
