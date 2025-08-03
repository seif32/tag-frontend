import { nanoid } from "nanoid";

function UploadedImages({ images }) {
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((file, index) => {
        return (
          <div
            key={nanoid()}
            className="overflow-hidden bg-gray-300 border rounded-sm w-25 aspect-square"
          >
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="object-cover w-full h-full"
            />
          </div>
        );
      })}
    </div>
  );
}

export default UploadedImages;
