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
  const { products, isLoadingProducts } = useProducts.useAllWithoutVariants(
    {
      search: debouncedSearchTerm,
      active: 1,
    },
    {
      enabled: debouncedSearchTerm.length > 2,
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
        <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
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
            className="absolute w-4 h-4 -translate-y-1/2 right-2 top-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && debouncedSearchTerm.length > 2 && (
        <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg top-full bg-popover">
          {isLoadingProducts ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              Searching...
            </div>
          ) : products.data && products.data.length > 0 ? (
            <div className="overflow-y-auto max-h-64">
              {products.data.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="p-3 border-b cursor-pointer hover:bg-accent last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image Placeholder */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted">
                      📱
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {product.category_name} • {product.brand_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No products found for "{debouncedSearchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
