import ImageUploader from "@/features/admin/ui/ImageUploader";
import StepHeader from "@/features/admin/ui/StepHeader";
import ImageInstructions from "./ImageInstructions";
import UploadedImages from "./UploadedImages";
import { useState } from "react";

function ProductImagesStep({ images, setImages }) {
  return (
    <div className="space-y-8">
            <StepHeader step={3} title="Add Stunning Product Images" />     {" "}
      <div className="space-y-5">
               {" "}
        <div className="flex gap-2" data-slot="image-upload-area">
                    <ImageUploader images={images} setImages={setImages} />
                    <ImageInstructions />       {" "}
        </div>
                <UploadedImages images={images} setImages={setImages} />     {" "}
      </div>
         {" "}
    </div>
  );
}

export default ProductImagesStep;
