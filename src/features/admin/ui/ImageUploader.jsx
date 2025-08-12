import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function ImageUploader({ setImages, images }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (files) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            image_url: e.target?.result,
            is_primary: images.length === 0, // First image is primary by default
            file: file,
            id: `img-${Date.now()}-${Math.random()}`,
          };

          setImages((prev) => [...prev, imageData]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
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

  const setPrimaryImage = (indexToSetPrimary) => {
    setImages((prev) =>
      prev.map((img, index) => ({
        ...img,
        is_primary: index === indexToSetPrimary,
      }))
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`flex flex-col items-center justify-center transition-colors duration-200 border-2 border-dashed rounded-md cursor-pointer w-full min-h-[120px] p-4 ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-green-400 bg-green-100/30 hover:bg-amber-50 hover:border-amber-400"
        } group`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus
          size={32}
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
          {isDragOver ? "Drop images here" : "Click to upload images"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">or drag & drop</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Image Preview Grid */}
      {images?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  image.is_primary ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={image.image_url || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Overlay with controls */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-50">
                  <div className="flex gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                    {!image.is_primary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimaryImage(index);
                        }}
                        className="text-xs"
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Primary badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">
                      Primary
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
