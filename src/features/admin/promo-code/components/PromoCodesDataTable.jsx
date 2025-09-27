import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Edit,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function PromoCodesTable({ promoCodes, onView, onEdit }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (promoCode) => {
    const now = new Date();
    const endDate = new Date(promoCode.end_date);
    const startDate = new Date(promoCode.start_date);

    if (!promoCode.is_active) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          Inactive
        </Badge>
      );
    }

    if (now > endDate) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="w-3 h-3" />
          Expired
        </Badge>
      );
    }

    if (now < startDate) {
      return (
        <Badge variant="outline" className="gap-1">
          <Calendar className="w-3 h-3" />
          Scheduled
        </Badge>
      );
    }

    return (
      <Badge variant="default" className="bg-green-500 gap-1">
        <CheckCircle className="w-3 h-3" />
        Active
      </Badge>
    );
  };

  const getDiscountDisplay = (promoCode) => {
    const icon =
      promoCode.discount_type === "percentage" ? (
        <Percent className="w-3 h-3 " />
      ) : (
        <DollarSign className="w-3 h-3 " />
      );

    return (
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-full bg-gray-100">{icon}</div>
        <div>
          <div className="font-semibold ">
            {promoCode.discount_value}
            {promoCode.discount_type === "percentage" ? "%" : "$"}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {promoCode.discount_type} off
          </div>
        </div>
      </div>
    );
  };

  const getUsageDisplay = (promoCode) => {
    const usagePercentage =
      promoCode.usage_limit > 0
        ? (promoCode.usage_count / promoCode.usage_limit) * 100
        : 0;

    const isLimitReached = promoCode.usage_count >= promoCode.usage_limit;

    return (
      <div className="space-y-1 min-w-[120px]">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{promoCode.usage_count}</span>
          <span className="text-gray-500">
            / {promoCode.usage_limit || "∞"}
          </span>
        </div>

        {promoCode.usage_limit > 0 && (
          <div className="space-y-1">
            <Progress
              value={usagePercentage}
              className="h-2"
              indicatorClassName={
                isLimitReached
                  ? "bg-red-500"
                  : usagePercentage > 80
                  ? "bg-orange-500"
                  : "bg-green-500"
              }
            />
            <div className="text-xs text-center text-gray-500">
              {Math.round(usagePercentage)}% used
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Per user: {promoCode.per_user_limit || "∞"}
        </div>
      </div>
    );
  };

  // const getConditionsBadges = (promoCode) => {
  //   const conditions = [];

  //   if (promoCode.is_first_order) {
  //     conditions.push(
  //       <Badge key="first-order" variant="outline" className="text-xs gap-1">
  //         <Users className="w-3 h-3" />
  //         First Order
  //       </Badge>
  //     );
  //   }

  //   if (promoCode.min_order_value > 0) {
  //     conditions.push(
  //       <Badge key="min-order" variant="outline" className="text-xs gap-1">
  //         <Target className="w-3 h-3" />
  //         Min ${promoCode.min_order_value}
  //       </Badge>
  //     );
  //   }

  //   if (promoCode.max_discount > 0) {
  //     conditions.push(
  //       <Badge key="max-discount" variant="outline" className="text-xs gap-1">
  //         <TrendingUp className="w-3 h-3" />
  //         Max ${promoCode.max_discount}
  //       </Badge>
  //     );
  //   }

  //   return <div className="flex flex-wrap gap-1">{conditions}</div>;
  // };

  return (
    <div className="border rounded-lg px-2 py-1  ">
      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage Stats</TableHead>
            <TableHead>Valid Period</TableHead>
            {/* <TableHead >Conditions</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead className=" text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes?.length > 0 ? (
            promoCodes.map((promoCode) => (
              <TableRow key={promoCode.id} className="hover:bg-gray-50/50">
                <TableCell className={"w-2"}>#{promoCode.id}</TableCell>
                <TableCell>
                  <p className="font-bold text-md ">{promoCode.code}</p>
                </TableCell>

                <TableCell className="max-w-xs">
                  <div className="space-y-1">
                    <div className=" line-clamp-2 text-xs">
                      {promoCode.description}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{getDiscountDisplay(promoCode)}</TableCell>

                <TableCell>{getUsageDisplay(promoCode)}</TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-green-600" />
                      <span className="font-medium">Start:</span>
                      {formatDate(promoCode.start_date)}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-red-600" />
                      <span className="font-medium">End:</span>
                      {formatDate(promoCode.end_date)}
                    </div>
                  </div>
                </TableCell>

                {/* <TableCell>{getConditionsBadges(promoCode)}</TableCell> */}

                <TableCell>{getStatusBadge(promoCode)}</TableCell>

                <TableCell>
                  <div className="flex  justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(promoCode)}
                      className="h-8 w-8 p-0 "
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 " />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(promoCode)}
                      className="h-8 w-8 p-0 "
                      title="Edit Code"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="space-y-3">
                  <div className="text-4xl">🎫</div>
                  <div className="text-lg font-medium text-gray-500">
                    No promo codes found
                  </div>
                  <div className="text-sm text-gray-400">
                    Create your first promotional code to get started
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
