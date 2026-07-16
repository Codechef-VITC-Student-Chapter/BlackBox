"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, CheckCircle2, Puzzle, AlertTriangle } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

export default function PuzzleIntroPage() {
  const router = useRouter();
  const { playSound } = useAudio();

  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "Synchronizing Visual Assets...",
      "Loading Branding Resources...",
      "Scanning Asset Integrity...",
      "████████████ 100%",
      "ERROR : CodeChef Logo Corrupted",
      "Manual Reconstruction Required"
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];

        setTerminalLines((prev) => [...prev, line]);

        playSound("typing");

        if (line.includes("ERROR")) {
          playSound("error");
        }

        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* Terminal */}

        <div className="flex-1 glass-panel overflow-hidden">

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />

            <span className="font-mono text-sm tracking-widest text-secondary-text uppercase">
              LOGO_RECONSTRUCTION.EXE
            </span>
          </div>

          <div className="p-6 space-y-3 font-mono text-sm min-h-[420px]">

            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${line.includes("ERROR") ? "text-danger" : ""}
                  ${line.includes("Required") ? "text-primary" : ""}
                `}
              >
                {"> "}{line}
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary"
            />

          </div>

          <div className="border-t border-border bg-surface/20 p-6">

            <p className="font-mono text-sm text-secondary-text leading-7">
              The visual identity of BLACKBOX has been corrupted.
              <br />
              Restore the missing logo fragments to continue
              system recovery.
            </p>

          </div>

        </div>

        {/* Right Panel */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg tracking-widest uppercase text-secondary-text">
            System Status
          </h2>

          <StatusCard
            title="Authentication"
            status="RESTORED"
            success
            icon={<CheckCircle2 size={18} />}
          />

          <StatusCard
            title="Repository"
            status="RESTORED"
            success
            icon={<CheckCircle2 size={18} />}
          />

          <StatusCard
            title="Network"
            status="RESTORED"
            success
            icon={<CheckCircle2 size={18} />}
          />

          <StatusCard
            title="Logo Assets"
            status="CORRUPTED"
            icon={<AlertTriangle size={18} />}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/codechef-puzzle/puzzle-board")}
            className="glass-panel mt-4 p-4 flex items-center justify-center gap-3 border border-primary hover:bg-primary/10 transition"
          >
            <Puzzle size={18} />

            <span className="font-mono uppercase tracking-widest">
              Begin Reconstruction
            </span>

          </motion.button>

        </div>

      </div>
    </PageTransition>
  );
}

function StatusCard({
  title,
  status,
  success,
  icon,
}: {
  title: string;
  status: string;
  success?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex items-center justify-between border ${
        success
          ? "border-primary/20"
          : "border-danger/30 bg-danger/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={success ? "text-primary" : "text-danger"}>
          {icon}
        </div>

        <span className="font-mono text-sm">
          {title}
        </span>
      </div>

      <span
        className={`font-mono text-xs px-2 py-1 rounded ${
          success
            ? "bg-primary/10 text-primary"
            : "bg-danger/20 text-danger"
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
}