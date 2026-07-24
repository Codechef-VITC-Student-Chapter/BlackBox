"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Terminal,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { PageTransition } from "@/components/ui/PageTransition";

export default function RecoveryCompletePage() {
  const router = useRouter();

  const modules = [
    "Authentication",
    "Repository",
    "Gateway",
    "CodeChef Puzzle",
    "Core",
    "Engineer Certification",
  ];

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-[80vh]">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full max-w-5xl overflow-hidden"
        >

          {/* Header */}

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm tracking-widest uppercase text-secondary-text">
              Recovery Complete
            </span>
          </div>

          {/* Body */}

          <div className="p-10 space-y-10">

            {/* Success */}

            <div className="text-center">

              <CheckCircle2
                size={72}
                className="mx-auto text-primary mb-5"
              />

              <h1 className="font-heading text-4xl uppercase tracking-widest text-primary">
                System Restored
              </h1>

              <p className="font-mono text-secondary-text mt-4">
                Every subsystem has been successfully recovered.
              </p>

            </div>

            {/* Progress */}

            <div className="glass-panel p-6">

              <h2 className="font-heading text-xl tracking-widest mb-6 text-primary uppercase">
                BLACKBOX Status
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {modules.map((module) => (
                  <div
                    key={module}
                    className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
                  >
                    <span className="font-mono text-text">
                      {module}
                    </span>

                    <span className="text-primary font-bold">
                      ✓
                    </span>
                  </div>
                ))}

              </div>

            </div>

            {/* Architect */}

            <div className="glass-panel p-6 font-mono text-sm leading-7 text-secondary-text">

              <p className="text-primary mb-4">
                &gt; Final Transmission
              </p>

              <p>Congratulations.</p>
              <p>You recovered BLACKBOX.</p>
              <br />
              <p>You investigated.</p>
              <p>You observed.</p>
              <p>You connected every clue.</p>
              <p>You restored every subsystem.</p>
              <br />
              <p className="text-text">
                The system finally trusts you.
              </p>

            </div>

            {/* Transition */}

            <div className="glass-panel p-6 font-mono text-sm">

              <p>&gt; Preparing Final Archive...</p>
              <p>&gt; Generating Engineer Identity...</p>
              <p>&gt; One final memory remains.</p>

            </div>

            {/* Button */}

            <div className="flex justify-end">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  router.push("/engineer-certification/victory-capture")
                }
                className="bg-primary text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Continue

                <ArrowRight size={18} />

              </motion.button>

            </div>

          </div>

        </motion.div>

      </div>
    </PageTransition>
  );
}