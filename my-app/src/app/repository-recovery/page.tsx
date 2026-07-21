"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";

const BOOT_LOGS = [
  { text: "BLACKBOX OS [BOOT VER. 1.0.4]", type: "system" },
  { text: "SECURE ENCLAVE LOADED SUCCESSFULLY.", type: "normal" },
  { text: "INITIALIZING AUTHENTICATION MEMORY SYSTEM... OK", type: "normal" },
  { text: "CONNECTING TO PRIMARY REPOSITORY STORAGE...", type: "normal" },
  { text: "ERROR: SQL STATE [42000] - FILE ACCESS DENIED", type: "error" },
  { text: "CRITICAL SYSTEM FAILURE DETECTED.", type: "error" },
  { text: "INTEGRITY STATUS: [DEGRADED]", type: "error" },
  { text: "SCANNING EMERGENCY RECOVERY MIRRORS...", type: "system" },
  { text: "BACKUP SERVER 1 (HONG KONG) ..... [OFFLINE]", type: "error" },
  { text: "BACKUP SERVER 2 (FRANKFURT) ..... [OFFLINE]", type: "error" },
  { text: "BACKUP SERVER 3 (AMSTERDAM) ..... [ONLINE - COMPROMISED]", type: "system" },
  { text: "EMERGENCY BACKUP FOUND: Sector 7 Fragment Survives.", type: "success" },
  { text: "DIAGNOSTIC ADVISORY: Begin recovery investigation.", type: "system" }
];

