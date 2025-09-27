import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useBundles from "@/hooks/useBundles";

function BundlesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-1">
            <p>Bundles</p>
            <span className="text-muted-foreground text-xs font-normal">
              (1)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p></p>
          <span></span>
        </div>
      </CardContent>
    </Card>
  );
}

export default BundlesSection;
