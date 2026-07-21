"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, ArrowLeft } from "lucide-react";

// ─── Cryptic log entries ────────────────────────────────────────────────────
// Timestamps are hex-encoded real unix-style offsets (relative to "session start").
// Participants must correlate these with the DevTools request timings from Page 2.
// Each entry's actual meaning is intentionally obscured.
const RAW_LOGS = [
  { ts: "0x274A", event: "NODE_TIMEOUT",    node: "gateway-01",  col: "text-danger/80" },
  { ts: "0x274A", event: "RETRY_SEQUENCE",  node: "initiated",   col: "text-warning/70" },
  { ts: "0x274B", event: "SESSION_RESTORE", node: "success",     col: "text-success/80" },
  { ts: "0x274B", event: "PACKET_VOID",     node: "detected",    col: "text-danger/80" },
  { ts: "0x274C", event: "NODE_ONLINE",     node: "gateway-01",  col: "text-success/80" },
];

// Subtle hint comment injected into page source (visible via Inspect Element / View Source)
// <!-- [M3-LOG-HINT] Timestamps are session-relative. Cross-reference with outbound request sequence. -->

export default function ActivityLogsPage() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

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
      {/* Hidden HTML comment with puzzle hint — visible in DevTools / View Source */}
      {/* [M3-LOG-HINT] Timestamps are session-relative offsets. Cross-reference with outbound request sequence. */}

      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Network Labyrinth · Logs
          </p>
          <h1 className="font-heading text-3xl font-bold text-text">
            LIVE ACTIVITY LOGS
          </h1>
        </motion.div>

        {/* Log terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel w-full overflow-hidden"
        >
          {/* Terminal bar */}
          <div className="flex items-center gap-3 border-b border-border bg-black/60 px-5 py-3">
            <Terminal size={15} className="text-primary" />
            <span className="font-mono text-xs tracking-widest text-secondary-text uppercase">
              session_log.out
            </span>
            <motion.span
              animate={{ opacity: [1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.1 }}
              className="ml-auto w-2 h-2 rounded-full bg-success"
            />
          </div>

          {/* Log lines */}
          <div className="bg-black/40 px-5 py-5 space-y-3 min-h-[200px] font-mono text-sm">

            {/* Column headers */}
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-secondary-text/50 border-b border-border pb-2 mb-3">
              <span className="w-16">Offset</span>
              <span className="w-40">Event</span>
              <span>Node</span>
            </div>

            <AnimatePresence>
              {RAW_LOGS.slice(0, visibleCount).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-6 items-baseline"
                >
                  {/* Hex timestamp — looks like an offset, not a real time */}
                  <span className="w-16 text-accent/80 shrink-0">{log.ts}</span>
                  {/* Event name — all caps, opaque */}
                  <span className={`w-40 shrink-0 font-semibold ${log.col}`}>
                    {log.event}
                  </span>
                  {/* Node / detail */}
                  <span className="text-secondary-text/60 text-xs">→ {log.node}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming cursor */}
            {visibleCount < RAW_LOGS.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-2 h-4 bg-primary/70"
              />
            )}
          </div>

          {/* Hint strip — appears after all logs load */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.45 }}
                className="border-t border-border bg-surface/30 px-5 py-3"
              >
                <p className="font-mono text-[11px] text-secondary-text/70 leading-6">
                  <span className="text-primary/60">{"//"}</span>{" "}
                  Something doesn&apos;t add up.{" "}
                  <span className="text-warning/80">
                    Compare these entries with your network requests.
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-mono text-sm text-secondary-text hover:text-text transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
}
