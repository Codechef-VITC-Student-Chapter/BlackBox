"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { ArrowLeft } from "lucide-react";

const RAW_LOGS = [
  { ts: "0x274A", event: "NODE_TIMEOUT",    node: "gateway-01",  col: "text-[#ff3333]/80" },
  { ts: "0x274A", event: "RETRY_SEQUENCE",  node: "initiated",   col: "text-[#f59e0b]/70" },
  { ts: "0x274B", event: "SESSION_RESTORE", node: "success",     col: "text-[#33ff66]/80" },
  { ts: "0x274B", event: "PACKET_VOID",     node: "detected",    col: "text-[#ff3333]/80" },
  { ts: "0x274C", event: "NODE_ONLINE",     node: "gateway-01",  col: "text-[#33ff66]/80" },
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function ActivityLogsPage() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const commentRef = useRef<Comment | null>(null);

  // Inject a real HTML comment into the DOM — visible in DevTools Inspector
  useEffect(() => {
    const comment = document.createComment(
      " [M3-LOG-HINT] Timestamps are session-relative offsets. Cross-reference with outbound request sequence. "
    );
    document.body.appendChild(comment);
    commentRef.current = comment;
    return () => {
      try { document.body.removeChild(comment); } catch {}
    };
  }, []);

  // Stream log entries one by one
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      idx++;
      setVisibleCount(idx);
      if (idx >= RAW_LOGS.length) {
        clearInterval(t);
        setTimeout(() => setShowHint(true), 800);
      }
    }, 550);
    return () => clearInterval(t);
  }, []);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="SYS_LOGS.EXE"
        terminalLabel="HEX TIMESTAMP AUDIT TRAIL"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="session_log.out"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        directiveTitle="CLASSIFIED DIRECTIVE // NETWORK AUDITING"
        directiveText={
          <>
            Logs capture all recent gateway connections and failures.
            <br />
            Cross-reference log timing with standard diagnostic requests.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="AUDITING"
        radarSublabel="LOG AUDIT TRAIL"
        bottomBarText="CAUTION: LOG ACCESS TIMESTAMPED"
        bottomBarSerial="#8409-LOGS"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Column headers */}
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-[#264c23] border-b border-[#1a2d1d] pb-2 mb-2 font-bold select-none">
              <span className="w-16">Offset</span>
              <span className="w-40">Event</span>
              <span>Node</span>
            </div>

            <div className="space-y-1.5">
              {RAW_LOGS.slice(0, visibleCount).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-6 items-baseline font-mono text-xs text-[#3c663a] border-b border-[#112211] py-1.5 px-2 hover:bg-[#040e04] hover:text-[#33ff66] transition-all duration-150 cursor-default"
                >
                  <span className="w-16 text-[#f59e0b] shrink-0">{log.ts}</span>
                  <span className={`w-40 shrink-0 font-bold ${log.col}`}>
                    {log.event}
                  </span>
                  <span className="text-[10px] opacity-75">→ {log.node}</span>
                </motion.div>
              ))}
            </div>

            {visibleCount < RAW_LOGS.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-1.5 h-3.5 bg-[#33ff66]/70 ml-2"
              />
            )}
          </div>

          {/* Hint strip */}
          <div className="space-y-4 pt-3 border-t border-[#1a2d1d]">
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-[#0a0600] border border-[#4d330c]/30 text-[#d97706] text-[10px] font-mono p-3 leading-relaxed"
                >
                  <span className="text-[#f59e0b] font-bold block uppercase tracking-wider mb-1">// ANOMALY DETECTED</span>
                  Something doesn&apos;t add up. Compare these hex offset timestamps with outbound request sequences from diagnostics.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center select-none">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 border border-[#1a2d1d] hover:border-[#33ff66] text-[#3c663a] hover:text-[#33ff66] bg-transparent font-mono text-xs font-bold py-2 px-4 transition-colors duration-250 cursor-pointer"
              >
                <ArrowLeft size={13} />
                BACK
              </button>
            </div>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
