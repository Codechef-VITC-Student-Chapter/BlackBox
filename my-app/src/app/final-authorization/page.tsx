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
import Image from "next/image";

export default function FinalAuthorizationPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const { playSound } = useAudio();

  useEffect(() => {
    const sequence = [
      "BLACKBOX",
      "",
      "WHERE IT ALL STARTED",
      "",
      "Thanks to our Design Team...",
      "",
      "Everything began there.",
      "",
      "Some details were never part",
      "of the system.",
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
    }, 700);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* LEFT TERMINAL */}

        <div className="flex-1 glass-panel flex flex-col overflow-hidden">

          {/* Header */}

          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal
              size={18}
              className="text-secondary-text"
            />

            <span className="font-mono text-sm tracking-wider text-secondary-text">
              FINAL_AUTHORIZATION.EXE
            </span>
          </div>

          {/* Terminal */}

          <div className="flex-1 p-8 font-mono text-sm space-y-3">

            {terminalLines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                  ${
                    line === "BLACKBOX"
                      ? "text-primary text-3xl font-bold tracking-widest"
                      : ""
                  }

                  ${
                    line === "WHERE IT ALL STARTED"
                      ? "text-white text-xl font-bold tracking-wide"
                      : ""
                  }

                  ${
                    line?.includes("Design Team")
                      ? "text-primary"
                      : ""
                  }

                  ${
                    line === "Everything began there."
                      ? "text-text"
                      : ""
                  }

                  ${
                    line === "Some details were never part" ||
                    line === "of the system."
                      ? "text-secondary-text"
                      : ""
                  }

                  ${
                    line === ""
                      ? "h-4"
                      : ""
                  }
                `}
              >
                {line}
              </motion.div>
            ))}

            {/* Blinking Cursor */}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
              }}
              className="inline-block w-2.5 h-5 bg-primary mt-2"
            />

          </div>

          {/* Footer */}

          <div className="border-t border-border bg-surface/30 p-6">

            <p className="font-mono text-2xl font-bold text-primary mb-5">
              /
            </p>

            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/kalashnikov.png"
                alt="Design Team Archive"
                width={1200}
                height={700}
                className="w-full object-cover"
              />
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
            Authorization Status
          </h2>

          <StatusCard
            title="Authentication"
            status="VERIFIED"
            success
          />

          <StatusCard
            title="Repository"
            status="VERIFIED"
            success
          />

          <StatusCard
            title="Gateway"
            status="VERIFIED"
            success
          />

          <StatusCard
            title="Memory"
            status="VERIFIED"
            success
          />

          <StatusCard
            title="Core"
            status="RESTORED"
            success
          />

          <StatusCard
            title="Final Authorization"
            status="PENDING"
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
      className={`glass-panel p-4 flex items-center justify-between border ${
        success
          ? "border-primary/30 bg-primary/5"
          : "border-danger/30 bg-danger/5"
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
            className="text-danger"
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
            : "bg-danger/20 text-danger"
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
}