"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Terminal,
  CheckCircle2,
  Award,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useRouter } from "next/navigation";

export default function EngineerCertificationPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();
  const router = useRouter();

  useEffect(() => {
    const sequence = [
      "SYSTEM RESTORED",
      "",
      "Initializing Engineer Certification...",
      "Verifying Restored Subsystems...",
      "Authentication ........ VERIFIED",
      "Repository ............ VERIFIED",
      "Gateway ............... VERIFIED",
      "Puzzle ................. VERIFIED",
      "Core .................. VERIFIED",
      "",
      "Engineer Assessment Ready."
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        setTerminalLines((prev) => [...prev, sequence[i]]);
        playSound("typing");
        i++;
      } else {
        clearInterval(interval);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* LEFT */}

        <div className="flex-1 glass-panel flex flex-col overflow-hidden">

          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">

            <Terminal
              size={18}
              className="text-secondary-text"
            />

            <span className="font-mono text-sm tracking-widest text-secondary-text">
              ENGINEER_CERTIFICATION.EXE
            </span>

          </div>

          <div className="flex-1 p-6 space-y-3 font-mono text-sm">

            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${line === "SYSTEM RESTORED"
                    ? "text-primary text-lg font-bold"
                    : ""}
                  ${line?.includes("VERIFIED")
                    ? "text-primary"
                    : ""}
                  ${line === ""
                    ? "h-3"
                    : ""}
                `}
              >
                {line ? `> ${line}` : ""}
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2.5 h-4 bg-primary ml-2"
            />

          </div>

          <div className="border-t border-border bg-surface/30 p-6">

            <p className="font-mono text-secondary-text text-sm leading-7">

              Congratulations, Engineer.

              <br />
              <br />

              You restored every subsystem of BLACKBOX.

              <br />

              One final assessment remains before certification.

            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                router.push("/engineer-certification/coding")
              }
              className="mt-8 flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary/10 transition font-mono uppercase tracking-widest"
            >
              <Play size={16} />

              Begin Assessment
            </motion.button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
            Certification Status
          </h2>

          <StatusCard title="Authentication" />
          <StatusCard title="Repository" />
          <StatusCard title="Gateway" />
          <StatusCard title="Puzzle" />
          <StatusCard title="Core" />

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-panel p-5 border border-primary/30 bg-primary/5 mt-2"
          >
            <div className="flex items-center gap-3 mb-3">

              <Award
                size={20}
                className="text-primary"
              />

              <span className="font-mono text-sm text-text">
                Final Assessment
              </span>

            </div>

            <p className="text-secondary-text font-mono text-xs leading-6">

              Complete the programming challenge to earn your BLACKBOX Engineer Certification.

            </p>

          </motion.div>

        </div>

      </div>
    </PageTransition>
  );
}

function StatusCard({
  title,
}: {
  title: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-4 flex justify-between items-center border border-primary/30 bg-primary/5"
    >
      <div className="flex items-center gap-3">

        <CheckCircle2
          size={18}
          className="text-primary"
        />

        <span className="font-mono text-sm text-text">
          {title}
        </span>

      </div>

      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-mono">
        ONLINE
      </span>

    </motion.div>
  );
}