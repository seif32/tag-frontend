import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BsHeartFill } from "react-icons/bs";

export function HeartButton({ onClick, className = "", ...props }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    onClick?.(isLiked);
  };

  return (
    <Button
      variant="ghost"
      className={`aspect-square flex-shrink-0 border-primary border-1 h-12 md:h-10 cursor-pointer ${className}`}
      onClick={handleClick}
      {...props}
    >
      <BsHeartFill
        className={`transition-all duration-300 ease-in-out transform ${
          isLiked
            ? "text-red-500 scale-120 opacity-100"
            : "text-gray-400 scale-100 opacity-80"
        }`}
      />
    </Button>
  );
}
