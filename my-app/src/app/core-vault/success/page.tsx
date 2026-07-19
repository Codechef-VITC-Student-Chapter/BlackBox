"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useRouter } from "next/navigation";

export default function CoreSuccessPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();
  const router = useRouter();

  useEffect(() => {
    const sequence = [
      "Validating Master Recovery Key...",
      "Recovery Sequence Verified.",
      "Recovering BLACKBOX Core...",
      "████████████████████ 100%",
      "",
      "SYSTEM RESTORED",
      "",
      "Congratulations.",
      "You recovered BLACKBOX.",
      "You investigated.",
      "You observed.",
      "You connected every clue.",
      "",
      "The system finally trusts you.",

    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        setTerminalLines((prev) => [...prev, sequence[i]]);
        playSound("typing");
        i++;
      } else {
        clearInterval(interval);

        setTimeout(() => {
          router.push("/final-authorization");
        }, 3500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [playSound, router]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* Left Terminal */}

        <div className="flex-1 glass-panel flex flex-col overflow-hidden">

          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />

            <span className="font-mono text-sm tracking-wider text-secondary-text">
              BLACKBOX_RECOVERY.EXE
            </span>
          </div>

          <div className="flex-1 p-6 space-y-3 font-mono text-sm">

            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${line?.includes("SYSTEM RESTORED") ? "text-primary font-bold text-lg" : ""}
                  ${line?.includes("Congratulations") ? "text-primary" : ""}
                  ${line?.includes("Launching") ? "text-secondary-text" : ""}
                  ${line === "" ? "h-3" : ""}
                `}
              >
                {line !== "" && `> ${line}`}
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block ml-2 w-2.5 h-4 bg-primary"
            />

          </div>

        </div>

        {/* Right Status */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
            System Status
          </h2>

          <StatusCard title="Authentication" />
          <StatusCard title="Repository" />
          <StatusCard title="Gateway" />
          <StatusCard title="Puzzle" />
          <StatusCard title="Core" />

        </div>

      </div>
    </PageTransition>
  );
}

function StatusCard({ title }: { title: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-4 flex justify-between items-center border border-primary/30 bg-primary/5"
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 size={18} className="text-primary" />

        <span className="font-mono text-sm text-text">
          {title}
        </span>
      </div>

      <span className="font-mono text-xs px-2 py-1 rounded bg-primary/20 text-primary">
        ONLINE
      </span>
    </motion.div>
  );
}