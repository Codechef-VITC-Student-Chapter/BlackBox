"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, CheckCircle2, KeyRound } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

export default function PuzzleSuccessPage() {
  const router = useRouter();
  const { playSound } = useAudio();

  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // Temporary key (Backend will generate unique one later)
  const recoveryKey = "BX74-A91X";

  useEffect(() => {
    const sequence = [
      "Verifying Logo Integrity...",
      "██████████████████ 100%",
      "Visual Assets Restored",
      "Generating Core Recovery Fragment...",
      "Recovery Fragment Created",
      "Preparing Core Recovery..."
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];

        setTerminalLines((prev) => [...prev, line]);

        playSound("typing");

        if (line.includes("Restored")) {
          playSound("success");
        }

        i++;
      } else {
        clearInterval(interval);

        // Auto Redirect after few seconds
        setTimeout(() => {
          router.push("/core-vault");
        }, 6000);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [playSound, router]);

  return (
    <PageTransition>
      <div className="flex justify-center">

        <div className="glass-panel w-full max-w-5xl overflow-hidden">

          {/* Header */}

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />

            <span className="font-mono text-sm tracking-widest uppercase text-secondary-text">
              LOGO_RECONSTRUCTION_COMPLETE.LOG
            </span>
          </div>

          {/* Terminal */}

          <div className="p-8 font-mono space-y-3 min-h-[280px]">

            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${line.includes("Restored") ? "text-primary" : ""}
                  ${line.includes("Fragment") ? "text-secondary-text" : ""}
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

          {/* Recovery Key */}

          <div className="border-t border-border bg-surface/20 p-8">

            <div className="glass-panel border border-primary/30 p-8 text-center">

              <CheckCircle2
                size={55}
                className="mx-auto text-primary mb-5"
              />

              <h2 className="font-heading text-2xl uppercase tracking-widest text-primary mb-6">
                Logo Successfully Restored
              </h2>

              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-6 py-4">

                <KeyRound size={22} className="text-primary" />

                <span className="font-mono text-2xl tracking-[0.25em] text-primary">
                  {recoveryKey}
                </span>

              </div>



            </div>

          </div>

          {/* Footer */}

          <div className="border-t border-border bg-surface/30 p-6 flex items-center justify-between">

            <p className="font-mono text-secondary-text text-sm">
              Every subsystem leaves behind a trace.

              <br />
              Whether you ignore it...
              <br/>
              is your decision.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/core-vault")}
              className="px-6 py-3 bg-primary text-black font-bold rounded-lg flex items-center gap-2"
            >
              Proceed to Core Vault →
            </motion.button>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}