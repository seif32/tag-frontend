import ImageUploader from "@/features/admin/ui/ImageUploader";
import StepHeader from "@/features/admin/ui/StepHeader";
import ImageInstructions from "./ImageInstructions";
import UploadedImages from "./UploadedImages";

function ProductImagesStep({ images, setImages }) {
  return (
    <div className="space-y-8">
      <StepHeader step={3} title="Add Stunning Product Images" />
      <div className="space-y-5">
        <div className="flex gap-2" data-slot="image-upload-area">
          <ImageUploader setImages={setImages} />
          <ImageInstructions />
        </div>
        <UploadedImages images={images} />
      </div>
    </div>
  );
}

export default ProductImagesStep;
