"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";

const BOOT_LOGS = [
  "Initializing File Recovery Daemon...",
  "Mounting Lost Partition Table...",
  "Scanning Sectors 0x00 to 0xFF...",
  "██████████ 67%",
  "WARNING: Corrupted Inode Detected",
  "ORPHANED FILE CLUSTER FOUND",
  ">> RECOVERY TARGET IDENTIFIED"
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "ACTIVE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function RepositoryRecoveryLanding() {
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="FILE_RECOVERY.EXE"
        terminalLabel="VT-220 FILE RECOVERY DAEMON"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="boot_diagnostics.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        bootLogs={BOOT_LOGS}
        directiveTitle="CLASSIFIED DIRECTIVE // RECOVERY LOG"
        directiveText={
          <>
            The Engineer was meticulous. Every file deleted leaves a shadow — a ghost in the commit log, a whisper in the object store. Machines forget nothing. They only stop being asked.
            <br /><br />
            Find what was removed. Read what remains.
            <br />
            <span className="text-[#33ff66] font-bold">The answer was never gone.</span>
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="RECOVERY"
        radarSublabel="SECTOR SCAN / DAEMON"
        bottomBarText="CAUTION: FILE SYSTEM READ-ONLY MODE"
        bottomBarSerial="#8409-RECOVERY"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 relative z-10">
          <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-2 mb-2">
            // RECOVERY SEQUENCE — SELECT ENTRY NODE TO PROCEED
          </div>
          {[
            { id: "01", label: "START SENSOR SCAN (QR)", route: "/repository-recovery/scan", desc: "Begin optical sensor calibration & forensic scan sequence" },
            { id: "02", label: "KEY VERIFY PORTAL", route: "/repository-recovery/verify", desc: "Submit final repository recovery signature key" },
          ].map(stage => (
            <motion.a
              key={stage.id}
              href={stage.route}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 border border-[#1a3a16] bg-[#040e04] hover:border-[#33ff66]/50 hover:bg-[#061006] transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#264c23] text-[10px]">[{stage.id}]</span>
                <div>
                  <div className="text-[#33ff66] text-xs font-bold tracking-wider group-hover:drop-shadow-[0_0_4px_rgba(51,255,102,0.8)]">{stage.label}</div>
                  <div className="text-[#3c663a] text-[10px] mt-0.5">{stage.desc}</div>
                </div>
              </div>
              <span className="text-[#33ff66]/40 group-hover:text-[#33ff66] text-xs">&gt;&gt;</span>
            </motion.a>
          ))}
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
