import { nanoid } from "nanoid";
import { CiImageOff } from "react-icons/ci";

function UploadedImages({ images }) {
  return images.length ? (
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
  ) : (
    <div className="p-8 flex justify-center items-center flex-col border bg-stone-50  rounded-md">
      <CiImageOff size={48} className="mb-4 text-gray-500" />
      <p className="font-bold  text-gray-500">No Images</p>
      <p className="text-sm text-gray-500">Start uploading from above . . . </p>
    </div>
  );
}

export default UploadedImages;
