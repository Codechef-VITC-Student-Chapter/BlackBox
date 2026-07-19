"use client";

import { useState, useCallback, useEffect } from "react";

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
