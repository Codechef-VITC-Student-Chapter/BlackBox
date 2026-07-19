"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { Shield, GitBranch, Wifi, Database, Cpu } from "lucide-react";

const SUBSYSTEMS = [
  { label: "Authentication", icon: Shield,    delay: 0.4 },
  { label: "Repository",     icon: GitBranch, delay: 0.8 },
  { label: "Gateway",        icon: Wifi,      delay: 1.3 },
  { label: "Memory",         icon: Database,  delay: null },  // not restored yet
  { label: "Core",           icon: Cpu,       delay: null },  // not restored yet
];

const BOOT_LINES = [
  "Scanning Connected Services...",
  "Gateway Responding...",
  "Production APIs Detected...",
  "Launching Network Diagnostics...",
];

export default function GatewayRestoredPage() {
  const router = useRouter();
  const [restored, setRestored] = useState<boolean[]>([false, false, false, false, false]);
  const [bootLine, setBootLine] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  // Animate subsystems checking off one by one
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    SUBSYSTEMS.forEach((sys, i) => {
      if (sys.delay !== null) {
        timers.push(
          setTimeout(() => {
            setRestored((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, sys.delay * 1000)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Boot lines + redirect
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setBootLine(idx);
      if (idx >= BOOT_LINES.length) {
        clearInterval(interval);
        setRedirecting(true);
        setTimeout(() => router.push("/memory-reconstruction"), 1400);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-success">
            Recovery Complete
          </p>
          <h1 className="font-heading text-3xl font-bold text-text">
            GATEWAY RESTORED
          </h1>
        </motion.div>

        {/* Status panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel w-full overflow-hidden border border-success/20"
        >
          {/* Subsystem checklist */}
          <div className="divide-y divide-border">
            {SUBSYSTEMS.map((sys, i) => {
              const Icon = sys.icon;
              const isRestored = restored[i];
              const isPending = sys.delay !== null && !isRestored;
              const isOffline = sys.delay === null;
              return (
                <motion.div
                  key={sys.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} className="text-secondary-text shrink-0" />
                    <span className="font-mono text-sm text-secondary-text">{sys.label}</span>
                  </div>
                  <div className="font-mono text-sm font-semibold tracking-widest">
                    {isRestored ? (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-success"
                      >
                        ✓
                      </motion.span>
                    ) : isPending ? (
                      <motion.span
                        animate={{ opacity: [1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        className="text-warning"
                      >
                        ···
                      </motion.span>
                    ) : (
                      <span className="text-secondary-text/40">✗</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Boot log / redirect message */}
          <div className="bg-black/40 px-5 py-4 font-mono text-sm space-y-2 min-h-[100px]">
            {BOOT_LINES.slice(0, bootLine).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-primary/50">&gt;</span>
                <span className={i === bootLine - 1 ? "text-primary" : "text-secondary-text"}>
                  {line}
                </span>
              </motion.div>
            ))}
            {redirecting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-success"
              >
                <span>&gt;</span>
                <span>Routing to Memory Reconstruction...</span>
              </motion.div>
            )}
            {!redirecting && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-3.5 bg-primary/70"
              />
            )}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}
