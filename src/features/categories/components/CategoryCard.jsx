import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { IoFastFoodOutline } from "react-icons/io5";

function CategoryCard() {
  return (
    <Card
      className={" h-60 flex flex-col items-center pt-0 gap-0 cursor-pointer"}
    >
      <CardHeader
        className={
          "flex-1 grid place-content-center bg-gray-200 w-full rounded-t-lg"
        }
      >
        <IoFastFoodOutline size={100} />
      </CardHeader>
      <CardContent className={"font-bold text-xl"}>
        <h2>Candies</h2>
      </CardContent>
      <CardFooter className={" "}>
        <span>452 products</span>
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;
