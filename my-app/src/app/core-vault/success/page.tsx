"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const BOOT_LOGS = [
  "Validating Master Recovery Key...",
  "Recovery Sequence Verified.",
  "Recovering BLACKBOX Core...",
  "████████████████████ 100%",
  "",
  "SYSTEM RESTORED",
  "",
  "Congratulations.",
  "You recovered BLACKBOX.",
  "You investigated.",
  "You observed.",
  "You connected every clue.",
  "",
  "The system finally trusts you."
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function CoreSuccessPage() {
  const router = useRouter();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        const line = BOOT_LOGS[i];
        setTerminalLines((prev) => [...prev, line]);
        synth.playClick();
        if (line.includes("SYSTEM RESTORED")) {
          synth.playSuccessFanfare();
        }
        i++;
      } else {
        clearInterval(interval);
        setRedirecting(true);
        setTimeout(() => {
          router.push("/final-authorization");
        }, 3500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-05"
        exeName="CORE_RECOVERY.EXE"
        terminalLabel="MODULE 5 CLEARED"
        maintenanceSeal="#4095"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="core_restore.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-05"
        directiveTitle="CLASSIFIED DIRECTIVE // PHASE COMPLETE"
        directiveText={
          <>
            Core vault integrity fully restored.
            <br />
            Congratulations operator. Redirecting to final module...
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="RECONSTRUCTED"
        radarSublabel="CORE VAULT ACTIVE"
        bottomBarText="CORE VAULT DECOMMISSIONED"
        bottomBarSerial="#8409-CORE-OK"
        wallStencil="CONTROL ROOM 04 // CORE SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
          <div className="space-y-3 font-mono text-xs">
            {terminalLines.map((line, index) => (
              <p
                key={index}
                className={`text-xs ${
                  line.includes("SYSTEM RESTORED") ? "text-[#33ff66] font-bold text-sm drop-shadow-[0_0_8px_#33ff66]" :
                  line.includes("Congratulations") ? "text-[#33ff66] font-bold" :
                  line === "" ? "h-2" : "text-[#3c663a]"
                }`}
              >
                {line !== "" && `> ${line}`}
              </p>
            ))}
            {terminalLines.length < BOOT_LOGS.length && (
              <span className="inline-block w-1.5 h-3 bg-[#33ff66]/70 ml-1 animate-pulse" />
            )}
            {redirecting && (
              <p className="text-[#33ff66] font-bold animate-pulse mt-2">
                &gt; Redirection initialized. Loading Final Authorization...
              </p>
            )}
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}