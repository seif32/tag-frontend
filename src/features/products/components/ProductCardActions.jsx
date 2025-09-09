import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { HeartButton } from "@/ui/HeartButton";

function ProductCardActions({ onViewProductDetails, productId }) {
  return (
    <CardFooter className={"flex flex-row px-4 gap-2"}>
      <Button
        className={
          "uppercase flex-1 h-8 md:h-10 cursor-pointer hover:scale-105 transition-all duration-300"
        }
        onClick={() => onViewProductDetails(productId)}
      >
        View Options
      </Button>
      <HeartButton />
    </CardFooter>
  );
}

export default ProductCardActions;
