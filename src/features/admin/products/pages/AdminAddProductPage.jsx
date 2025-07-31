import { Form } from "@/components/ui/form";

import { useFieldArray, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { addProductDefaultValues } from "../data/formDefaults";

import VariantsSection from "../components/add-product/VariantsSection/VariantsSection";
import ProductInstancesSection from "../components/add-product/ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "../components/add-product/SettingsSection";
import MediaUploadSection from "../components/add-product/MediaUploadSection";
import CategoryBrandSection from "../components/add-product/CategoryBrandSection";
import AddProductsHeader from "../components/add-product/AddProductsHeader";
import GeneralInfoSection from "../components/add-product/GeneralInfoSection/GeneralInfoSection";

function AdminAddProductPage() {
  const form = useForm({
    defaultValues: addProductDefaultValues,
  });

  function onSubmit(data) {
    // console.log("✅ Submitted Data:", JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 ">
          <AddProductsHeader
            handleSubmit={form.handleSubmit}
            onSubmit={onSubmit}
          />
          <div className="flex flex-col flex-1 gap-4 lg:flex-row">
            <div className="flex flex-col gap-4 flex-5/8">
              <GeneralInfoSection form={form} />
              <VariantsSection />
              <ProductInstancesSection control={form.control} />
            </div>

            <div className="flex flex-col gap-4 flex-3/8">
              <SettingsSection />
              {/* <MediaUploadSection /> */}
              <CategoryBrandSection />
            </div>
          </div>
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}

export default AdminAddProductPage;
