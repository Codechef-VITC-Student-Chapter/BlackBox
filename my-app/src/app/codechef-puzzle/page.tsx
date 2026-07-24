"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import PuzzleBoard from "./puzzle-board/PuzzleBoard";

const BOOT_LOGS = [
  "Loading Visual Subsystem...",
  "Mounting Puzzle Matrix 5x5...",
  "Rendering Tile Fragment [01/25]...",
  "Rendering Tile Fragment [13/25]...",
  "Rendering Tile Fragment [25/25]...",
  "██████████ 100%",
  "WARNING: Fragment Checksum Mismatch",
  ">> PUZZLE BOARD READY — AWAITING ASSEMBLY"
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "ACTIVE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function CodeChefPuzzleLanding() {
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-04"
        exeName="PUZZLE_MATRIX.EXE"
        terminalLabel="VT-420 VISUAL SUBSYSTEM"
        maintenanceSeal="#4094"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="visual_subsystem.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-04"
        bootLogs={BOOT_LOGS}
        directiveTitle="CLASSIFIED DIRECTIVE // RECONSTRUCTION"
        directiveText={
          <>
            The visual matrix requires correct tile sorting to resolve checksum hashes.
            <br />
            Select adjacent tiles to swap them into position.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="ASSEMBLING"
        radarSublabel="LOGIC MATRIX / 5x5 IMAGE"
        bottomBarText="CAUTION: CORRUPTED VECTOR INDEXES DETECTED"
        bottomBarSerial="#8409-PUZZLE"
        wallStencil="CONTROL ROOM 04 // VISUAL SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between items-center relative z-10">
          <div className="w-full text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-3 font-bold select-none">
            // VISUAL RECONSTRUCTION BOARD ... 5x5 TILE MATRIX
          </div>
          
          <PuzzleBoard />
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}