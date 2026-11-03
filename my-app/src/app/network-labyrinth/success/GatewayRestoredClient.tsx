"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { Shield, GitBranch, Wifi, Database, Cpu } from "lucide-react";

const SUBSYSTEMS = [
  { label: "Authentication", icon: Shield,    delay: 0.4 },
  { label: "Repository",     icon: GitBranch, delay: 0.8 },
  { label: "Gateway",        icon: Wifi,      delay: 1.3 },
  { label: "Memory",         icon: Database,  delay: null },
  { label: "Core",           icon: Cpu,       delay: null },
];

const BOOT_LINES = [
  "Scanning Connected Services...",
  "Gateway Responding...",
  "Production APIs Detected...",
  "Launching Network Diagnostics...",
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "ACTIVE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function GatewayRestoredClient() {
  const router = useRouter();
  const [restored, setRestored] = useState<boolean[]>(Array(SUBSYSTEMS.length).fill(false));
  const [bootLine, setBootLine] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  // Subsystems restore animation
  useEffect(() => {
    synth.playSuccessFanfare();
    const timers: NodeJS.Timeout[] = [];
    
    SUBSYSTEMS.forEach((sys, i) => {
      if (sys.delay !== null) {
        timers.push(
          setTimeout(() => {
            setRestored((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            synth.playSuccess();
          }, sys.delay * 1000)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Boot lines + redirect
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setBootLine(idx);
      if (idx >= BOOT_LINES.length) {
        clearInterval(interval);
        setRedirecting(true);
        setTimeout(() => router.push("/codechef-puzzle"), 1400);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="NET_CLEARED.EXE"
        terminalLabel="MODULE 3 CLEARED"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="network_restore.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        directiveTitle="CLASSIFIED DIRECTIVE // PHASE COMPLETE"
        directiveText={
          <>
            Gateway link restored 100%.
            <br />
            Subsystems integrity synchronization completed. Redirecting to next node.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="CLEARED"
        radarSublabel="LINK SECURE"
        bottomBarText="NETWORK NODE DECOMMISSIONED"
        bottomBarSerial="#8409-NET-OK"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          
          {/* Subsystems display list */}
          <div className="divide-y divide-[#122414] border border-[#1a2d1d] bg-[#040e04] rounded-md">
            {SUBSYSTEMS.map((sys, i) => {
              const Icon = sys.icon;
              const isRestored = restored[i];
              const isPending = sys.delay !== null && !isRestored;
              return (
                <div key={sys.label} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Icon size={14} className="text-[#3c663a] shrink-0" />
                    <span className="font-mono text-xs text-[#3c663a]">{sys.label}</span>
                  </div>
                  <div className="font-mono text-xs font-bold">
                    {isRestored ? (
                      <span className="text-[#33ff66] drop-shadow-[0_0_5px_#33ff66]">✓</span>
                    ) : isPending ? (
                      <span className="text-[#f59e0b] animate-pulse">···</span>
                    ) : (
                      <span className="text-[#3c663a]/40">✗</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Boot log streams */}
          <div className="bg-[#030703] border border-[#1a2d1d] rounded-md p-4 font-mono text-xs space-y-1.5 min-h-[100px]">
            {BOOT_LINES.slice(0, bootLine).map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#33ff66]/50">&gt;</span>
                <span className={i === bootLine - 1 ? "text-[#33ff66]" : "text-[#3c663a]"}>
                  {line}
                </span>
              </div>
            ))}
            {redirecting && (
              <div className="flex items-center gap-2 text-[#33ff66] font-bold">
                <span>&gt;</span>
                <span>Routing to Memory Reconstruction...</span>
              </div>
            )}
            {!redirecting && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-3 bg-[#33ff66]/70 ml-1 align-middle"
              />
            )}
          </div>

        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