export default function RepositoryRecoveryLanding() {
  const router = useRouter();
  const [displayedLogs, setDisplayedLogs] = useState<Array<{ text: string; type: string }>>([]);
  const [integrityGlow, setIntegrityGlow] = useState("text-warning shadow-[0_0_8px_rgba(250,204,21,0.4)]");
  const [integrityText, setIntegrityText] = useState("CHECKING...");
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Progress Bar filler (runs concurrently over 6.5s)
  useEffect(() => {
    const totalDuration = 6500;
    const intervalTime = 50;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // 2. Character-by-character printing logic
  useEffect(() => {
    let logIdx = 0;

    function printNextLog() {
      if (logIdx >= BOOT_LOGS.length) {
        // Complete
        setTimeout(() => {
          synth.playError();
          setIntegrityText("OFFLINE");
          setIntegrityGlow("text-danger shadow-[0_0_8px_rgba(255,77,109,0.5)]");
          setIsDone(true);
        }, 500);
        return;
      }

      const log = BOOT_LOGS[logIdx];
      let charIdx = 0;
      let currentText = "";

      // Add a new empty entry
      setDisplayedLogs((prev) => [...prev, { text: "", type: log.type }]);

      const typeInterval = setInterval(() => {
        if (charIdx < log.text.length) {
          currentText += log.text[charIdx];
          setDisplayedLogs((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { text: currentText, type: log.type };
            return copy;
          });
          charIdx++;

          // Click sound wave
          if (Math.random() > 0.45) {
            synth.playClick();
          }
        } else {
          clearInterval(typeInterval);
          logIdx++;

          // Auto-scroll
          if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
          }

          // Delay before next line (longer for errors)
          const delay = log.type === "error" ? 800 : 300;
          activeIntervalRef.current = setTimeout(printNextLog, delay);
        }
      }, 15);
    }

    // Start logs printing after a brief initial pause
    const startTimeout = setTimeout(printNextLog, 800);

    return () => {
      clearTimeout(startTimeout);
      if (activeIntervalRef.current) clearTimeout(activeIntervalRef.current);
    };
  }, []);

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedLogs]);

  const handleBegin = () => {
    synth.playSuccess();
    router.push("/repository-recovery/scan");
  };

  return (
    <PageTransition>
      <div className="w-full max-w-[900px] glass-panel p-8 grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-8 shadow-2xl relative overflow-hidden border border-white/10 animate-fade-in">
        
        {/* Left Column: Diagnostics Terminal */}
        <div className="flex flex-col h-full min-h-[350px] md:min-h-[400px]">
          <div className="flex items-center gap-2 px-4 py-3 bg-surface/50 border border-white/10 border-b-0 rounded-t-lg select-none">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/50" />
            </div>
            <span className="font-mono text-xs text-secondary-text/80 ml-2">boot_diagnostics.log</span>
          </div>
          
          <div className="flex-1 bg-black/60 border border-white/10 rounded-b-lg p-5 font-mono text-[12px] leading-relaxed overflow-y-auto no-scrollbar max-h-[380px] min-h-[250px]">
            {displayedLogs.map((log, idx) => {
              if (!log) return null;
              return (
                <p 
                  key={idx} 
                  className={`mb-2 ${
                    log.type === "system" ? "text-primary text-shadow-[0_0_4px_rgba(0,229,255,0.3)]" : 
                    log.type === "error" ? "text-danger font-bold text-shadow-[0_0_4px_rgba(255,77,109,0.3)]" : 
                    log.type === "success" ? "text-success text-shadow-[0_0_4px_rgba(34,197,94,0.3)]" :
                    "text-white"
                  }`}
                >
                  &gt; {log.text}
                  {idx === displayedLogs.length - 1 && !isDone && (
                    <span className="inline-block w-1.5 h-3.5 bg-primary ml-1 align-middle animate-pulse" />
                  )}
                </p>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Right Column: Diagnostics HUD */}
        <div className="flex flex-col justify-between h-full space-y-6 md:space-y-0">
          <div>
            <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-4">
              SYSTEM DIAGNOSTICS
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/30 border border-white/5 p-3 rounded font-mono">
                <div className="text-[10px] text-secondary-text tracking-wider uppercase mb-1">OS KERNEL</div>
                <div className="text-sm text-primary font-bold">SECURE_v1.0</div>
              </div>
              <div className="bg-surface/30 border border-white/5 p-3 rounded font-mono">
                <div className="text-[10px] text-secondary-text tracking-wider uppercase mb-1">IP ADDRESS</div>
                <div className="text-sm text-secondary-text/80">10.244.11.89</div>
              </div>
              <div className="bg-surface/30 border border-white/5 p-3 rounded font-mono">
                <div className="text-[10px] text-secondary-text tracking-wider uppercase mb-1">INTEGRITY</div>
                <div className={`text-sm font-bold transition-all duration-300 ${integrityGlow}`}>
                  {integrityText}
                </div>
              </div>
              <div className="bg-surface/30 border border-white/5 p-3 rounded font-mono">
                <div className="text-[10px] text-secondary-text tracking-wider uppercase mb-1">MIRRORS</div>
                <div className="text-sm text-white/80 font-bold">1 / 3 ONLINE</div>
              </div>
            </div>
          </div>

          {/* Progress bar HUD */}
          <div className="py-2">
            <div className="font-mono text-[10px] text-secondary-text tracking-widest uppercase mb-2">
              INTEGRITY RECONSTRUCTION PROGRESS
            </div>
            <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_#00e5ff] transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-secondary-text">Analyzing sectors...</span>
              <span className="text-primary font-bold">{Math.floor(progress)}%</span>
            </div>
          </div>

          {/* Cyber Trigger Button */}
          <button 
            onClick={handleBegin}
            disabled={!isDone}
            className={`w-full font-mono font-bold tracking-widest border py-3.5 px-6 rounded transition-all duration-500 uppercase select-none ${
              isDone 
                ? "border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_#00e5ff] animate-pulse cursor-pointer" 
                : "border-white/10 text-secondary-text/40 bg-white/5 opacity-50 cursor-not-allowed"
            }`}
          >
            BEGIN INVESTIGATION
          </button>
        </div>

      </div>
    </PageTransition>
  );
}
