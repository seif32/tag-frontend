import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import useBundles from "@/hooks/useBundles";
import { useParams } from "react-router";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import { Separator } from "@/components/ui/separator";

function BundlesSection() {
  const { id } = useParams();
  const {
    bundlesByProduct,
    isLoadingBundlesByProduct,
    errorBundlesByProduct,
    isErrorBundlesByProduct,
    refetchBundlesByProduct,
  } = useBundles.useByProductId(id, { limit: 9999999 });

  if (isLoadingBundlesByProduct) return <LoadingState type="card" />;

  if (isErrorBundlesByProduct)
    return (
      <ErrorMessage
        message={errorBundlesByProduct?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchBundlesByProduct()}
      />
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-1">
            <p>Bundles</p>
            <span className="text-muted-foreground text-xs font-normal">
              ({bundlesByProduct?.data?.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      {bundlesByProduct?.data?.length === 0 ? (
        <CardContent className={"text-muted-foreground text-sm"}>
          No Bundles in this product
        </CardContent>
      ) : (
        bundlesByProduct?.data?.map((bundle) => (
          <div key={bundle?.id} className="space-y-5">
            <BundleCardContent bundle={bundle} />
            <Separator />
          </div>
        ))
      )}
    </Card>
  );
}

export default BundlesSection;

function BundleCardContent({ bundle }) {
  return (
    <CardContent className={"space-y-3 "}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-1 items-center">
            <BadgePercent className="size-5" />
            <p>{bundle?.product?.name}</p>
          </div>

          <p className="text-xs text-muted-foreground">
            {bundle?.product?.variants[0]?.variant_sku}
          </p>
        </div>
        <span className="text-accent hover:text-accent/70 cursor-pointer text-sm">
          Edit Bundle
        </span>
      </div>
      <div className="flex gap-1">
        {bundle?.product?.variants[0]?.types?.map((variant) => (
          <span
            key={variant?.type_id}
            className="px-2 bg-black text-white rounded-sm  text-xs py-0.5"
          >
            {variant?.value?.name}
          </span>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{bundle?.quantity}</TableCell>
            <TableCell>{bundle?.vat}%</TableCell>
            <TableCell>{formatCurrency(bundle?.subtotal)}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(bundle?.total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  );
}
