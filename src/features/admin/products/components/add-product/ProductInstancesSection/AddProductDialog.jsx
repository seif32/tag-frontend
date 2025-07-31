import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuImagePlus } from "react-icons/lu";
import { IoAddOutline } from "react-icons/io5";
import { X, Check } from "lucide-react";
import TagFormField from "@/features/admin/ui/TagFormField";

// 🎯 Variant Configuration
const VARIANT_TYPES = {
  color: {
    label: "Color",
    options: [
      { value: "red", label: "Red", color: "#ef4444" },
      { value: "blue", label: "Blue", color: "#3b82f6" },
      { value: "black", label: "Black", color: "#000000" },
      { value: "white", label: "White", color: "#ffffff" },
      { value: "green", label: "Green", color: "#22c55e" },
      { value: "yellow", label: "Yellow", color: "#eab308" },
    ],
  },
  storage: {
    label: "Storage",
    options: [
      { value: "64gb", label: "64GB" },
      { value: "128gb", label: "128GB" },
      { value: "256gb", label: "256GB" },
      { value: "512gb", label: "512GB" },
      { value: "1tb", label: "1TB" },
    ],
  },
  size: {
    label: "Size",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "XXL" },
    ],
  },
};

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
];

// 🛠️ Utility Functions
const generateSKU = (baseName, variants) => {
  const variantCodes = Object.entries(variants)
    .map(([type, value]) => `${type.toUpperCase()}-${value.toUpperCase()}`)
    .join("-");

  const baseCode = baseName
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .substring(0, 8);

  return `${baseCode}-${variantCodes}`;
};

const generateProductName = (baseName, variants) => {
  const variantLabels = Object.entries(variants)
    .map(([type, value]) => {
      const variantType = VARIANT_TYPES[type];
      const option = variantType?.options.find((opt) => opt.value === value);
      return option?.label || value;
    })
    .join(" / ");

  return `${baseName} (${variantLabels})`;
};

