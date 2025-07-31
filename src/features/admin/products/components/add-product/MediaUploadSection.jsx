"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LuImagePlus } from "react-icons/lu";
import { X, RotateCcw, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";

function MediaUploadSection() {
  const [images, setImages] = useState([
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
  ]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleImageDragStart = (event, index) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleImageDragOver = (event, index) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleImageDrop = (event, dropIndex) => {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove dragged image from original position
    newImages.splice(draggedIndex, 1);

    // Insert at new position
    const adjustedDropIndex =
      draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(adjustedDropIndex, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(null);
  };

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `product-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllImages = () => {
    setImages([]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h2 className="text-lg font-semibold">Product Media</h2>
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </span>
          {images.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllImages}
              className="h-8 bg-transparent"
            >
              <RotateCcw size={14} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-[400px] max-w-full rounded-md">
          <div className="flex gap-3 pb-4">
            {/* Upload Area */}
            <div
              className={`flex flex-col items-center justify-center transition-colors duration-200 border-2 border-dashed rounded-md cursor-pointer w-40 aspect-square min-w-[160px] ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-green-400 bg-green-100/30 hover:bg-amber-50 hover:border-amber-400"
              } group`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <LuImagePlus
                size={22}
                className={`transition-colors duration-200 ${
                  isDragOver
                    ? "text-blue-600"
                    : "text-green-600 group-hover:text-amber-600"
                }`}
              />
              <p
                className={`text-sm text-center transition-colors duration-200 mt-2 ${
                  isDragOver
                    ? "text-blue-600"
                    : "text-green-600 group-hover:text-amber-600"
                }`}
              >
                {isDragOver ? "Drop images here" : "Click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or drag & drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Image Gallery */}
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden bg-gray-100 rounded-md w-40 aspect-square min-w-[160px] group cursor-move ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDrop={(e) => handleImageDrop(e, index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  className="object-cover w-full h-full rounded-md"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                      >
                        <Eye size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product image ${index + 1} preview`}
                        className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => downloadImage(image, index)}
                  >
                    <Download size={14} />
                  </Button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <X size={12} />
                </button>

                {/* Image index indicator */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Upload Instructions */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>• Drag images to reorder them</p>
          <p>• Supported formats: JPG, PNG, GIF, WebP</p>
          <p>• Maximum file size: 10MB per image</p>
        </div>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <LuImagePlus size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No images uploaded yet</p>
            <p className="text-sm">
              Upload your first product image to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MediaUploadSection;
