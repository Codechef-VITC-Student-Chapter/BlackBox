"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

function CountUpNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{value}</span>;
}

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function ReconstructSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    synth.playSuccessFanfare();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="RECOVERY_COMPLETE.EXE"
        terminalLabel="MODULE 2 CLEARED"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="recovery_complete.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        directiveTitle="CLASSIFIED DIRECTIVE // PHASE COMPLETE"
        directiveText={
          <>
            Repository access restored.
            <br />
            Next coordinate validation stage is loading automatically.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="VERIFIED"
        radarSublabel="MIRROR ACTIVE"
        bottomBarText="RECOVERY NODE DECOMMISSIONED"
        bottomBarSerial="#8409-RECOV-OK"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between items-center text-center">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes logoPulse {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(51, 255, 102, 0.15)); }
              50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(51, 255, 102, 0.4)); }
            }
            .github-logo-animated {
              animation: logoPulse 2.5s ease-in-out infinite;
            }
          `}} />

          {/* Pulsing Logo */}
          <div className="flex justify-center my-4">
            <div className="github-logo-animated w-20 h-20 flex items-center justify-center p-2 rounded-full border border-[#1a2d1d] bg-[#030703]">
              <img 
                src="/images/github_logo.svg" 
                alt="GitHub Logo" 
                className="w-[85%] h-[85%] object-contain filter invert" 
                style={{ filter: "invert(88%) sepia(21%) saturate(2283%) hue-rotate(156deg) brightness(101%) contrast(101%)" }}
              />
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h1 className="font-mono text-xl font-bold text-[#33ff66] tracking-wide uppercase drop-shadow-[0_0_8px_rgba(51,255,102,0.4)]">
              REPOSITORY RESTORED
            </h1>
            <p className="text-[#3c663a] text-xs leading-relaxed max-w-sm mx-auto">
              All system mirrors have successfully synchronized and the authentication path is secure. You have restored the source code repository.
            </p>
          </div>

          {/* Stats Grid Counters */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm my-4 font-mono select-none">
            <div className="bg-[#040e04] border border-[#1a2d1d] rounded p-2 text-center">
              <div className="text-lg font-bold text-[#33ff66] drop-shadow-[0_0_8px_rgba(51,255,102,0.4)]">
                <CountUpNumber target={142} />
              </div>
              <div className="text-[8px] text-[#3c663a] uppercase tracking-widest">Objects</div>
            </div>
            
            <div className="bg-[#040e04] border border-[#1a2d1d] rounded p-2 text-center">
              <div className="text-lg font-bold text-[#33ff66] drop-shadow-[0_0_8px_rgba(51,255,102,0.4)]">
                <CountUpNumber target={318} />
              </div>
              <div className="text-[8px] text-[#3c663a] uppercase tracking-widest">Commits</div>
            </div>
            
            <div className="bg-[#040e04] border border-[#1a2d1d] rounded p-2 text-center">
              <div className="text-lg font-bold text-[#33ff66] drop-shadow-[0_0_8px_rgba(51,255,102,0.4)]">
                <CountUpNumber target={5} />
              </div>
              <div className="text-[8px] text-[#3c663a] uppercase tracking-widest">Branches</div>
            </div>
            
            <div className="bg-[#040e04] border border-[#1a2d1d] rounded p-2 text-center">
              <div className="text-lg font-bold text-[#33ff66] drop-shadow-[0_0_8px_rgba(51,255,102,0.4)]">
                <CountUpNumber target={14} />
              </div>
              <div className="text-[8px] text-[#3c663a] uppercase tracking-widest">Releases</div>
            </div>
          </div>

          {/* Action Area */}
          <div className="w-full max-w-sm pt-3 border-t border-[#1a2d1d] space-y-3">
            <p className="font-mono text-[10px] text-[#3c663a]">
              Redirecting to Verification Portal in <span className="text-[#33ff66] font-bold">{countdown}</span> seconds...
            </p>
            
            <button 
              
              className="w-full border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] py-3 px-8 font-mono font-bold tracking-widest rounded-none transition-all duration-300 uppercase cursor-pointer text-xs"
            >
              CONTINUE
            </button>
          </div>

        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
