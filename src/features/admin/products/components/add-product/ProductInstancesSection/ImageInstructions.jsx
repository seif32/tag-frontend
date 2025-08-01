function ImageInstructions() {
  return (
    <div className="flex flex-col justify-center p-4 space-y-3 text-xs border-2 border-gray-300 rounded-lg bg-stone-100">
      <p>• Drag images and drop them</p>
      <p>• Supported formats: JPG, PNG, GIF, WebP</p>
      <p>• Maximum images: 10 photos</p>
      <p>• Maximum file size: 10MB per image</p>
    </div>
  );
}

export default ImageInstructions;
