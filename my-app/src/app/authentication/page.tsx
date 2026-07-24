"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";

const BOOT_LOGS = [
  "Connecting to Core Auth Server...",
  "Bypassing Subnet Firewall...",
  "Searching Engineer Identity...",
  "██████████ 100%",
  "ERROR: Unknown Engineer Identity",
  "CONNECTION FAILED"
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "FAILED", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "LOCKED", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function AuthenticationModule() {
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-01"
        exeName="AUTH_RECOVERY.EXE"
        terminalLabel="VT-100 RECOVERY TERMINAL"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="AUTH_RECOVERY.EXE"
        baudRate="1200 BAUD"
        ttyNumber="TTY-01"
        bootLogs={BOOT_LOGS}
        directiveTitle="CLASSIFIED DIRECTIVE // ENGINEER LOG"
        directiveText={
          <>
            The machine remembers every visitor. Those who know where memories are kept will find a signed trace. Most will read it. The Engineer expected you to do something else.
            <br /><br />
            Everything you need is already here.
            <br />
            <span className="text-[#33ff66] font-bold">Look closer.</span>
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SCANNING"
        radarSublabel="VECTOR DIAGNOSTIC"
        bottomBarText="CAUTION: MANUAL OVERRIDE DISABLED"
        bottomBarSerial="#8409-BUNKER"
        wallStencil="CONTROL ROOM 04 // AUTH SECTOR"
      >
        <div className="flex-1 bg-[#030703] flex items-center justify-center pointer-events-none relative select-none">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#33ff66]/10 text-center font-bold">
            AWAITING ENGINEER IDENTITY
          </span>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
