import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DescriptionFields from "./DescriptionFields";
import NameSkuFields from "./NameSkuFields";

function GeneralInfoSection() {
  return (
    <Card className={"rounded-lg"}>
      <CardHeader className={"font-semibold"}>General Information</CardHeader>
      <CardContent className={"space-y-6"}>
        <NameSkuFields />
        <DescriptionFields />
      </CardContent>
    </Card>
  );
}

export default GeneralInfoSection;
