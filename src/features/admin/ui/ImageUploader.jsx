import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function renameFile(file, newName) {
  return new File([file], newName, { type: file.type });
}

function ImageUploader({ images, setImages }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (files) => {
    files.forEach((file, i) => {
      if (file.type.startsWith("image/")) {
        // Assign a default new name: variant_image_N
        const index = images.length + i + 1;
        const renamed = renameFile(
          file,
          `variant_image_${index}${file.name.slice(file.name.lastIndexOf("."))}`
        );
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            image_url: e.target?.result,
            is_primary: images.length === 0 && i === 0, // Only the very first
            file: renamed,
            id: `img-${Date.now()}-${Math.random()}`,
          };
          setImages((prev) => [...prev, imageData]);
        };
        reader.readAsDataURL(renamed);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = (event) =>
    processFiles(Array.from(event.target.files || []));
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    processFiles(Array.from(event.dataTransfer.files));
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
           {" "}
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer w-full min-h-[120px] p-4 transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-green-400 bg-green-100/30 hover:bg-amber-50 hover:border-amber-400"
        } group`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
               {" "}
        <ImagePlus
          size={32}
          className={`transition-colors ${
            isDragOver
              ? "text-blue-600"
              : "text-green-600 group-hover:text-amber-600"
          }`}
        />
               {" "}
        <p
          className={`text-sm text-center mt-2 ${
            isDragOver
              ? "text-blue-600"
              : "text-green-600 group-hover:text-amber-600"
          }`}
        >
                    {isDragOver ? "Drop images here" : "Click to upload images"}
                 {" "}
        </p>
               {" "}
        <p className="mt-1 text-xs text-muted-foreground">or drag & drop</p>   
           {" "}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
             {" "}
      </div>
         {" "}
    </div>
  );
}

export default ImageUploader;
