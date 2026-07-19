"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { GitBranch, CheckCircle } from "lucide-react";

export default function RepositorySuccessPage() {
  const router = useRouter();

  // Auto-redirect to Module 3 after the animation completes
  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/network-labyrinth");
    }, 3000);
    return () => clearTimeout(t);
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
            REPOSITORY RESTORED
          </h1>
        </motion.div>

        {/* Status panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel w-full overflow-hidden border border-success/20"
        >
          {/* Icon + message */}
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle size={48} className="text-success" />
            </motion.div>

            <div className="text-center space-y-2">
              <p className="font-mono text-sm text-secondary-text">
                Commit history verified. Branch integrity restored.
              </p>
              <p className="font-mono text-sm text-secondary-text">
                Repository is back online.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Boot log */}
          <div className="bg-black/40 px-5 py-4 font-mono text-sm space-y-2">
            {[
              { text: "Repository Verified...",    delay: 0.5 },
              { text: "Syncing Commit History...", delay: 1.0 },
              { text: "Branch Integrity: PASS",    delay: 1.5 },
              { text: "Routing to Network Labyrinth...", delay: 2.2, highlight: true },
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: line.delay }}
                className="flex items-center gap-2"
              >
                <span className="text-primary/50">&gt;</span>
                <span className={line.highlight ? "text-primary" : "text-secondary-text"}>
                  {line.text}
                </span>
              </motion.div>
            ))}

            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-3.5 bg-primary/70 ml-5"
            />
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-4 pt-2">
            <div className="flex justify-between font-mono text-[10px] text-secondary-text/60 mb-1.5">
              <span>Transferring to Module 03</span>
              <GitBranch size={11} />
            </div>
            <div className="w-full h-0.5 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}
