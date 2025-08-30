import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import useDebounce from "@/hooks/useDebounce";
import useProducts from "@/hooks/useProducts";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  // Fetch products based on search term
  const { products, isLoadingProducts } = useProducts.useAll(
    {
      search: debouncedSearchTerm, // Add this parameter to your API
      active: 1, // Only search active products
    },
    {
      enabled: debouncedSearchTerm.length > 2, // Only search after 3+ characters
    }
  );

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length > 2);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    navigate(`/products/${product.id}`);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8 pr-8"
          onFocus={() => searchTerm.length > 2 && setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && debouncedSearchTerm.length > 2 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {isLoadingProducts ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : products && products.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="cursor-pointer border-b p-3 hover:bg-accent last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image Placeholder */}
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      📱
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {product.category_name} • {product.brand_name}
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        From ${product.variants?.[0]?.price || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found for "{debouncedSearchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
