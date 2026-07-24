"use client";

import React, { useEffect, useState } from "react";
import { ParticlesBackground } from "@/components/background/ParticlesBackground";
import { synth } from "@/utils/synthAudio";

export default function RepositoryRecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessionTime, setSessionTime] = useState("");
  const [statusText, setStatusText] = useState("SYSTEM DEGRADED");
  const [statusClass, setStatusClass] = useState("bg-danger shadow-[0_0_8px_#ff3b30]");

  // Live session clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setSessionTime(timeStr);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync state tracking across subpages using pathname
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Listen to route changes to update header states
    const updateHeaderState = () => {
      const path = window.location.pathname;
      if (path.includes("/success")) {
        setStatusText("RECOVERY COMPLETED");
        setStatusClass("bg-primary shadow-[0_0_8px_#00e5ff]");
      } else if (path.includes("/verify")) {
        // If they verify and succeed, it changes to RESTORED 100%, but initially it's INTEGRITY UNVERIFIED
        setStatusText("INTEGRITY UNVERIFIED");
        setStatusClass("bg-danger shadow-[0_0_8px_#ff3b30]");
      } else if (path.includes("/recover") || path.includes("/evidence")) {
        setStatusText("SYSTEM DEGRADED");
        setStatusClass("bg-danger shadow-[0_0_8px_#ff3b30]");
      } else {
        setStatusText("SYSTEM CORRUPTED");
        setStatusClass("bg-danger shadow-[0_0_8px_#ff3b30]");
      }
    };

    updateHeaderState();
    
    // Track click to initialize AudioContext
    const handleFirstClick = () => {
      synth.playClick();
      document.body.removeEventListener("click", handleFirstClick);
    };
    document.body.addEventListener("click", handleFirstClick);

    // Set up a custom event listener or interval to poll location
    const interval = setInterval(updateHeaderState, 500);

    return () => {
      document.body.removeEventListener("click", handleFirstClick);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans select-none text-white overflow-x-hidden">
      {/* Retro CRT Scanlines & Screen Glow */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-15 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.8)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_3px,3px_100%]" />

      {/* Cyber Grid and Particle canvas */}
      <ParticlesBackground />
      
      {/* Custom Ambient Glows */}
      <div className="pointer-events-none fixed -top-[10%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,102,204,0.08)_0%,rgba(0,0,0,0)_70%)] filter blur-[80px] z-0" />
      <div className="pointer-events-none fixed -bottom-[10%] -right-[10%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,rgba(0,0,0,0)_70%)] filter blur-[50px] z-0" />

      {/* OS Header */}
      <header className="relative z-10 w-full h-[60px] border-b border-white/10 bg-surface/85 backdrop-blur-[8px] flex justify-between items-center px-8 font-mono text-[13px] tracking-wider select-none">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold">BLACKBOX_OS //</span>
          <span className="text-secondary-text">M2_RECOVERY</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${statusClass}`} id="layout-status-indicator" />
          <span className="text-secondary-text uppercase" id="layout-status-text">
            {statusText}
          </span>
        </div>
      </header>

      {/* Main Workspace content */}
      <main className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-6 py-8 flex flex-col justify-center items-center">
        {children}
      </main>

      {/* OS Footer */}
      <footer className="relative z-10 w-full h-[40px] border-t border-white/10 bg-surface/85 flex justify-between items-center px-8 font-mono text-[11px] text-secondary-text select-none">
        <div>SECURE CONNECTION // MODULE_02</div>
        <div>SESSION_TIME: {sessionTime || "--:--:--"}</div>
      </footer>
    </div>
  );
}
