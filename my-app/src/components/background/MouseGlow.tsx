"use client";

import { useMousePosition } from "@/hooks/useMousePosition";
import { motion } from "framer-motion";

export const MouseGlow = () => {
  const { x, y } = useMousePosition();

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      animate={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 229, 255, 0.03), transparent 40%)`,
      }}
    />
  );
};