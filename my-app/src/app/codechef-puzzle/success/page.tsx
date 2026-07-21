"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Terminal,
  Lock,
  Unlock,
  Copy,
  Check,
  ShieldAlert,
  Mail,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

export default function EnvelopeSuccessPage() {
  const router = useRouter();
  const { playSound } = useAudio();

  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [encryptedKey, setEncryptedKey] = useState<string>("LOADING...");
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fetch the team's encrypted key from the backend API
    fetch("/api/codechef-puzzle/complete")
      .then((res) => res.json())
      .then((data) => {
        if (data.encryptedKey) {
          setEncryptedKey(data.encryptedKey);
        }
      })
      .catch(() => setEncryptedKey("BBX-FRAG-ERR"));

    // 2. Terminal log typing sequence
    const sequence = [
      "Verifying Logo Integrity...",
      "██████████████████ 100%",
      "Visual Subsystem Restored.",
      "Encrypting Recovery Transmission...",
      "CLASSIFIED ENVELOPE GENERATED.",
      "Awaiting manual operator decryption..."
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
      }
    }, 600);

    return () => clearInterval(interval);
  }, [playSound]);

  const handleOpenEnvelope = () => {
    if (hasBeenOpened) return;

    playSound("click");
    playSound("success");
    setIsOpened(true);
    setHasBeenOpened(true);
  };

  const handleCopyKey = () => {
    if (!encryptedKey || encryptedKey === "LOADING...") return;

    navigator.clipboard.writeText(encryptedKey);
    setCopied(true);
    playSound("click");

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleProceed = () => {
    playSound("click");
    router.push("/core-vault");
  };

  return (
    <PageTransition>
      <div className="flex justify-center w-full min-h-[85vh] items-center py-6 select-none">
        <div className="glass-panel w-full max-w-4xl overflow-hidden border border-border shadow-2xl">

          {/* Terminal Header */}
          <div className="border-b border-border bg-surface/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-secondary-text" />
              <span className="font-mono text-xs md:text-sm tracking-widest uppercase text-secondary-text">
                CLASSIFIED_TRANSMISSION_VAULT.LOG
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
              ONE-TIME VIEW
            </span>
          </div>

          {/* Terminal Log Stream */}
          <div className="p-6 font-mono space-y-2.5 bg-black/40 min-h-45">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xs md:text-sm ${
                  line.includes("Restored")
                    ? "text-primary font-bold"
                    : line.includes("CLASSIFIED")
                    ? "text-warning font-bold"
                    : "text-secondary-text"
                }`}
              >
                {"> "}{line}
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary align-middle"
            />
          </div>

          {/* Interactive Envelope Section */}
          <div className="border-t border-border bg-surface/20 p-6 md:p-10 flex flex-col items-center">
            
            {/* Sealed / Unopened Envelope State */}
            {!isOpened && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-linear-to-b from-surface/90 to-black/80 border border-primary/30 rounded-xl p-8 text-center space-y-6 shadow-[0_0_30px_rgba(0,229,255,0.08)] relative"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-danger font-mono text-[10px] tracking-widest uppercase">
                  <Lock size={12} /> SEALED
                </div>

                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  <Mail size={38} className="animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
                    RESTORED LOGO TRANSMISSION
                  </h3>
                  <p className="font-mono text-xs text-secondary-text leading-relaxed">
                    A recovery fragment was dispatched upon logo restoration.
                    Break the security seal to view the encrypted token.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleOpenEnvelope}
                  className="w-full py-3.5 bg-primary text-black font-mono font-bold text-sm tracking-widest rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_#00e5ff] transition-all cursor-pointer uppercase"
                >
                  <Unlock size={16} /> Open Sealed Envelope
                </motion.button>
              </motion.div>
            )}

            {/* Opened Envelope State */}
            <AnimatePresence>
              {isOpened && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-xl space-y-6 text-center"
                >
                  {/* Outer Envelope Wrapper */}
                  <div className="relative bg-black/80 border-2 border-primary/50 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,229,255,0.12)] space-y-6">
                    
                    {/* Top Stamp */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="font-mono text-[11px] text-success flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Unlock size={14} /> TRANSMISSION DECRYPTED
                      </span>
                      <span className="font-mono text-[10px] text-danger font-bold tracking-widest uppercase border border-danger/30 px-2 py-0.5 rounded bg-danger/10">
                        SEALS PERMANENTLY UPON EXIT
                      </span>
                    </div>

                    {/* Token Display Container */}
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-secondary-text uppercase tracking-widest">
                        ENCRYPTED RECOVERY TOKEN
                      </p>
                      
                      <div className="bg-surface/90 border border-primary/40 rounded-xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-inner">
                        <span className="font-mono text-2xl md:text-3xl font-extrabold tracking-[0.2em] text-primary truncate">
                          {encryptedKey}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={handleCopyKey}
                          className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                            copied
                              ? "bg-success text-black shadow-[0_0_12px_#22c55e]"
                              : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-black"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check size={15} /> COPIED!
                            </>
                          ) : (
                            <>
                              <Copy size={15} /> COPY
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Subtle Story Narrative Hint Box */}
                    <div className="bg-warning/5 border border-warning/30 rounded-xl p-4 text-left font-mono text-xs text-secondary-text space-y-2">
                      <div className="flex items-center gap-2 text-warning font-bold uppercase tracking-wider">
                        <AlertTriangle size={15} /> ARCHIVE ADVISORY:
                      </div>
                      <p className="leading-relaxed">
                        This token has been generated specifically for your team. <span className="text-white font-bold underline">Copy and save it manually</span> into an external note.
                      </p>
                      <p className="text-warning/90 leading-relaxed pt-1">
                        Once you navigate away from this node, <span className="font-bold">this envelope cannot be reopened</span>. You will require this token to unlock <span className="text-primary font-bold">Module 5 (Core Vault)</span>[cite: 68, 82].
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Footer Controls */}
          <div className="border-t border-border bg-surface/40 p-6 flex items-center justify-between flex-wrap gap-4">
            <p className="font-mono text-secondary-text text-xs md:text-sm">
              Every subsystem leaves behind a trace.
              <br />
              Whether you retain it... is your decision.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleProceed}
              disabled={!hasBeenOpened}
              className={`px-6 py-3 font-mono text-sm font-bold rounded-lg flex items-center gap-2 transition-all uppercase ${
                hasBeenOpened
                  ? "bg-primary text-black cursor-pointer hover:shadow-[0_0_20px_#00e5ff]"
                  : "bg-white/5 text-secondary-text/40 border border-white/10 cursor-not-allowed"
              }`}
            >
              Proceed to Core Vault <ArrowRight size={16} />
            </motion.button>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}