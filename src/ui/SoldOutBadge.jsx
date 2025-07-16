import { Badge } from "@/components/ui/badge";

function SoldOutBadge({ className = "" }) {
  const isSoldOut = true;

  return (
    <Badge
      className={`uppercase absolute top-2 right-2 ${
        isSoldOut ? "bg-red-600" : "bg-green-600"
      } ${className}`}
    >
      {isSoldOut ? " sold out" : "in stock"}
    </Badge>
  );
}

export default SoldOutBadge;
