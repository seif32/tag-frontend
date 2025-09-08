import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function FlyingToCart({ text, start, end, onComplete }) {
  return createPortal(
    <motion.div
      initial={{ x: start.x, y: start.y, scale: 1, opacity: 1 }}
      animate={{ x: end.x, y: end.y, scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="fixed z-[99999] font-semibold text-white bg-primary bg-opacity-95 pointer-events-none px-4 py-2 rounded-full shadow-xl border border-primary/20 backdrop-blur-sm"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
      }}
    >
      {text}
    </motion.div>,
    document.body
  );
}
