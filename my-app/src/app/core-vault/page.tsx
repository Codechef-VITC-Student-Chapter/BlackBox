"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const BOOT_LOGS = [
  "Checking recovered subsystems...",
  "Loading recovery status...",
  "Security Clearance Verified",
  "██████████ 100%",
  "CORE STATUS : OFFLINE",
  "Recovery Required"
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "ACTIVE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function CoreVaultPage() {
  const router = useRouter();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        const line = BOOT_LOGS[i];
        setTerminalLines((prev) => [...prev, line]);
        synth.playClick();
        if (line.includes("OFFLINE")) {
          synth.playError();
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-05"
        exeName="CORE_RECOVERY.EXE"
        terminalLabel="VT-520 CORE SECURE VAULT"
        maintenanceSeal="#4095"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="core_diagnostics.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-05"
        directiveTitle="CLASSIFIED DIRECTIVE // VAULT RECOVERY"
        directiveText={
          <>
            The core vault handles low-level instructions verification.
            <br />
            To recover the core, provide the decrypted token from Module 4.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURING"
        radarSublabel="VAULT SECURITY GATE"
        bottomBarText="CAUTION: CORE OVERRIDE SYSTEM STANDBY"
        bottomBarSerial="#8409-CORE"
        wallStencil="CONTROL ROOM 04 // CORE SECTOR"
      >
        {/* Terminal output */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {terminalLines.map((line, idx) => (
            <p
              key={idx}
              className={`text-xs ${
                line.includes("OFFLINE") ? "text-[#ff3333] font-bold" : "text-[#3c663a]"
              }`}
            >
              &gt; {line}
            </p>
          ))}
          {terminalLines.length < BOOT_LOGS.length && (
            <span className="inline-block w-1.5 h-3 bg-[#33ff66]/70 ml-1 animate-pulse" />
          )}
        </div>

        {/* Recovered Modules & Recover button */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-2 font-bold select-none">
              // RECOVERED MODULES INTEGRITY STATUS
            </div>

            <div className="divide-y divide-[#122414] border border-[#1a2d1d] bg-[#040e04] rounded-md">
              {[
                { name: "Authentication", status: "COMPLETE", ok: true },
                { name: "Repository", status: "COMPLETE", ok: true },
                { name: "Gateway", status: "COMPLETE", ok: true },
                { name: "CodeChef Puzzle", status: "COMPLETE", ok: true },
                { name: "Core Vault", status: "OFFLINE", ok: false },
              ].map(mod => (
                <div key={mod.name} className="flex justify-between items-center px-4 py-2 text-xs">
                  <span className="font-mono text-[#3c663a]">{mod.name}</span>
                  <span className={`font-mono font-bold ${mod.ok ? "text-[#33ff66]" : "text-[#ff3333]"}`}>
                    {mod.ok ? "✓ COMPLETE" : "✖ OFFLINE"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1a2d1d] select-none">
            <button
              onClick={() => {
                synth.playClick();
                router.push("/core-vault/submit-key");
              }}
              className="w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono font-bold text-xs tracking-widest py-3.5 rounded-none transition-all duration-300 uppercase cursor-pointer"
            >
              RECOVER CORE VAULT
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}