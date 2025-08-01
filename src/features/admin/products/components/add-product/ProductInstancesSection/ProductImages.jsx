import ImageUploader from "@/features/admin/ui/ImageUploader";
import StepHeader from "@/features/admin/ui/StepHeader";
import ImageInstructions from "./ImageInstructions";

import UploadedImages from "./UploadedImages";

function ProductImages() {
  return (
    <div className="space-y-8">
      <StepHeader step={3} title={"Add Stunning Product Images"} />
      <div className="space-y-5">
        <div className="flex gap-2" data-slot="image-upload-area">
          <ImageUploader />
          <ImageInstructions />
        </div>
        <UploadedImages />
      </div>
    </div>
  );
}

export default ProductImages;
