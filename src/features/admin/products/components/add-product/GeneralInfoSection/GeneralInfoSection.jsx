import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DescriptionFields from "./DescriptionFields";
import NameSkuFields from "./NameSkuFields";
import useProductStore from "@/features/admin/store/productStore";
import LoadingState from "@/ui/LoadingState";

function GeneralInfoSection() {
  const mode = useProductStore((state) => state.mode);

  return (
    <Card className={"rounded-lg"}>
      <CardHeader className={"font-semibold"}>General Information</CardHeader>
      <CardContent className={"space-y-6"}>
        {mode !== undefined ? (
          <>
            <NameSkuFields mode={mode} />
            <DescriptionFields mode={mode} />
          </>
        ) : (
          <LoadingState type="form" />
        )}
      </CardContent>
    </Card>
  );
}

export default GeneralInfoSection;
