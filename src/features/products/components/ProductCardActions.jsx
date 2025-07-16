import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { HeartButton } from "@/ui/HeartButton";

function ProductCardActions() {
  return (
    <CardFooter className={"flex flex-row px-4 gap-2"}>
      <Button className={"uppercase flex-1  h-12 md:h-10 cursor-pointer"}>
        Add to Card
      </Button>
      <HeartButton />
    </CardFooter>
  );
}

export default ProductCardActions;
