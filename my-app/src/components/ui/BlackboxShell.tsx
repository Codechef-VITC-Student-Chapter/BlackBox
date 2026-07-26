"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  AlertTriangle,
  Fan,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Lock,
  Wifi,
  FolderOpen,
  Cpu,
  KeyRound,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

// Reusable Hex Bolt decoration
export function HexBolt({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute w-2 h-2 rounded-full bg-[#131b14] border border-[#253629] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center z-20 ${className}`}
    >
      <div className="w-1.5 h-[1px] bg-[#384f3b] transform rotate-45" />
    </div>
  );
}

// Module status config
export type ModuleStatus = "LOCKED" | "COMPLETE" | "ACTIVE" | "FAILED";

export interface StatusCardInfo {
  title: string;
  status: ModuleStatus;
  modId: string;
  serial: string;
  iconType: "auth" | "repo" | "net" | "puzzle" | "vault" | "cert" | "final";
}

interface BlackboxShellProps {
  moduleCode: string; // e.g., "MOD-01"
  exeName: string; // e.g., "AUTH_RECOVERY.EXE"
  terminalLabel: string; // e.g., "VT-100 RECOVERY TERMINAL"
  maintenanceSeal: string; // e.g., "#4092"
  pwrLight?: "green" | "red";
  errLight?: "green" | "red" | "off";
  errLabel?: string;
  
  // CRT Panel header
  terminalHeaderExe: string; // e.g., "AUTH_RECOVERY.EXE"
  baudRate?: string; // e.g., "1200 BAUD"
  ttyNumber?: string; // e.g., "TTY-01"
  
  // Left Panel Content
  bootLogs?: string[];
  children: React.ReactNode; // Functional content
  
  // Directive Footer
  directiveTitle?: string;
  directiveText?: React.ReactNode;
  
  // Right Panel
  statusLabel?: string;
  statusCards: StatusCardInfo[];
  
  // Radar
  radarLabel: string;
  radarSublabel: string;
  radarGlow?: boolean;
  
  // Bottom Bar
  bottomBarText: string;
  bottomBarSerial: string;
  
  // Wall stencil
  wallStencil?: string;
  compactStatus?: boolean;
}

export default function BlackboxShell({
  moduleCode,
  exeName,
  terminalLabel,
  maintenanceSeal,
  pwrLight = "green",
  errLight = "red",
  errLabel = "ERR",
  terminalHeaderExe,
  baudRate = "1200 BAUD",
  ttyNumber = "TTY-01",
  bootLogs = [],
  children,
  directiveTitle = "CLASSIFIED DIRECTIVE // ENGINEER LOG",
  directiveText,
  statusLabel = "SYSTEM STATUS",
  statusCards,
  radarLabel,
  radarSublabel,
  radarGlow = false,
  bottomBarText,
  bottomBarSerial,
  wallStencil,
  compactStatus,
}: BlackboxShellProps) {
  const { playSound } = useAudio();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-type boot sequence
  useEffect(() => {
    if (bootLogs.length === 0) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        const line = bootLogs[i];
        setTerminalLines((prev) => [...prev, line]);
        playSound("typing");
        if (line.includes("FAILED") || line.includes("ERROR")) {
          playSound("error");
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [bootLogs, playSound]);

  // Scroll to bottom of terminal output stream
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  return (
    <div className="w-screen h-screen bg-[#050705] font-mono text-[#33ff66] flex flex-col overflow-hidden select-none relative z-10">
      
      {/* ============================================================ */}
      {/* 1. ENVIRONMENT LAYERS                                         */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none opacity-25 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_85%,#020402_100%)] pointer-events-none z-10" />
      
      {/* Beams */}
      <div className="absolute top-0 bottom-0 left-3 w-8 bg-[#0c130d] border-x border-[#1a2d1d] opacity-50 z-0 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-3 w-8 bg-[#0c130d] border-x border-[#1a2d1d] opacity-50 z-0 pointer-events-none" />
      
      {/* Conduit */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#090f09] border-b border-[#172618] opacity-50 z-0 pointer-events-none" />
      
      {/* Vents */}
      <div className="absolute top-12 left-16 hidden lg:flex items-center gap-1 p-1 bg-[#090f09] border border-[#162617] opacity-35 z-0 pointer-events-none">
        <Fan size={14} className="text-[#2b472c] animate-[spin_8s_linear_infinite]" />
        <div className="flex flex-col gap-0.5">
          <div className="w-10 h-[1px] bg-[#1b301c]" />
          <div className="w-10 h-[1px] bg-[#1b301c]" />
          <div className="w-10 h-[1px] bg-[#1b301c]" />
        </div>
      </div>
      <div className="absolute top-12 right-16 hidden lg:flex items-center gap-1 p-1 bg-[#090f09] border border-[#162617] opacity-35 z-0 pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <div className="w-10 h-[1px] bg-[#1b301c]" />
          <div className="w-10 h-[1px] bg-[#1b301c]" />
          <div className="w-10 h-[1px] bg-[#1b301c]" />
        </div>
        <Fan size={14} className="text-[#2b472c] animate-[spin_10s_linear_infinite]" />
      </div>

      {/* Blinking LEDs */}
      <div className="absolute top-16 left-16 flex flex-col gap-1 z-0 opacity-40 pointer-events-none">
        <div className="flex items-center gap-1 text-[8px] text-[#2b472c]">
          <span className="w-1 h-1 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444] animate-pulse" />
          <span className="hidden sm:inline">HV_GRID_04</span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-[#2b472c]">
          <span className="w-1 h-1 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
          <span className="hidden sm:inline">AUX_PWR_OFF</span>
        </div>
      </div>

      {/* Volumetric glow */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-full max-w-2xl h-60 bg-[radial-gradient(ellipse_at_top,rgba(51,255,102,0.08)_0%,transparent_70%)] z-0 pointer-events-none" />

      {/* Floor fog */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(to_top,rgba(4,10,4,0.4)_0%,transparent_100%)] pointer-events-none z-10" />

      {/* Electrical Sparks */}
      <div className="absolute top-6 right-24 w-1.5 h-1.5 rounded-full bg-[#33ff66] animate-[spark-pulse_6s_infinite] opacity-0 pointer-events-none" />
      <div className="absolute top-10 left-24 w-1 h-1 rounded-full bg-[#f59e0b] animate-[spark-pulse_8s_infinite] opacity-0 pointer-events-none" />

      {/* Wall Stencil */}
      {wallStencil && (
        <div className="absolute bottom-10 left-16 hidden md:flex items-center gap-4 text-[9px] text-[#1c301d] uppercase tracking-widest opacity-45 pointer-events-none z-0">
          <span>{wallStencil}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. TOP BAR                                                   */}
      {/* ============================================================ */}
      <header className="h-10 border-b border-[#1a2d1d] bg-[#040904] flex items-center justify-between px-6 z-50 relative flex-shrink-0 text-[10px] uppercase tracking-widest">
        <HexBolt className="top-1 left-1" />
        <HexBolt className="top-1 right-1" />
        
        <div className="flex items-center gap-2">
          <span className="text-[#33ff66] font-bold">[{moduleCode}]</span>
          <span className="text-[#3c663a]">·</span>
          <span>{exeName}</span>
          <span className="text-[#3c663a]">·</span>
          <span className="text-[#3c663a] hidden sm:inline">{terminalLabel}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 bg-[#1a1408] text-[#d97706] px-2 py-0.5 border border-[#4d330c] rounded">
            <AlertTriangle size={11} className="text-[#f59e0b]" />
            <span>MAINTENANCE SEAL {maintenanceSeal}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#060a07] px-2.5 py-0.5 rounded border border-[#162618]">
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#33ff66] animate-pulse ${pwrLight === "green" ? "bg-[#33ff66]" : "bg-[#ef4444]"}`} />
              <span className="text-[#33ff66] text-[8px] font-bold">PWR</span>
            </div>
            <div className="w-[1px] h-3 bg-[#17291a]" />
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${errLight === "green" ? "bg-[#33ff66] shadow-[0_0_8px_#33ff66] animate-pulse" : errLight === "red" ? "bg-[#ef4444] shadow-[0_0_8px_#ef4444]" : "bg-[#17291a]"}`} />
              <span className={`text-[8px] font-bold ${errLight === "green" ? "text-[#33ff66]" : errLight === "red" ? "text-[#ff3333]" : "text-[#264c23]"}`}>{errLabel}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. MAIN CONTENT CONTAINER                                     */}
      {/* ============================================================ */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* Left Panel */}
        <section className="flex-1 flex flex-col border-r border-[#1a2d1d] overflow-hidden bg-[#030703] relative">
          
          {/* Left panel header strip */}
          <div className="h-10 border-b border-[#122414] bg-[#071107] px-4 flex items-center justify-between text-xs flex-shrink-0 text-[#33ff66]/80 font-mono">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#33ff66]" />
              <span className="font-bold">{terminalHeaderExe}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#3e663c]">
              <span>{baudRate}</span>
              <span className="bg-[#0d1c0e] text-[#33ff66] px-2 py-0.5 border border-[#1a381c] rounded">
                {ttyNumber}
              </span>
            </div>
          </div>

          {/* CRT display content area with scanlines and glow */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            
            {/* Scanlines, glass, specular sweep overlay */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_1px,transparent_1px,transparent_3px)] opacity-80" />
            <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.06)_0%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.08)_50%,transparent_55%)] bg-[length:250%_250%] animate-[glass-glare-sweep_25s_infinite_ease-in-out]" />
            <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.05] bg-[radial-gradient(#33ff66_1px,transparent_1px)] [background-size:18px_18px]" />

            {/* Main scrollable CRT display stream wrapper */}
            <div className="flex-1 overflow-y-auto p-5 relative z-10 animate-[crt-flicker_3s_infinite_ease-in-out] flex flex-col">
              
              {/* Terminal Output stream (max-h-40) */}
              {bootLogs.length > 0 && (
                <div className="max-h-40 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1.5 text-xs sm:text-sm">
                  {terminalLines.map((line, idx) => {
                    const isError = line.includes("FAILED") || line.includes("ERROR");
                    const isWarning = line.includes("WARNING") || line.includes("HALT") || line.includes("Compromised") || line.includes("Mismatch");
                    const isHighlight = line.startsWith(">>") || line.includes("VERIFIED") || line.includes("Restored") || line.includes("SUCCESSFUL") || line.includes("COMPLETE");
                    
                    let textColor = "text-[#33ff66] drop-shadow-[0_0_5px_rgba(51,255,102,0.7)]";
                    if (isError) textColor = "text-[#ff3333] drop-shadow-[0_0_6px_rgba(255,51,51,0.8)] font-semibold";
                    else if (isWarning) textColor = "text-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]";
                    else if (isHighlight) textColor = "text-[#33ff66] font-bold drop-shadow-[0_0_8px_rgba(51,255,102,0.9)]";

                    return (
                      <div key={idx} className={`flex items-start gap-2 ${textColor}`}>
                        <span className="text-[#1c762e]">&gt;</span>
                        <span>{line}</span>
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {/* Module functional content area */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                {children}
              </div>

            </div>

            {/* Directive Footer */}
            {directiveText && (
              <footer className="flex-shrink-0 border-t border-[#122414] bg-[#040e04] p-4 relative z-10 font-mono">
                <div className="flex items-center gap-2 mb-1.5 text-[9px] text-[#3c663a] uppercase tracking-widest border-b border-[#102210] pb-1">
                  <Shield size={10} className="text-[#33ff66]" />
                  <span>{directiveTitle}</span>
                </div>
                <div className="text-[#33ff66]/85 text-xs leading-relaxed drop-shadow-[0_0_3px_rgba(51,255,102,0.4)]">
                  {directiveText}
                </div>
              </footer>
            )}

          </div>
        </section>

        {/* Right Panel */}
        <aside className="w-80 flex flex-col bg-[#040904] border-l border-[#1a2d1d] flex-shrink-0 overflow-hidden relative">
          {/* Header */}
          <div className="h-10 border-b border-[#132415] bg-[#071207] p-3 flex items-center justify-between flex-shrink-0">
            <h2 className="font-heading text-[10px] text-[#33ff66] font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_4px_rgba(51,255,102,0.7)] flex items-center gap-2">
              <Activity size={12} className="text-[#33ff66]" />
              {statusLabel}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#33ff66] animate-pulse shadow-[0_0_6px_#33ff66]" />
          </div>

          {/* Status cards stack */}
          <div className={`flex-1 overflow-y-auto flex flex-col ${(compactStatus || statusCards.length > 5) ? "gap-1.5 p-2.5" : "gap-2 p-3"}`}>
            {statusCards.map((card, idx) => (
              <StatusCardComponent key={idx} card={card} compact={compactStatus || statusCards.length > 5} />
            ))}
          </div>

          {/* Radar scope */}
          <div className="flex-shrink-0 p-3 border-t border-[#1a2d1d] bg-[#030a03] flex flex-col items-center justify-center gap-1.5 text-center shadow-[inset_0_0_12px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between w-full text-[8px] text-[#335630] font-mono tracking-widest border-b border-[#0f1e0e] pb-1">
              <span>VECTOR DIAGNOSTIC</span>
              <span>50Hz SCAN</span>
            </div>
            <div className="relative w-16 h-16 rounded-full border border-[#193716] bg-[#020602] flex items-center justify-center overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.95)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#122a10_31%,transparent_32%)]" />
              <div className="absolute w-full h-[1px] bg-[#142f12]" />
              <div className="absolute h-full w-[1px] bg-[#142f12]" />
              <div className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left border-l border-t border-[#33ff66]/30 bg-gradient-to-tr from-transparent via-[#33ff66]/10 to-transparent animate-[radar-sweep_4s_linear_infinite]" />
              <span className={`text-[8px] font-mono text-[#33ff66] z-10 font-bold ${radarGlow ? "drop-shadow-[0_0_6px_#33ff66]" : "drop-shadow-[0_0_3px_#33ff66]"}`}>
                {radarLabel}
              </span>
            </div>
            <div className="text-[7px] text-[#2b472c] uppercase font-bold tracking-wider">{radarSublabel}</div>
          </div>
        </aside>

      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM BAR                                                */}
      {/* ============================================================ */}
      <footer className="h-8 border-t border-[#1a2d1d] bg-[#040904] flex items-center justify-between px-6 z-50 flex-shrink-0 text-[9px] uppercase tracking-wider font-bold">
        <HexBolt className="bottom-1 left-1" />
        <HexBolt className="bottom-1 right-1" />
        
        <div className="flex items-center gap-2">
          <span>{bottomBarText}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-2 bg-[#33ff66]" />
          <div className="w-1 h-2 bg-[#33ff66]" />
          <div className="w-0.5 h-2 bg-[#33ff66]" />
          <span className="text-[#33ff66] ml-1">{bottomBarSerial}</span>
        </div>
      </footer>

      {/* Global raw styles */}
      <style jsx global>{`
        @keyframes glass-glare-sweep {
          0% { background-position: -200% -200%; }
          100% { background-position: 300% 300%; }
        }
        @keyframes crt-flicker {
          0%, 100% { opacity: 0.98; }
          48% { opacity: 0.98; }
          50% { opacity: 0.95; }
          52% { opacity: 0.99; }
          94% { opacity: 0.98; }
          96% { opacity: 0.94; }
          98% { opacity: 1; }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spark-pulse {
          0%, 100% { opacity: 0; }
          48% { opacity: 0; }
          50% { opacity: 1; filter: drop-shadow(0 0 6px #33ff66); }
          52% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Subcomponent: StatusCard
function StatusCardComponent({ card, compact }: { card: StatusCardInfo; compact: boolean }) {
  const isFailed = card.status === "FAILED";
  const isComplete = card.status === "COMPLETE";
  const isActive = card.status === "ACTIVE";
  const isLocked = card.status === "LOCKED";

  const getStatusStyle = () => {
    if (isFailed) {
      return {
        cardBg: "bg-[#170809]/90 border-[#ff3333]/70 text-[#ff3333] shadow-[0_0_12px_rgba(255,51,51,0.2)]",
        badge: "bg-[#3a0c0e] border-[#ff3333] text-[#ff3333] drop-shadow-[0_0_5px_#ff3333]",
        led: "bg-[#ff3333] shadow-[0_0_8px_#ff3333] animate-pulse",
      };
    }
    if (isComplete) {
      return {
        cardBg: "bg-[#061006]/90 border-[#152a14] text-[#33ff66] shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]",
        badge: "bg-[#0c1e0b] border-[#1a3a16] text-[#43823c]",
        led: "bg-[#1f3c1b] border border-[#35632f]",
      };
    }
    if (isActive) {
      return {
        cardBg: "bg-[#0c240c]/90 border-[#33ff66]/60 text-[#33ff66] shadow-[0_0_10px_rgba(51,255,102,0.25)]",
        badge: "bg-[#0c1e0b] border-[#33ff66] text-[#33ff66] animate-pulse drop-shadow-[0_0_4px_#33ff66]",
        led: "bg-[#33ff66] shadow-[0_0_8px_#33ff66] animate-pulse",
      };
    }
    // LOCKED
    return {
      cardBg: "bg-[#050905]/40 border-[#1a2d1d]/30 text-[#264c23] opacity-40",
      badge: "bg-[#020502] border-[#1a2d1d]/30 text-[#264c23]",
      led: "bg-[#0f1c0e] border border-[#1a2d1d]/20",
    };
  };

  const getIcon = () => {
    const size = compact ? 14 : 16;
    if (isComplete) return <CheckCircle2 size={size} className="text-[#33ff66]" />;
    if (isFailed) return <XCircle size={size} className="text-[#ff3333]" />;
    if (isLocked) return <Lock size={size} className="text-[#264c23]" />;
    
    // ACTIVE icons based on Type
    switch (card.iconType) {
      case "auth": return <Shield size={size} />;
      case "repo": return <FolderOpen size={size} />;
      case "net": return <Wifi size={size} />;
      case "puzzle": return <Cpu size={size} />;
      case "vault": return <KeyRound size={size} />;
      case "cert": return <Code2 size={size} />;
      case "final": return <ShieldCheck size={size} />;
      default: return <Lock size={size} />;
    }
  };

  const style = getStatusStyle();

  return (
    <motion.div
      whileHover={isLocked ? {} : { scale: 1.02 }}
      className={`relative rounded border transition-all duration-300 font-mono flex flex-col ${style.cardBg} ${compact ? "p-2.5" : "p-3.5"}`}
    >
      <div className="flex flex-col gap-1 w-full">
        {/* Module Header Bar */}
        <div className="flex items-center justify-between text-[8px] tracking-widest opacity-60 pb-1 border-b border-white/5">
          <span>{card.modId}</span>
          <span>{card.serial}</span>
        </div>

        {/* Status Info Row */}
        <div className="flex items-center justify-between pt-1 w-full">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full inline-block ${style.led}`} />
            <div className="flex items-center gap-1.5">
              {getIcon()}
              <span className={`font-bold tracking-wider ${compact ? "text-[11px]" : "text-xs"}`}>
                {card.title}
              </span>
            </div>
          </div>
          <span className={`font-bold rounded border uppercase tracking-widest text-[8px] px-1.5 py-0.5 ${style.badge}`}>
            {card.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
