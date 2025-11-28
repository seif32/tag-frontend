import React from "react";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Uploaded Images ({images.length})
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                image.is_primary
                  ? "border-blue-500 shadow-md"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-gray-100">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-10">
                    <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-semibold text-white bg-blue-500 rounded-md shadow flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                      <span className="hidden sm:inline">Primary</span>
                    </span>
                  </div>
                )}

                {/* 🆕 Mobile: Icon Buttons at Top-Right (Always Visible) */}
                <div className="md:hidden absolute top-1.5 right-1.5 flex flex-col gap-1.5">
                  {!image.is_primary && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryImage(index);
                          }}
                          className="h-8 w-8 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm"
                        >
                          <Star className="w-4 h-4 text-gray-700" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-xs">Set as primary</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="h-8 w-8 rounded-full shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">Remove image</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* 🆕 Desktop: Hover Overlay with Icon Buttons */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!image.is_primary && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryImage(index);
                            }}
                            className="h-10 w-10 rounded-full shadow-lg"
                          >
                            <Star className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set as primary</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="h-10 w-10 rounded-full shadow-lg"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove image</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default UploadedImages;
