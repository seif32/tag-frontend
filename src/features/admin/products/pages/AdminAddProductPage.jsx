import { Form } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { addProductDefaultValues } from "../data/formDefaults";

import VariantsSection from "../components/add-product/VariantsSection/VariantsSection";
import ProductInstancesSection from "../components/add-product/ProductInstancesSection/ProductInstancesSection";
import SettingsSection from "../components/add-product/SettingsSection";
import CategoryBrandSection from "../components/add-product/CategoryBrandSection";
import AddProductsHeader from "../components/add-product/AddProductsHeader";
import GeneralInfoSection from "../components/add-product/GeneralInfoSection/GeneralInfoSection";
import { consoleObject } from "@/utils/consoleObject";
import TagsManager from "../components/add-product/GeneralInfoSection/TagsManager";

function AdminAddProductPage() {
  const form = useForm({
    defaultValues: addProductDefaultValues,
  });

  const onSubmit = (data) => {
    data.variants = data.variants.filter(
      (v) => v.variantName.trim() !== "" && v.variantSku.trim() !== ""
    );
    consoleObject(data);
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 mb-40">
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
              {/* <MediaUploadSection /> */}
              <SettingsSection />
              <CategoryBrandSection />
              <TagsManager form={form} />
            </div>
          </div>
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}

export default AdminAddProductPage;
