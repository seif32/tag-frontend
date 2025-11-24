import { useState } from "react";

function Test() {
  const [images, setImages] = useState([]);

  const renameFiles = (files) => {
    return files.map((file, index) => {
      const extension = file.name.slice(file.name.lastIndexOf("."));
      const newName = `variant_image_${index}${extension}`;
      return new File([file], newName, { type: file.type });
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const renamedFiles = renameFiles(selectedFiles);

    const newImages = renamedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const setPrimaryImage = (indexToPrimary) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === indexToPrimary,
      }))
    );
  };

  const logRenamedFiles = () => {
    console.log("Renamed files:");
    images.forEach((img, i) =>
      console.log(`${i}: ${img.file.name} (type: ${img.file.type})`)
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Image Upload with Icons for Remove & Primary</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <div
        style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              border: img.isPrimary ? "3px solid blue" : "1px solid #ccc",
              borderRadius: 8,
              width: 150,
              height: 150,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={img.previewUrl}
              alt={`preview ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Icon Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 4,
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                background: "rgba(0,0,0,0.5)",
                padding: "4px 0",
                color: "white",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {!img.isPrimary && (
                <span
                  role="button"
                  aria-label="Set primary image"
                  onClick={() => setPrimaryImage(i)}
                  title="Set Primary"
                >
                  ⭐
                </span>
              )}
              <span
                role="button"
                aria-label="Remove image"
                onClick={() => removeImage(i)}
                style={{ color: "red" }}
                title="Remove"
              >
                ❌
              </span>
            </div>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <button onClick={logRenamedFiles}>Log New File Names & Types</button>
        </div>
      )}
    </div>
  );
}

export default Test;
