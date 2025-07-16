export function StrikePrice({ price, className = "", thickness = "1.75px" }) {
  return (
    <span
      className={`text-sm font-normal line-through text-red-600 whitespace-nowrap leading-none ${className}`}
      style={{ textDecorationThickness: thickness }}
    >
      ${price}
    </span>
  );
}
