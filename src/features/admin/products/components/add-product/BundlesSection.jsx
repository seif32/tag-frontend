import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useBundles from "@/hooks/useBundles";
import { BadgePercent } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";

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
      <CardContent className={"space-y-3"}>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-1 items-center">
                <BadgePercent className="size-5" />
                <p>Samsung Galaxy</p>
              </div>

              <p className="text-xs text-muted-foreground">
                SKU-7C1305-1758440992430
              </p>
            </div>
            <span className="text-accent hover:text-accent/70 cursor-pointer text-sm">
              Edit
            </span>
          </div>
          <div className="flex gap-1">
            <span className="px-2 bg-black text-white rounded-sm  text-xs py-0.5">
              Black
            </span>
            <span className="px-2 bg-black text-white rounded-sm  text-xs py-0.5">
              128GB
            </span>
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
                <TableCell className="font-medium">10</TableCell>
                <TableCell>14%</TableCell>
                <TableCell>{formatCurrency(250)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(350)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default BundlesSection;
