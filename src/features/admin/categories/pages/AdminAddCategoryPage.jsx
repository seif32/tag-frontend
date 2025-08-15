"use client";

import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AdminAddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      categoryName,
      description,
      parentCategory,
      isActive,
      uploadedImage,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="mt-1 text-gray-600">
            Create a new product category to organize your inventory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="categoryName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category Name *
                  </Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-1"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Choose a clear, descriptive name for your category
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what products belong in this category"
                    className="mt-1"
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Help customers understand what they'll find in this category
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="parentCategory"
                    className="text-sm font-medium text-gray-700"
                  >
                    Parent Category
                  </Label>
                  <Select
                    value={parentCategory}
                    onValueChange={setParentCategory}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home-kitchen">
                        Home & Kitchen
                      </SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">
                    Create a subcategory by selecting a parent category
                  </p>
                </div>
              </div>
            </div>

            {/* Category Image */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Category Image
              </h2>

              <div className="space-y-4">
                {!uploadedImage ? (
                  <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="imageUpload" className="cursor-pointer">
                        {/* <span className="text-sm font-medium text-gray-900">
                          Upload an image
                        </span>
                        <span className="text-sm text-gray-500">
                          {" "}
                          or drag and drop
                        </span> */}
                      </Label>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Category preview"
                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Settings
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active Status
                  </Label>
                  <p className="mt-1 text-xs text-gray-500">
                    Active categories are visible to customers
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="text-white bg-black hover:bg-gray-800"
              >
                Create Category
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Preview
            </h3>
            <div className="p-4 border rounded-lg">
              {uploadedImage && (
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Category preview"
                  width={100}
                  height={100}
                  className="object-cover mb-3 rounded-lg"
                />
              )}
              <h4 className="font-medium text-gray-900">
                {categoryName || "Category Name"}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {description || "Category description will appear here"}
              </p>
              {parentCategory && (
                <p className="mt-2 text-xs text-gray-500">
                  Under: {parentCategory}
                </p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Tips for Success
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                Use clear, descriptive names that customers will understand
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                Add high-quality images to make categories more appealing
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                Write helpful descriptions to guide customer expectations
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                Organize with parent categories for better navigation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
