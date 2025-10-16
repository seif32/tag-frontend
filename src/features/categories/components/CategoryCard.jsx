import { Badge } from "@/components/ui/badge";

function CategoryCard({
  name,
  storage,
  image,
  onViewSubcategoryProducts,
  subcategoryId,
  categoryId,
}) {
  return (
    <div
      className="flex flex-col  gap-2 sm:gap-6  cursor-pointer group "
      onClick={() => onViewSubcategoryProducts(categoryId, subcategoryId)}
    >
      <div className="relative w-full h-full transition-transform duration-400 rounded-xl aspect-square group-hover:scale-110">
        <img
          className="object-cover w-full h-full shadow-sm rounded-xl aspect-square"
          src={image}
        />
        <Badge variant={"destructive"} className={`absolute top-2 right-2`}>
          {storage === 0 ? "No products" : storage}
        </Badge>
      </div>
      <div className="flex justify-center ">
        <span className="text-lg font-bold tracking-tight line-clamp-2">
          {name}
        </span>
      </div>
    </div>
  );
}

export default CategoryCard;
