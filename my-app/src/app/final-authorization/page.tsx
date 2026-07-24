"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import Image from "next/image";

const BOOT_LOGS = [
  "BLACKBOX",
  "",
  "WHERE IT ALL STARTED",
  "",
  "Thanks to our Design Team...",
  "",
  "Everything began there.",
  "",
  "Some details were never part",
  "of the system."
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "COMPLETE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
  { title: "Final Authorization", status: "ACTIVE", modId: "MOD-07", serial: "SN:84-F7", iconType: "final" },
];

export default function FinalAuthorizationPage() {
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
        exeName="FINAL_AUTH.EXE"
        terminalLabel="CONTROL PANEL"
        maintenanceSeal="#4097"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="gateway_auth_handshake.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-07"
        directiveTitle="CLASSIFIED DIRECTIVE // GATEWAY LOCK"
        directiveText={
          <>
            Gateway lock requires final double-signature verification.
            <br />
            Ensure you possess the recovery key and engineer access tokens.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="WAITING"
        radarSublabel="AUTHENTICATION HANDSHAKE"
        bottomBarText="CAUTION: GATEWAY AUTHORIZATION REQUIRED"
        bottomBarSerial="#8409-FINAL"
        wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
        compactStatus={true}
      >
      <div className="h-full min-h-0 overflow-y-auto pr-2">

        {/* Terminal output */}
        {/* Terminal output */}
        <div className="mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">          {terminalLines.map((line, idx) => (
          <p
            key={idx}
            className={`text-xs ${line === "BLACKBOX" ? "text-[#33ff66] font-bold text-sm" :
                line === "WHERE IT ALL STARTED" ? "text-white font-bold" :
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

        {/* Narrative & Kalashnikov image & action button */}
          <div className="overflow-hidden border border-[#1a2d1d] bg-[#030703]">
            <Image
              src="/images/kalashnikov.png"
              alt="Design Team Archive"
              width={1200}
              height={700}
              className="w-full h-auto opacity-90 border-none"
            />
          </div>

          <div className="pt-2 select-none">
            <button
              onClick={() => {
                synth.playClick();
                router.push("/final-authorization/authorization");
              }}
              className="w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono font-bold text-xs tracking-widest py-3.5 rounded-none transition-all duration-300 uppercase cursor-pointer"
            >
              ENTER GATEWAY AUTHORIZATION
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}