"use client";

import { useState, useCallback, useEffect } from "react";
import { synth } from "@/utils/synthAudio";

type SoundType = "ambient" | "click" | "error" | "success" | "typing" | "boot";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const muted =
      localStorage.getItem("blackbox_audio_pref") !== "unmuted";

    const timer = setTimeout(() => {
      setIsMuted(muted);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem("blackbox_audio_pref", newState ? "muted" : "unmuted");
      return newState;
    });
  };

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    
    switch (type) {
      case "click":
      case "typing":
        synth.playClick();
        break;
      case "error":
        synth.playError();
        break;
      case "success":
        synth.playSuccess();
        break;
      case "boot":
        synth.playScanSweep();
        break;
      default:
        synth.playClick();
        break;
    }
  }, [isMuted]);

  return { isMuted, toggleMute, playSound };
}
