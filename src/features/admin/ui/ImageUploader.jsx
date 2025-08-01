import { useRef, useState } from "react";
import { LuImagePlus } from "react-icons/lu";

function ImageUploader() {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

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
  return (
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
  );
}

export default ImageUploader;
