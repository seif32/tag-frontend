import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function CartBadge() {
  const uniqueItems = useCartStore((state) => state.uniqueItems);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (uniqueItems > 0) {
      setAnimateKey((prev) => prev + 1);
    }
  }, [uniqueItems]);

  return (
    <AnimatePresence mode="popLayout">
      {uniqueItems > 0 && (
        <motion.span
          key={animateKey}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 20,
          }}
          className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full top-0 -right-1"
        >
          {uniqueItems}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default CartBadge;