function AddProductDialog({
  setFormData,
  setIsAddDialogOpen,
  setEditingProductId,
  formData,
  setProducts,
  editingProductId,
  isAddDialogOpen,
}) {
  // 🎯 VARIANT SELECTION STATES
  const [isVariantStepActive, setIsVariantStepActive] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [baseName, setBaseName] = useState("");
  const [availableVariantTypes] = useState(["color", "storage", "size"]); // Configure which variants to show

  // 🎨 UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);

  // 🖼️ IMAGE HANDLING FUNCTIONS
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 20),
    }));
  };

  const handleRemoveImage = (imageIndex) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex),
    }));
  };

  // 🎯 VARIANT SELECTION FUNCTIONS
  const handleVariantSelect = (variantType, value) => {
    const newVariants = {
      ...selectedVariants,
      [variantType]: value,
    };

    setSelectedVariants(newVariants);

    // Update preview if we have base name
    if (baseName.trim()) {
      setPreviewData({
        name: generateProductName(baseName, newVariants),
        sku: generateSKU(baseName, newVariants),
        variants: newVariants,
      });
    }
  };

  const handleBaseNameChange = (value) => {
    setBaseName(value);

    // Update preview if we have variants
    if (Object.keys(selectedVariants).length > 0) {
      setPreviewData({
        name: generateProductName(value, selectedVariants),
        sku: generateSKU(value, selectedVariants),
        variants: selectedVariants,
      });
    }
  };

  const proceedToProductForm = () => {
    // Validation
    if (!baseName.trim()) {
      setErrors({ baseName: "Base name is required" });
      return;
    }

    const hasAllRequiredVariants = availableVariantTypes.every(
      (type) => selectedVariants[type]
    );

    if (!hasAllRequiredVariants) {
      setErrors({ variants: "Please select all variant options" });
      return;
    }

    // Clear errors and proceed
    setErrors({});

    // Pre-fill form data
    setFormData((prev) => ({
      ...prev,
      name: generateProductName(baseName, selectedVariants),
      sku: generateSKU(baseName, selectedVariants),
      baseName: baseName,
      variants: selectedVariants,
    }));

    // Move to product form step
    setIsVariantStepActive(false);
  };

  const goBackToVariants = () => {
    setIsVariantStepActive(true);
  };

  // 🔄 PRODUCT FORM FUNCTIONS
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAddProduct = () => {
    if (
      !formData.name ||
      !formData.quantity ||
      !formData.sku ||
      !formData.price
    ) {
      setErrors({ form: "Please fill all required fields" });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        quantity: Number.parseInt(formData.quantity) || 0,
        price: Number.parseFloat(formData.price) || 0,
        compareAtPrice: Number.parseFloat(formData.compareAtPrice) || null,
        costPrice: Number.parseFloat(formData.costPrice) || null,
        createdAt: new Date().toISOString(),
      };

      setProducts((prev) => [...prev, newProduct]);
      setIsLoading(false);
      closeDialog();
    }, 500);
  };

  const handleUpdateProduct = () => {
    if (
      !formData.name ||
      !formData.quantity ||
      !formData.sku ||
      !formData.price
    ) {
      setErrors({ form: "Please fill all required fields" });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                ...formData,
                quantity: Number.parseInt(formData.quantity) || 0,
                price: Number.parseFloat(formData.price) || 0,
                compareAtPrice:
                  Number.parseFloat(formData.compareAtPrice) || null,
                costPrice: Number.parseFloat(formData.costPrice) || null,
                updatedAt: new Date().toISOString(),
              }
            : product
        )
      );

      setIsLoading(false);
      closeDialog();
    }, 500);
  };

  // 🔄 DIALOG MANAGEMENT
  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingProductId(null);
    setIsVariantStepActive(true);
    setSelectedVariants({});
    setBaseName("");
    setPreviewData(null);
    setErrors({});
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      baseName: "",
      variants: {},
      quantity: "",
      sku: "",
      price: "",
      currency: "USD",
      compareAtPrice: "",
      costPrice: "",
      images: [],
    });
  };

  // 🎯 COMPUTED VALUES
  const isVariantSelectionComplete =
    baseName.trim() &&
    availableVariantTypes.every((type) => selectedVariants[type]);

  const isProductFormValid =
    formData.name && formData.quantity && formData.sku && formData.price;

  const currentStep = isVariantStepActive ? 1 : 2;
  const totalSteps = 2;

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <IoAddOutline size={16} />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {editingProductId ? "✏️ Edit Product" : "➕ Add New Product"}
            </span>
            <div className="text-sm font-normal text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* 🎯 STEP 1: VARIANT SELECTION */}
        {isVariantStepActive && !editingProductId && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">
                🎯 Step 1: Choose Your Product Variant
              </h3>
              <p className="text-sm text-blue-600">
                First, let's select the specific variant you want to add to
                inventory
              </p>
            </div>

            {/* Base Product Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                📝 Base Product Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., iPhone 15 Pro, MacBook Air, Samsung Galaxy..."
                value={baseName}
                onChange={(e) => handleBaseNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.baseName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.baseName && (
                <p className="text-sm text-red-500">{errors.baseName}</p>
              )}
            </div>

            {/* Variant Selection */}
            {availableVariantTypes.map((variantType) => {
              const variantConfig = VARIANT_TYPES[variantType];
              if (!variantConfig) return null;

              return (
                <div key={variantType} className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {variantType === "color" && "🎨"}
                    {variantType === "storage" && "💾"}
                    {variantType === "size" && "📏"}
                    {variantConfig.label}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {variantConfig.options.map((option) => {
                      const isSelected =
                        selectedVariants[variantType] === option.value;

                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleVariantSelect(variantType, option.value)
                          }
                          className={`
                            relative p-3 border rounded-lg transition-all duration-200 hover:scale-105
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }
                          `}
                        >
                          {/* Color Preview */}
                          {variantType === "color" && (
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300 mx-auto mb-2"
                              style={{ backgroundColor: option.color }}
                            />
                          )}

                          <div className="text-sm font-medium">
                            {option.label}
                          </div>

                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {errors.variants && (
              <p className="text-sm text-red-500">{errors.variants}</p>
            )}

            {/* Preview Section */}
            {previewData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  👀 Preview
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-green-600 font-medium">
                      Product Name:
                    </span>
                    <div className="font-medium text-lg">
                      {previewData.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-green-600 font-medium">
                      Auto-generated SKU:
                    </span>
                    <div className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {previewData.sku}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-green-600 font-medium">
                      Selected Variants:
                    </span>
                    {Object.entries(previewData.variants).map(
                      ([type, value]) => (
                        <Badge
                          key={type}
                          className="bg-green-100 text-green-800 border-green-300"
                        >
                          {VARIANT_TYPES[type]?.options.find(
                            (opt) => opt.value === value
                          )?.label || value}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={proceedToProductForm}
                disabled={!isVariantSelectionComplete}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Product Details →
              </Button>
            </div>
          </div>
        )}

        {/* 🛍️ STEP 2: PRODUCT FORM */}
        {(!isVariantStepActive || editingProductId) && (
          <div className="space-y-6">
            {!editingProductId && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">
                      ✅ Step 2: Add Product Details
                    </h3>
                    <p className="text-sm text-green-600">
                      Great! Now let's add inventory and pricing information
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goBackToVariants}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    ← Back to Variants
                  </Button>
                </div>
              </div>
            )}

            {/* Variant Display (for new products) */}
            {formData.variants && Object.keys(formData.variants).length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  🎯 Selected Variant
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">
                      Base Name:
                    </span>
                    <div className="text-lg font-medium">
                      {formData.baseName}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">
                      Variant Combination:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(formData.variants).map(
                        ([type, value]) => {
                          const label =
                            VARIANT_TYPES[type]?.options.find(
                              (opt) => opt.value === value
                            )?.label || value;
                          return (
                            <Badge
                              key={type}
                              className="bg-blue-100 text-blue-800 border-blue-200"
                            >
                              {label}
                            </Badge>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Name & SKU */}
            <div className="grid grid-cols-2 gap-4">
              <TagFormField
                name="name"
                label="Product Name"
                placeholder="Auto-generated from variant selection"
                required
                value={formData.name}
                onChange={handleFieldChange}
                disabled={
                  !!formData.variants &&
                  Object.keys(formData.variants).length > 0
                }
              />
              <TagFormField
                name="sku"
                label="SKU (Stock Keeping Unit)"
                placeholder="Auto-generated"
                required
                value={formData.sku}
                onChange={handleFieldChange}
                disabled={
                  !!formData.variants &&
                  Object.keys(formData.variants).length > 0
                }
              />
            </div>

            {/* Inventory & Pricing */}
            <div className="grid grid-cols-4 gap-4">
              <TagFormField
                name="quantity"
                label="📦 Quantity in Stock"
                placeholder="0"
                required
                type="number"
                value={formData.quantity}
                onChange={handleFieldChange}
              />
              <TagFormField
                name="price"
                label="💰 Selling Price"
                placeholder="0.00"
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleFieldChange}
              />
              <TagFormField
                name="currency"
                label="💱 Currency"
                required
                options={CURRENCY_OPTIONS}
                type="select"
                value={formData.currency}
                onChange={handleFieldChange}
              />
              <TagFormField
                name="compareAtPrice"
                label="🏷️ Original Price"
                placeholder="(optional)"
                type="number"
                step="0.01"
                value={formData.compareAtPrice}
                onChange={handleFieldChange}
              />
            </div>

            <div className="grid grid-cols-1">
              <TagFormField
                name="costPrice"
                label="💵 Cost Price (Your Purchase Price)"
                placeholder="(optional - for profit calculation)"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={handleFieldChange}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                📷 Product Images
                <span className="text-xs text-gray-500 font-normal">
                  (Optional - up to 20 images)
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <label className="flex flex-col items-center justify-center w-24 h-24 transition-all duration-200 border-2 border-green-400 border-dashed rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-500 group bg-green-50/30">
                  <LuImagePlus
                    size={24}
                    className="text-green-600 transition-colors duration-200 group-hover:text-green-700 mb-1"
                  />
                  <span className="text-xs text-green-600">Add Image</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 overflow-hidden bg-gray-100 rounded-lg group border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              {formData.images.length > 0 && (
                <p className="text-xs text-gray-500">
                  {formData.images.length}/20 images uploaded
                </p>
              )}
            </div>

            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.form}</p>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingProductId ? handleUpdateProduct : handleAddProduct
                }
                disabled={!isProductFormValid || isLoading}
                className="bg-green-600 hover:bg-green-700 min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingProductId ? "Updating..." : "Adding..."}
                  </div>
                ) : (
                  <>
                    {editingProductId ? "💾 Update Product" : "➕ Add Product"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddProductDialog;
