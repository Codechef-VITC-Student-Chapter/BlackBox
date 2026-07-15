"use client";

import { useState, useCallback } from "react";

type SoundType = "ambient" | "click" | "error" | "success" | "typing" | "boot";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return localStorage.getItem("blackbox_audio_pref") !== "unmuted";
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem("blackbox_audio_pref", newState ? "muted" : "unmuted");
      return newState;
    });
  };

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = type === "ambient" ? 0.2 : 0.5;
      if (type === "ambient") audio.loop = true;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }, [isMuted]);

  return { isMuted, toggleMute, playSound };
}
