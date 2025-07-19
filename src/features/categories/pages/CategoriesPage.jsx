import CategoryCard from "../components/CategoryCard";
import { CategoriesHeader } from "../components/CategoryHeader";

function CategoriesPage() {
  return (
    <div>
      <CategoriesHeader />
      <div className="mb-8 ">
        <span className="block mb-2 text-xl font-medium text-primary/60">
          Electronics
        </span>
        <div className="mb-4 border-b "></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
