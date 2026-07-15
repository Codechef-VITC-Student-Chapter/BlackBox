"use client";

import { useAudio } from "@/hooks/useAudio";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export const SoundToggle = () => {
  const { isMuted, toggleMute, playSound } = useAudio();

  const handleToggle = () => {
    toggleMute();
    if (isMuted) playSound("click");
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-50 glass-panel p-3 text-secondary-text hover:text-text transition-colors"
      aria-label="Toggle Sound"
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </motion.button>
  );
};