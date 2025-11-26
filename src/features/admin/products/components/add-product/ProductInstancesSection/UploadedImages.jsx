import React from "react";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";

function UploadedImages({ images = [], setImages }) {
  const removeImage = (indexToRemove) =>
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));

  const setPrimaryImage = (indexToSetPrimary) =>
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === indexToSetPrimary,
      }))
    );

  if (!images.length) {
    return (
      <div className="p-8 flex justify-center items-center flex-col border-2 border-dashed bg-stone-50 rounded-lg">
        <span className="text-4xl mb-2">📷</span>
        <p className="font-bold text-gray-700">No Images</p>
        <p className="text-sm text-gray-500">Start uploading from above...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">
        Uploaded Images ({images.length})
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              image.is_primary
                ? "border-blue-500 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {/* Image Container with Fixed Aspect Ratio */}
            <div className="relative w-full aspect-square bg-gray-100">
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md shadow">
                    Primary
                  </span>
                </div>
              )}

              {/* Hover Overlay with Vertical Stacked Actions */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/60 transition-all duration-200">
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2">
                  {!image.is_primary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryImage(index);
                      }}
                      className="text-[10px] h-7 px-2 font-medium shadow-lg whitespace-nowrap"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="h-7 px-2 shadow-lg"
                  >
                    <X className="w-3 h-3 mr-1" />
                    <span className="text-[10px]">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadedImages;
