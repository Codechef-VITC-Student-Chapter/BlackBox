"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";

const BOOT_LOGS = [
  "Initializing Network Topology Map...",
  "Probing Gateway 192.168.0.1...",
  "Tracing Route — HOP 01: 10.0.0.1 [12ms]",
  "Tracing Route — HOP 02: 172.16.4.3 [47ms]",
  "██████████ 83%",
  "WARNING: Packet Loss Detected — Node 7",
  "ANOMALY: Rogue Subnet Identified",
  ">> TARGET NODE ISOLATED"
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function NetworkLabyrinthPage() {
  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="NET_TRACE.EXE"
        terminalLabel="VT-320 NETWORK DIAGNOSTIC SUITE"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="network_trace.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        bootLogs={BOOT_LOGS}
        directiveTitle="CLASSIFIED DIRECTIVE // NET LABYRINTH"
        directiveText={
          <>
            The labyrinth has no walls — only paths that appear correct. Every node forwards what it receives. One of them does not.
            <br /><br />
            The anomaly leaves a signature. Not in the packet. In the silence between them.
            <br />
            <span className="text-[#33ff66] font-bold">Find the node that lies.</span>
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="TRACING"
        radarSublabel="PACKET MONITOR / 83MHz BUS"
        bottomBarText="CAUTION: NETWORK ISOLATION ACTIVE"
        bottomBarSerial="#8409-NETLAB"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 relative z-10">
          <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-2 mb-2">
            // LABYRINTH NODES — SELECT ACTION
          </div>
          {[
            { id: "01", label: "NETWORK DASHBOARD", route: "/network-labyrinth/diagnostics", desc: "Trigger gateway probes" },
            { id: "02", label: "SYSTEM LOGS", route: "/network-labyrinth/logs", desc: "Inspect hex timestamp records" },
            { id: "03", label: "SUBMIT KEY", route: "/network-labyrinth/submit-key", desc: "Enter fragment combination" },
          ].map(stage => (
            <motion.a
              key={stage.id}
              href={stage.route}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-3 border border-[#1a3a16] bg-[#040e04] hover:border-[#33ff66]/50 hover:bg-[#061006] transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#264c23] text-[10px]">[{stage.id}]</span>
                <div>
                  <div className="text-[#33ff66] text-xs font-bold tracking-wider group-hover:drop-shadow-[0_0_4px_rgba(51,255,102,0.8)]">{stage.label}</div>
                  <div className="text-[#3c663a] text-[10px]">{stage.desc}</div>
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
