"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const BOOT_LOGS = [
  "CORE_RECOVERY.EXE",
  "Loading...",
  "██████████ 100%",
  "SYSTEM REPORT",
  "Recovery Records Found.",
  "Integrity Check : FAILED",
  "",
  "You already solved it.",
  "You just don't know it yet.",
  "The Core accepts only those",
  "who remember."
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "ACTIVE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function CoreRecoveryPage() {
  const router = useRouter();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [masterKey, setMasterKey] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        setTerminalLines((prev) => [...prev, BOOT_LOGS[i]]);
        synth.playClick();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    synth.playClick();

    try {
      const response = await fetch("/api/core-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterKey }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        synth.playSuccess();
        router.push("/core-vault/success");
        return;
      }

      synth.playError();
      setTerminalLines((prev) => [
        ...prev,
        result.message ?? "CRITICAL MISALIGNMENT: Integrity Check Failed.",
      ]);
    } catch {
      synth.playError();
      setTerminalLines((prev) => [
        ...prev,
        "Server error processing request!",
      ]);
    }
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-05"
        exeName="CORE_RECOVERY.EXE"
        terminalLabel="MASTER RECOVERY SEQUENCE"
        maintenanceSeal="#4095"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="core_reconstruction.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-05"
        directiveTitle="CLASSIFIED DIRECTIVE // MASTER RECOVERY"
        directiveText={
          <>
            The master security recovery signature overrides low-level locks.
            <br />
            Enter the exact encrypted key token to authorize core reboot.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURING"
        radarSublabel="VAULT SECURITY GATE"
        bottomBarText="CAUTION: CORE ACCESS LEVEL 5 REQUIRED"
        bottomBarSerial="#8409-COREKEY"
        wallStencil="CONTROL ROOM 04 // CORE SECTOR"
      >
        {/* Terminal output */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {terminalLines.map((line, index) => (
            <p
              key={index}
              className={`text-xs ${
                line?.includes("FAILED") ? "text-[#ff3333] font-bold" :
                line === "SYSTEM REPORT" ? "text-[#33ff66] font-bold" :
                line === "" ? "h-2" : "text-[#3c663a]"
              }`}
            >
              {line !== "" && `> ${line}`}
            </p>
          ))}
          {terminalLines.length < BOOT_LOGS.length && (
            <span className="inline-block w-1.5 h-3 bg-[#33ff66]/70 ml-1 animate-pulse" />
          )}
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-2 font-bold select-none">
              {"// INPUT OVERRIDE CREDENTIALS"}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <label htmlFor="master-key-input" className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                  MASTER RECOVERY SIGNATURE KEY
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                  <input
                    id="master-key-input"
                    type="text"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="ENTER RECOVERY TOKEN..."
                    className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-lg outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase tracking-wider"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-3.5 hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 uppercase cursor-pointer text-xs"
              >
                SUBMIT MASTER KEY
              </button>
            </form>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
