import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
      <div className="p-8 flex justify-center items-center flex-col border bg-stone-50 rounded-md">
                <span>📷</span>       {" "}
        <p className="font-bold text-gray-500">No Images</p>       {" "}
        <p className="text-sm text-gray-500">Start uploading from above...</p> 
           {" "}
      </div>
    );
  }

  return (
    <div className="space-y-2">
           {" "}
      <h4 className="text-sm font-medium">Uploaded Images ({images.length})</h4>
           {" "}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
               {" "}
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`relative w-40 group rounded-lg overflow-hidden border-2 ${
              image.is_primary ? "border-blue-500" : "border-gray-200"
            }`}
          >
                       {" "}
            <div className="aspect-square">
                           {" "}
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="object-cover w-full h-full"
              />
                         {" "}
            </div>
                       {" "}
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 group-hover:bg-opacity-50">
                           {" "}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                               {" "}
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
                               {" "}
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
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            {image.is_primary && (
              <div className="absolute top-2 left-2">
                               {" "}
                <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">
                  Primary
                </span>
                             {" "}
              </div>
            )}
                     {" "}
          </div>
        ))}
             {" "}
      </div>
         {" "}
    </div>
  );
}

export default UploadedImages;
