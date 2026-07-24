"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, Lock, XCircle, AlertTriangle, Activity, Wrench, Shield, Monitor, Fan } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";

export default function AuthenticationModule() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();

  useEffect(() => {
    const sequence = [
      "Connecting to Core Auth Server...",
      "Bypassing Subnet Firewall...",
      "Searching Engineer Identity...",
      "██████████ 100%",
      "ERROR: Unknown Engineer Identity",
      "CONNECTION FAILED"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];
        setTerminalLines(prev => [...prev, line]);
        playSound("typing");
        if (line.includes("FAILED") || line.includes("ERROR")) {
          playSound("error");
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      {/* ABANDONED UNDERGROUND CONTROL ROOM ENVIRONMENT */}
      <div className="w-full relative min-h-[90vh] rounded-3xl p-4 sm:p-6 lg:p-10 bg-[#050705] border-2 border-[#121c13] shadow-[0_0_120px_rgba(0,0,0,0.99)] overflow-hidden font-mono text-[#33ff66] select-none">
        
        {/* ============================================================ */}
        {/* 1. INDUSTRIAL WALL PANELS, BEAMS, CONDUITS & ENVIRONMENT     */}
        {/* ============================================================ */}

        {/* Industrial Concrete Wall Panels Grid Seams */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none opacity-25" />
        
        {/* Environment Dark Shadow Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_85%,#020402_100%)] pointer-events-none z-10" />

        {/* Thick Vertical Steel Support Beams (Left & Right Viewport Extensions) */}
        <div className="absolute top-0 bottom-0 left-3 sm:left-6 w-8 sm:w-12 bg-[#0c130d] border-x-2 border-[#1a2d1d] shadow-2xl z-0 flex flex-col justify-between py-10 items-center opacity-70">
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
        </div>
        <div className="absolute top-0 bottom-0 right-3 sm:right-6 w-8 sm:w-12 bg-[#0c130d] border-x-2 border-[#1a2d1d] shadow-2xl z-0 flex flex-col justify-between py-10 items-center opacity-70">
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
          <div className="w-full h-4 border-y border-[#263e2a] bg-[#142016]" />
        </div>

        {/* Horizontal Overhead Pipe Conduits & Cable Racks */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#090f09] border-b-2 border-[#172618] z-0 flex items-center justify-around opacity-60">
          <div className="w-12 h-full bg-[#18281b] border-x border-[#283e2c]" />
          <div className="w-12 h-full bg-[#18281b] border-x border-[#283e2c]" />
          <div className="w-12 h-full bg-[#18281b] border-x border-[#283e2c]" />
        </div>

        {/* Ventilation Grilles Embedded into Wall (Top Corners) */}
        <div className="absolute top-8 left-16 hidden lg:flex items-center gap-1 p-2 rounded bg-[#090f09] border border-[#162617] opacity-40">
          <Fan size={14} className="text-[#2b472c] animate-[spin_8s_linear_infinite]" />
          <div className="flex flex-col gap-0.5">
            <div className="w-10 h-[1px] bg-[#1b301c]" />
            <div className="w-10 h-[1px] bg-[#1b301c]" />
            <div className="w-10 h-[1px] bg-[#1b301c]" />
          </div>
        </div>
        <div className="absolute top-8 right-16 hidden lg:flex items-center gap-1 p-2 rounded bg-[#090f09] border border-[#162617] opacity-40">
          <div className="flex flex-col gap-0.5">
            <div className="w-10 h-[1px] bg-[#1b301c]" />
            <div className="w-10 h-[1px] bg-[#1b301c]" />
            <div className="w-10 h-[1px] bg-[#1b301c]" />
          </div>
          <Fan size={14} className="text-[#2b472c] animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Wall Embedded Status LEDs (Blinking in Dark Corners) */}
        <div className="absolute top-16 left-8 flex flex-col gap-2 z-0 opacity-50">
          <div className="flex items-center gap-1.5 text-[8px] text-[#2b472c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444] animate-pulse" />
            <span className="hidden sm:inline">HV_GRID_04</span>
          </div>
          <div className="flex items-center gap-1.5 text-[8px] text-[#2b472c]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
            <span className="hidden sm:inline">AUX_PWR_OFF</span>
          </div>
        </div>

        {/* Faint Stenciled Wall Serial Plate & Warning Markings */}
        <div className="absolute bottom-6 left-16 hidden md:flex items-center gap-4 text-[9px] text-[#253e26] uppercase tracking-widest opacity-45 pointer-events-none">
          <span>CONTROL ROOM 04 // RECOVERY SECTOR</span>
          <span>•</span>
          <span>DANGER: HIGH VOLTAGE MAINFRAME</span>
        </div>

        {/* Background Electrical Spark Effect in Upper Dark Corner */}
        <div className="absolute top-6 right-24 w-1.5 h-1.5 rounded-full bg-[#33ff66] animate-[spark-pulse_6s_infinite] opacity-0" />
        <div className="absolute top-10 left-24 w-1 h-1 rounded-full bg-[#f59e0b] animate-[spark-pulse_8s_infinite] opacity-0" />

        {/* Soft Volumetric Beam Glow from Overhead */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-[radial-gradient(ellipse_at_top,rgba(51,255,102,0.11)_0%,rgba(217,119,6,0.03)_50%,transparent_75%)] pointer-events-none z-0" />
        
        {/* Soft Floor Fog Overlay Layer */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(to_top,rgba(4,10,4,0.6)_0%,transparent_100%)] pointer-events-none z-10" />

        {/* ============================================================ */}
        {/* 2. RETRO 1980s CRT TV MONITOR CONSOLE (INSTALLED IN WALL)    */}
        {/* ============================================================ */}
        <div className="w-full max-w-6xl mx-auto relative rounded-[3rem] sm:rounded-[4rem] border-[14px] sm:border-[20px] border-[#131b14] bg-[#020502] p-4 sm:p-7 lg:p-8 shadow-[0_0_90px_rgba(0,0,0,0.98),inset_0_0_40px_rgba(0,0,0,0.95)] z-20 my-2">
          
          {/* Machine Outer Rivets */}
          <HexBolt className="top-3 left-6" />
          <HexBolt className="top-3 right-6" />
          <HexBolt className="bottom-3 left-6" />
          <HexBolt className="bottom-3 right-6" />

          {/* TV Outer Frame Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b-2 border-[#162217] text-[10px] sm:text-xs text-[#3a543b] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-3">
              <div className="bg-[#0f1610] text-[#4d754e] px-3 py-1 border border-[#203322] rounded flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                <Monitor size={13} className="text-[#33ff66]" />
                <span>RETRO CRT MONITOR // MODEL VT-84 CATHODE TUBE</span>
              </div>
              <span className="hidden md:inline text-[#2b402d]">SYS-ID: BUNK-77-09</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 text-[9px] bg-[#1a1408] text-[#d97706] px-2.5 py-0.5 border border-[#4d330c] rounded">
                <AlertTriangle size={11} className="text-[#f59e0b]" />
                <span>MAINTENANCE SEAL #4092</span>
              </div>

              {/* Physical Indicator Status Lights */}
              <div className="flex items-center gap-2 bg-[#060a07] px-2.5 py-1 rounded border border-[#162618]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#33ff66] shadow-[0_0_8px_#33ff66] animate-pulse" />
                  <span className="text-[#33ff66] text-[9px] font-bold">PWR</span>
                </div>
                <div className="w-[1px] h-3 bg-[#17291a]" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                  <span className="text-[#ef4444] text-[9px] font-bold">ERR</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CURVED CRT TV GLASS BULB SCREEN                              */}
          {/* ============================================================ */}
          <div className="relative rounded-[2.2rem] sm:rounded-[3rem] border-4 border-[#121c14] bg-[#030703] p-4 sm:p-6 lg:p-8 shadow-[inset_0_0_130px_rgba(0,0,0,0.98),inset_0_0_35px_rgba(51,255,102,0.1)] overflow-hidden animate-[crt-flicker_3s_infinite_ease-in-out] transform perspective-[1000px]">

            {/* 1. Curved Glass Lens Glare & Vignette */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.02)_45%,transparent_75%)]" />
            
            {/* 2. Glass Thickness & Curved Edge Side Mirror Reflections */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,transparent_8%,transparent_92%,rgba(255,255,255,0.08)_100%)]" />

            {/* 3. Horizontal Scanlines Across Whole Curved Screen */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.38)_0px,rgba(0,0,0,0.38)_1px,transparent_1px,transparent_3px)] opacity-85" />

            {/* 4. Slow Sweeping Specular Glass Glare (Sweeps every 25s) */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] bg-[length:250%_250%] animate-[glass-glare-sweep_25s_infinite_ease-in-out]" />

            {/* 5. Analog Static Noise Overlay */}
            <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.08] bg-[radial-gradient(#33ff66_1px,transparent_1px)] [background-size:18px_18px]" />

            {/* 6. Faint Background Watermark */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden opacity-[0.03]">
              <div className="text-[9vw] font-black tracking-widest text-[#33ff66] transform -rotate-12 whitespace-nowrap">
                BLACKBOX // SECTOR-04 // RECOVERY
              </div>
            </div>

            {/* ============================================================ */}
            {/* RECESSED DISPLAY CONTENT (TERMINAL & SIDEBAR BEHIND GLASS)    */}
            {/* ============================================================ */}
            <div className="relative z-10 w-full flex flex-col lg:flex-row gap-6 items-stretch">
              
              {/* Left Side: Terminal (Recessed behind glass) */}
              <div className="flex-1 bg-[#040804]/90 border border-[#142616] rounded-lg flex flex-col overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.85)]">
                
                {/* Terminal Header Bar */}
                <div className="border-b border-[#122414] bg-[#071107] p-3 flex items-center justify-between text-xs tracking-wider">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-[#33ff66] drop-shadow-[0_0_5px_rgba(51,255,102,0.8)]" />
                    <span className="font-bold text-[#33ff66] drop-shadow-[0_0_4px_rgba(51,255,102,0.6)]">
                      AUTH_RECOVERY.EXE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#3e663c]">
                    <span className="hidden sm:inline">1200 BAUD</span>
                    <span className="bg-[#0d1c0e] text-[#33ff66] px-2 py-0.5 border border-[#1a381c] rounded">
                      TTY-01
                    </span>
                  </div>
                </div>
                
                {/* Terminal Output Stream */}
                <div className="p-4 sm:p-5 font-mono text-sm sm:text-base space-y-3 flex-1 min-h-[240px] overflow-y-auto leading-relaxed">
                  <div className="text-[11px] text-[#264c23] pb-2 mb-2 border-b border-[#112211] flex items-center justify-between">
                    <span>[VT-100 RECOVERY TERMINAL]</span>
                    <span>COLD BOOT INIT</span>
                  </div>

                  {terminalLines.map((line, idx) => {
                    const isError = line.includes('FAILED') || line.includes('ERROR');
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-2 ${
                          isError 
                            ? 'text-[#ff3333] drop-shadow-[0_0_6px_rgba(255,51,51,0.8)] font-semibold' 
                            : 'text-[#33ff66] drop-shadow-[0_0_5px_rgba(51,255,102,0.7)]'
                        }`}
                      >
                        <span className={isError ? "text-[#ff3333]" : "text-[#1c762e]"}>&gt;</span>
                        <span>{line}</span>
                      </motion.div>
                    );
                  })}
                  
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2.5 h-5 bg-[#33ff66] shadow-[0_0_8px_#33ff66] inline-block ml-1 align-middle"
                  />
                </div>

                {/* Terminal Footer Instruction Directive */}
                <div className="p-4 border-t border-[#122414] bg-[#040e04] relative">
                  <div className="flex items-center gap-2 mb-2 text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#102210] pb-1">
                    <Shield size={12} className="text-[#33ff66]" />
                    <span>CLASSIFIED DIRECTIVE // ENGINEER LOG</span>
                  </div>
                  <p className="font-mono text-[#33ff66]/85 text-xs sm:text-sm leading-relaxed drop-shadow-[0_0_3px_rgba(51,255,102,0.4)]">
                    The machine remembers every visitor. Those who know where memories are kept will find a signed trace. Most will read it. The Engineer expected you to do something else
                  </p>
                  <p className="font-mono text-[#33ff66]/85 text-xs sm:text-sm mt-3 leading-relaxed drop-shadow-[0_0_3px_rgba(51,255,102,0.4)]">
                    Everything you need <br />
                    is already here. <br />
                    <span className="text-[#33ff66] font-bold mt-1 block tracking-wider drop-shadow-[0_0_6px_rgba(51,255,102,0.9)]">
                      Look closer.
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: System Status Panel (Recessed behind glass) */}
              <div className="lg:w-80 flex flex-col gap-4">
                
                {/* Header Plate */}
                <div className="bg-[#071207] border border-[#132415] p-3 rounded-lg flex flex-col gap-1 shadow-[inset_0_0_8px_rgba(0,0,0,0.7)]">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-sm text-[#33ff66] font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_4px_rgba(51,255,102,0.7)] flex items-center gap-2">
                      <Activity size={16} className="text-[#33ff66]" />
                      SYSTEM STATUS
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-[#33ff66] animate-pulse shadow-[0_0_6px_#33ff66]" />
                  </div>
                  <div className="text-[9px] text-[#335630] font-mono tracking-widest flex items-center justify-between border-t border-[#0f1e0e] pt-1 mt-1">
                    <span>HARDWARE RACK 01</span>
                    <span>MODULE-01</span>
                  </div>
                </div>
                
                {/* Hardware Status Rack Modules */}
                <div className="flex flex-col gap-3">
                  <StatusCard title="Authentication" status="FAILED" icon={<XCircle size={18} />} modId="MOD-01" serial="SN:84-A1" />
                  <StatusCard title="Repository" status="LOCKED" icon={<Lock size={18} />} modId="MOD-02" serial="SN:84-R2" />
                  <StatusCard title="Network" status="LOCKED" icon={<Lock size={18} />} modId="MOD-03" serial="SN:84-N3" />
                  <StatusCard title="Memory" status="LOCKED" icon={<Lock size={18} />} modId="MOD-04" serial="SN:84-M4" />
                  <StatusCard title="Core" status="LOCKED" icon={<Lock size={18} />} modId="MOD-05" serial="SN:84-C5" />
                </div>

                {/* Oscilloscope Diagnostic Scope */}
                <div className="mt-auto bg-[#030a03] border border-[#132415] rounded-lg p-3 flex flex-col items-center justify-center gap-2 text-center shadow-[inset_0_0_12px_rgba(0,0,0,0.85)]">
                  <div className="flex items-center justify-between w-full text-[9px] text-[#335630] font-mono tracking-widest border-b border-[#0f1e0e] pb-1">
                    <span>VECTOR DIAGNOSTIC</span>
                    <span>50Hz SCAN</span>
                  </div>
                  <div className="relative w-20 h-20 rounded-full border border-[#193716] bg-[#020602] flex items-center justify-center overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.95)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#122a10_31%,transparent_32%)]" />
                    <div className="absolute w-full h-[1px] bg-[#142f12]" />
                    <div className="absolute h-full w-[1px] bg-[#142f12]" />
                    <div className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left border-l border-t border-[#33ff66]/40 bg-gradient-to-tr from-transparent via-[#33ff66]/10 to-transparent animate-[radar-sweep_4s_linear_infinite]" />
                    <span className="text-[9px] font-mono text-[#33ff66] z-10 font-bold drop-shadow-[0_0_4px_#33ff66]">
                      SCANNING
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Bottom Hardware Caution Plate & Barcode */}
          <div className="mt-4 pt-3 border-t-2 border-[#152116] flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#314a33] uppercase tracking-wider font-bold">
            <div className="flex items-center gap-2">
              <span className="bg-[#241a08] text-[#d97706] px-2 py-0.5 rounded border border-[#4d330c]">
                CAUTION: MANUAL OVERRIDE DISABLED
              </span>
              <span className="hidden sm:inline text-[#293e2b]">INSPECTION SEAL VERIFIED</span>
            </div>
            <div className="flex items-center gap-1 opacity-70">
              <div className="w-1 h-3 bg-[#33ff66]" />
              <div className="w-0.5 h-3 bg-[#33ff66]" />
              <div className="w-1.5 h-3 bg-[#33ff66]" />
              <div className="w-0.5 h-3 bg-[#33ff66]" />
              <div className="w-1 h-3 bg-[#33ff66]" />
              <span className="text-[8px] ml-1 text-[#33ff66]">#8409-BUNKER</span>
            </div>
          </div>

        </div>
      </div>

      {/* Scoped CSS Keyframes */}
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
    </PageTransition>
  );
}

// Subcomponent: Hex Corner Rivet
function HexBolt({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute w-3.5 h-3.5 rounded-full bg-[#131b14] border border-[#253629] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center z-20 ${className}`}>
      <div className="w-2 h-[1px] bg-[#384f3b] transform rotate-45" />
    </div>
  );
}

// Subcomponent: Hardware Rack Module Card
function StatusCard({ 
  title, 
  status, 
  icon, 
  modId, 
  serial 
}: { 
  title: string; 
  status: string; 
  icon: React.ReactNode; 
  modId: string; 
  serial: string;
}) {
  const isFailed = status === "FAILED";
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`relative p-3.5 rounded-md border transition-all duration-300 font-mono ${
        isFailed 
          ? 'bg-[#170809]/90 border-[#ff3333]/70 text-[#ff3333] shadow-[0_0_12px_rgba(255,51,51,0.2)]' 
          : 'bg-[#061006]/90 border-[#152a14] text-[#33ff66] shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]'
      }`}
    >
      <div className="flex flex-col gap-1">
        {/* Module Header Bar */}
        <div className="flex items-center justify-between text-[8px] tracking-widest opacity-60 pb-1 border-b border-white/5">
          <span>{modId}</span>
          <span>{serial}</span>
        </div>

        {/* Status Info Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                isFailed 
                  ? 'bg-[#ff3333] shadow-[0_0_8px_#ff3333] animate-pulse' 
                  : 'bg-[#1f3c1b] border border-[#35632f]'
              }`} />
            </div>

            <div className={`${isFailed ? 'text-[#ff3333] drop-shadow-[0_0_4px_#ff3333]' : 'text-[#33ff66]/80'}`}>
              {icon}
            </div>
            <span className={`text-xs sm:text-sm font-bold tracking-wider ${
              isFailed ? 'text-[#ff3333] drop-shadow-[0_0_4px_rgba(255,51,51,0.6)]' : 'text-[#33ff66] drop-shadow-[0_0_4px_rgba(51,255,102,0.5)]'
            }`}>
              {title}
            </span>
          </div>

          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${
            isFailed 
              ? 'bg-[#3a0c0e] border-[#ff3333] text-[#ff3333] drop-shadow-[0_0_5px_#ff3333]' 
              : 'bg-[#0c1e0b] border-[#1a3a16] text-[#43823c]'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
