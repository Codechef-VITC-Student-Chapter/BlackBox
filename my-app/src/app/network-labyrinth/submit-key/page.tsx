"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { KeySquare, AlertTriangle, Loader2 } from "lucide-react";

const FRAGMENT_COUNT = 4;

export default function GatewayRecoveryPage() {
  const router = useRouter();
  const [fragments, setFragments] = useState<string[]>(Array(FRAGMENT_COUNT).fill(""));
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFragment = (i: number, val: string) => {
    const next = [...fragments];
    next[i] = val.toUpperCase();
    setFragments(next);
  };

  const handleSubmit = async () => {
    if (!key.trim()) {
      setErrorMsg("Recovery key cannot be empty.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/network-labyrinth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim(), fragments }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setStatus("success");
        setTimeout(() => router.push("/network-labyrinth/success"), 1200);
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Invalid Recovery Key.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Try again.");
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Module 03 · Recovery
          </p>
          <h1 className="font-heading text-3xl font-bold text-text">
            GATEWAY RECOVERY
          </h1>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel w-full overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 border-b border-border bg-surface/40 px-5 py-3">
            <KeySquare size={15} className="text-primary" />
            <span className="font-mono text-xs tracking-widest text-secondary-text uppercase">
              Key Assembly Terminal
            </span>
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* Fragment inputs */}
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-secondary-text/70">
                Recovered Fragments
              </p>
              <div className="grid grid-cols-2 gap-3">
                {fragments.map((frag, i) => (
                  <div key={i} className="space-y-1">
                    <label className="font-mono text-[10px] text-secondary-text/50 uppercase tracking-widest">
                      Fragment {i + 1}
                    </label>
                    <input
                      id={`fragment-${i + 1}`}
                      type="text"
                      maxLength={24}
                      value={frag}
                      onChange={(e) => handleFragment(i, e.target.value)}
                      placeholder="________"
                      className="w-full bg-black/40 border border-border rounded px-3 py-2 font-mono text-sm text-text placeholder:text-secondary-text/30 focus:outline-none focus:border-primary/60 transition-colors tracking-widest"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Recovery key input */}
            <div className="space-y-2">
              <label
                htmlFor="recovery-key"
                className="font-mono text-[11px] uppercase tracking-widest text-secondary-text/70"
              >
                Gateway Recovery Key
              </label>
              <input
                id="recovery-key"
                type="text"
                value={key}
                onChange={(e) => { setKey(e.target.value); setStatus("idle"); }}
                placeholder="______________________________"
                className="w-full bg-black/40 border border-border rounded px-4 py-3 font-mono text-sm text-primary placeholder:text-secondary-text/30 focus:outline-none focus:border-primary transition-colors tracking-widest"
              />
            </div>

            {/* Error / success feedback */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 font-mono text-xs text-danger"
                >
                  <AlertTriangle size={13} />
                  {errorMsg}
                </motion.div>
              )}
              {status === "success" && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs text-success"
                >
                  ✓ &nbsp;Recovery Key Accepted — redirecting...
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Submit footer */}
          <div className="border-t border-border bg-surface/30 px-6 py-4 flex justify-end">
            {status === "loading" ? (
              <div className="flex items-center gap-2 font-mono text-sm text-secondary-text">
                <Loader2 size={16} className="animate-spin" />
                Validating...
              </div>
            ) : (
              <MagneticButton onClick={handleSubmit}>
                SUBMIT
              </MagneticButton>
            )}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}
