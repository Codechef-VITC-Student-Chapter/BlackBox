"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAudio } from "@/hooks/useAudio";

const BOOT_STEPS = [
  "Initializing Recovery...",
  "█████████████",
  "Checking Identity...",
  "Loading Recovery Engine...",
  "Preparing Terminal...",
  "Launching Authentication..."
];

export const BootSequence = ({ isActive }: { isActive: boolean }) => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { playSound } = useAudio();

  useEffect(() => {
    if (!isActive) return;

    playSound("boot");
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < BOOT_STEPS.length - 1) {
        currentStep++;
        setStep(currentStep);
        playSound("typing");
      } else {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/authentication");
        }, 1000);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isActive, router, playSound]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col items-start justify-center p-12 lg:p-32 font-mono text-primary text-lg lg:text-2xl"
      >
        <div className="max-w-2xl w-full mx-auto space-y-4">
          {BOOT_STEPS.slice(0, step + 1).map((text, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span>{`>`}</span>
              <span>{text}</span>
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-3 h-6 bg-primary mt-4"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};