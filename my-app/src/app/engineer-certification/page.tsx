"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const BOOT_LOGS = [
  "SYSTEM RESTORED",
  "",
  "Initializing Engineer Certification...",
  "Verifying Restored Subsystems...",
  "Authentication ........ VERIFIED",
  "Repository ............ VERIFIED",
  "Gateway ............... VERIFIED",
  "Puzzle ................. VERIFIED",
  "Core .................. VERIFIED",
  "",
  "Engineer Assessment Ready."
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

export default function EngineerCertificationPage() {
  const router = useRouter();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

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

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-07"
        exeName="ENG_CERT.EXE"
        terminalLabel="VT-100 ENGINEER ASSESSMENT SUITE"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="certification_verify.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // CHALLENGE"
        directiveText={
          <>
            The certification challenge verifies your low-level programming capability.
            <br />
            You will be presented with a custom sandbox to edit and execute code.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="EVALUATING"
        radarSublabel="ENGINEER ASSESSMENT"
        bottomBarText="CAUTION: ENGINEER ASSESSMENT ACTIVE"
        bottomBarSerial="#8409-CERT"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        {/* Terminal output */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {terminalLines.map((line, index) => (
            <p
              key={index}
              className={`text-xs ${
                line === "SYSTEM RESTORED" ? "text-[#33ff66] font-bold text-sm" :
                line?.includes("VERIFIED") ? "text-[#33ff66]" :
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

        {/* Narrative & action button */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4 font-mono text-xs leading-relaxed text-[#3c663a]">
            <p>
              Congratulations, Engineer.
            </p>
            <p>
              You restored every subsystem of BLACKBOX. One final assessment remains before certification.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1a2d1d] select-none">
            <button
              onClick={() => {
                synth.playClick();
                router.push("/engineer-certification/coding");
              }}
              className="w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono font-bold text-xs tracking-widest py-3.5 rounded-none transition-all duration-300 uppercase cursor-pointer"
            >
              BEGIN ASSESSMENT
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
