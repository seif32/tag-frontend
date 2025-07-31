import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DescriptionFields from "./DescriptionFields";
import TagsManager from "./TagsManager";
import NameSkuFields from "./NameSkuFields";

function GeneralInfoSection({ form }) {
  return (
    <Card className={"rounded-lg"}>
      <CardHeader className={"font-semibold"}>General Information</CardHeader>
      <CardContent className={"space-y-6"}>
        <NameSkuFields />
        <DescriptionFields />
        <TagsManager form={form} />
      </CardContent>
    </Card>
  );
}

export default GeneralInfoSection;
