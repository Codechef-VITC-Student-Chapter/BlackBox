"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Wifi, Shield, GitBranch, Database, Cpu, Activity } from "lucide-react";

const SUBSYSTEMS = [
  { label: "Authentication", status: "VERIFIED", icon: Shield, color: "text-success", dot: "bg-success" },
  { label: "Repository",     status: "RESTORED", icon: GitBranch, color: "text-success", dot: "bg-success" },
  { label: "Gateway",        status: "DEGRADED", icon: Wifi,     color: "text-warning",  dot: "bg-warning", pulse: true },
  { label: "Memory",         status: "OFFLINE",  icon: Database, color: "text-danger",   dot: "bg-danger" },
  { label: "Core",           status: "OFFLINE",  icon: Cpu,      color: "text-danger",   dot: "bg-danger" },
];

const METRICS = [
  { label: "Packet Loss",      value: "17%",  bad: true },
  { label: "Response Time",    value: "HIGH", bad: true },
  { label: "Active Services",  value: "6",    bad: false },
];

export default function NetworkLabyrinthPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Module 03 · Network Labyrinth
          </p>
          <h1 className="font-heading text-3xl font-bold text-text">
            NETWORK OPERATIONS CENTER
          </h1>
        </motion.div>

        {/* Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel w-full overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 border-b border-border bg-surface/40 px-5 py-3">
            <Activity size={16} className="text-primary" />
            <span className="font-mono text-xs tracking-widest text-secondary-text uppercase">
              Subsystem Status
            </span>
          </div>

          {/* Subsystems */}
          <div className="divide-y divide-border">
            {SUBSYSTEMS.map((sys, i) => {
              const Icon = sys.icon;
              return (
                <motion.div
                  key={sys.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} className="text-secondary-text shrink-0" />
                    <span className="font-mono text-sm text-secondary-text">
                      {sys.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sys.pulse ? (
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sys.dot} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${sys.dot}`} />
                      </span>
                    ) : (
                      <span className={`inline-flex rounded-full h-2 w-2 ${sys.dot}`} />
                    )}
                    <span className={`font-mono text-xs font-semibold tracking-widest ${sys.color}`}>
                      {sys.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Metrics */}
          <div className="grid grid-cols-3 divide-x divide-border">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 + i * 0.06 }}
                className="px-4 py-4 text-center"
              >
                <p className={`font-mono text-lg font-bold ${m.bad ? "text-warning" : "text-primary"}`}>
                  {m.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-secondary-text mt-1">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <MagneticButton onClick={() => router.push("/network-labyrinth/diagnostics")}>
            RUN DIAGNOSTICS
          </MagneticButton>
        </motion.div>

        {/* Blinking cursor line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="font-mono text-xs text-secondary-text/50 flex items-center gap-2"
        >
          <span>&gt;</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="inline-block w-2 h-3.5 bg-primary/60"
          />
        </motion.div>

      </div>
    </PageTransition>
  );
}
