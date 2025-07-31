import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TagFormField from "../../../ui/TagFormField";

function CategoryBrandSection() {
  return (
    <Card>
      <CardHeader>Category & Brand</CardHeader>
      <CardContent className={"space-y-4"}>
        <TagFormField
          name={"categoryId"}
          label={"Category"}
          type="select"
          options={[{ value: 1, label: "Electronics" }]}
          required
          placeholder="Electronics"
        />
        <TagFormField
          name={"subcategoryId"}
          label={"Sub-category"}
          type="select"
          options={[{ value: 5, label: "Smartphones" }]}
          placeholder="Smartphones"
        />
        <TagFormField
          name={"brandId"}
          label={"Brand"}
          type="select"
          options={[{ value: 3, label: "Apple" }]}
          required
          placeholder="Apple"
        />
      </CardContent>
    </Card>
  );
}

export default CategoryBrandSection;
