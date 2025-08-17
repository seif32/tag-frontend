import { FaStar } from "react-icons/fa";

function ProductInfoSection() {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Electronics • Smartphones</p>
      <h2 className="text-6xl font-bold font-degular">Iphone 11 Red 128GB</h2>
      <div className="flex items-end gap-2 ">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className="w-4 h-4 text-yellow-500 " />
          ))}
        </div>
        <div className="text-sm leading-none">
          4.8 <span className="">(245 Reviews)</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <p className="text-4xl font-medium font-degular">$500.00</p>
        <p className="font-medium line-through text-muted-foreground">
          $800.00
        </p>
      </div>
      <p className="text-sm leading-snug text-muted-foreground">
        A sleek and durable laptop designed for work and play. Featuring a
        high-resolution display, powerful processor, and long-lasting battery,
        it delivers the perfect balance of performance and portability.
      </p>
    </div>
  );
}

export default ProductInfoSection;
