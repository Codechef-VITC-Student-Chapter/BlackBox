"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MagneticButton = ({ children, onClick, className = "" }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { playSound } = useAudio();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={() => {
        playSound("click");
        onClick?.();
      }}
      className={`relative overflow-hidden rounded-lg bg-text text-background px-8 py-4 font-mono font-medium tracking-wide transition-colors hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] ${className}`}
    >
      {children}
    </motion.button>
  );
};