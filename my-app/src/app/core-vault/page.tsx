"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Terminal,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useRouter } from "next/navigation";

export default function CoreVaultPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();
  const router = useRouter();

  useEffect(() => {
    const sequence = [
      "Checking recovered subsystems...",
      "Loading recovery status...",
      "Security Clearance Verified",
      "██████████ 100%",
      "CORE STATUS : OFFLINE",
      "Recovery Required"
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];

        setTerminalLines((prev) => [...prev, line]);

        playSound("typing");

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

        {/* Left Terminal */}

        <div className="flex-1 glass-panel flex flex-col overflow-hidden">

          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal
              size={18}
              className="text-secondary-text"
            />

            <span className="font-mono text-sm tracking-wider text-secondary-text">
              CORE_RECOVERY.EXE
            </span>
          </div>

          <div className="flex-1 p-6 space-y-3 font-mono text-sm">

            {terminalLines.map((line, idx) => (

              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${
                  line.includes("OFFLINE")
                    ? "text-danger"
                    : "text-primary"
                }`}
              >
                {`> ${line}`}
              </motion.div>

            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block ml-2 w-2.5 h-4 bg-primary"
            />

          </div>

          <div className="border-t border-border bg-surface/30 p-6">

            <div className="font-mono text-sm space-y-2">

              <p className="text-secondary-text">
                Recovered Modules
              </p>

              <div className="space-y-1 text-text">

                <p>✓ Authentication</p>

                <p>✓ Repository</p>

                <p>✓ Gateway</p>

                <p>✓ CodeChef Puzzle</p>

                <p className="text-danger">
                  ✖ Core
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                router.push("/core-vault/submit-key")
              }
              className="mt-8 w-full border border-primary text-primary font-mono py-3 hover:bg-primary hover:text-background transition-all duration-300"
            >
              Recover Core
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">

            System Status

          </h2>

          <StatusCard
            title="Authentication"
            status="ONLINE"
            success
          />

          <StatusCard
            title="Repository"
            status="ONLINE"
            success
          />

          <StatusCard
            title="Gateway"
            status="ONLINE"
            success
          />

          <StatusCard
            title="Puzzle"
            status="COMPLETE"
            success
          />

          <StatusCard
            title="Core"
            status="LOCKED"
          />

        </div>

      </div>
    </PageTransition>
  );
}

function StatusCard({
  title,
  status,
  success = false,
}: {
  title: string;
  status: string;
  success?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex justify-between items-center border ${
        success
          ? "border-primary/30 bg-primary/5"
          : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">

        {success ? (
          <CheckCircle2
            size={18}
            className="text-primary"
          />
        ) : (
          <Lock
            size={18}
            className="text-secondary-text"
          />
        )}

        <span className="font-mono text-sm text-text">
          {title}
        </span>

      </div>

      <span
        className={`font-mono text-xs px-2 py-1 rounded ${
          success
            ? "bg-primary/20 text-primary"
            : "bg-surface text-secondary-text"
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
}