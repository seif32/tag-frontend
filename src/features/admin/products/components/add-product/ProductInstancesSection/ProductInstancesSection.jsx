import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";

import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";
import AddProductDialog from "./AddProductDialog";
import ProductCard from "./ProductCard";
import { useFieldArray } from "react-hook-form";

function ProductInstancesSection({ control }) {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const [products, setProducts] = useState([
    {
      id: "1",
      name: "iPhone 11 red 128GB",
      variants: "red / 128GB",
      quantity: 50,
      sku: "IPHONE-11-RED-128",
      price: 699.99,
      currency: "USD",
      compareAtPrice: 799.99,
      costPrice: 500.0,
      images: [Image1, Image2, Image3, Image4, Image5, Image6],
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    variants: "",
    quantity: "",
    sku: "",
    price: "",
    currency: "USD",
    compareAtPrice: "",
    costPrice: "",
    images: [],
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-md font-semibold">Products</h2>

        <AddProductDialog
          editingProductId={editingProductId}
          formData={formData}
          isAddDialogOpen={isAddDialogOpen}
          setEditingProductId={setEditingProductId}
          setFormData={setFormData}
          setIsAddDialogOpen={setIsAddDialogOpen}
          setProducts={setProducts}
        />
      </CardHeader>

      <ProductCard
        products={products}
        setEditingProductId={setEditingProductId}
        setFormData={setFormData}
        setIsAddDialogOpen={setIsAddDialogOpen}
        setProducts={setProducts}
      />
    </Card>
  );
}

export default ProductInstancesSection;
