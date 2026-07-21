"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Activity, ScrollText } from "lucide-react";

// ─── Scan phases ────────────────────────────────────────────────────────────
const SCAN_LINES = [
  "Initializing network probe...",
  "Establishing packet capture...",
  "Routing diagnostic requests...",
  "Analyzing response signatures...",
  "Correlating traffic patterns...",
  "Diagnostics complete.",
];

export default function DiagnosticsPage() {
  const router = useRouter();
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [scanPct, setScanPct] = useState(0);

  // ── Fire the 6 background API calls so they appear in DevTools ────────────
  useEffect(() => {
    const endpoints = [
      "/api/network-labyrinth/status",
      "/api/network-labyrinth/network",
      "/api/network-labyrinth/services",
      "/api/network-labyrinth/health",
      "/api/network-labyrinth/internal",   // ← returns 403 with fragment in header
      "/api/network-labyrinth/recovery",
    ];

    // Stagger requests slightly so timestamps differ — participants
    // correlate these timings with Activity Logs on the next page.
    endpoints.forEach((url, i) => {
      setTimeout(() => {
        fetch(url).catch(() => {/* silent – 403 expected */});
      }, i * 420);
    });
  }, []);

  // ── Animate scan text & progress bar ─────────────────────────────────────
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setLineIndex(idx);
      setScanPct(Math.round((idx / (SCAN_LINES.length - 1)) * 100));
      if (idx >= SCAN_LINES.length - 1) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Diagnostics Running...
          </p>
          <h1 className="font-heading text-3xl font-bold text-text">
            NETWORK SCAN
          </h1>
        </motion.div>

        {/* Scan panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel w-full overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 border-b border-border bg-surface/40 px-5 py-3">
            <Activity size={16} className="text-primary" />
            <span className="font-mono text-xs tracking-widest text-secondary-text uppercase">
              Traffic Analysis
            </span>
            {!done && (
              <motion.span
                animate={{ opacity: [1, 0.3] }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}
                className="ml-auto font-mono text-[10px] text-warning tracking-widest"
              >
                SCANNING
              </motion.span>
            )}
            {done && (
              <span className="ml-auto font-mono text-[10px] text-success tracking-widest">
                COMPLETE
              </span>
            )}
          </div>

          {/* Scrolling scan log */}
          <div className="px-5 py-4 space-y-2 min-h-[160px]">
            {SCAN_LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 font-mono text-sm"
              >
                <span className="text-primary/50">&gt;</span>
                <span className={i === lineIndex && !done ? "text-primary" : "text-secondary-text"}>
                  {line}
                </span>
                {i === lineIndex && !done && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block w-1.5 h-3.5 bg-primary"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-4">
            <div className="flex justify-between font-mono text-[10px] text-secondary-text mb-1.5">
              <span>Progress</span>
              <span>{scanPct}%</span>
            </div>
            <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${scanPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Hint — shown only after scan completes */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="border-t border-border bg-warning/5 px-5 py-4"
              >
                <p className="font-mono text-xs text-warning/80 leading-6">
                  ⚠ &nbsp;Traffic analysis finished. Certain requests require closer inspection.
                  <br />
                  <span className="text-secondary-text">
                    The answers are in transit — not on the screen.
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons — only after scan */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <button
                onClick={() => router.push("/network-labyrinth/logs")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface/60 font-mono text-sm text-secondary-text hover:border-primary hover:text-text transition-all"
              >
                <ScrollText size={16} />
                OPEN ACTIVITY LOGS
              </button>
              <MagneticButton onClick={() => router.push("/network-labyrinth/submit-key")}>
                SUBMIT RECOVERY KEY
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
