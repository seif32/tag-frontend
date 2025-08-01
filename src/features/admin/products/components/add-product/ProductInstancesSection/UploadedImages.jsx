import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";
import { nanoid } from "nanoid";
import { useState } from "react";

function UploadedImages() {
  const [images, setImages] = useState([
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
  ]);
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((image) => {
        return (
          <div
            key={nanoid()}
            className="overflow-hidden bg-gray-300 border rounded-sm w-25 aspect-square"
          >
            <img
              src={image}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
          </div>
        );
      })}
    </div>
  );
}

export default UploadedImages;
