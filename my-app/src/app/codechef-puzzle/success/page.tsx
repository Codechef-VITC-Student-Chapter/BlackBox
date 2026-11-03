"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { Lock, Unlock, Copy, Check, Mail, AlertTriangle, ArrowRight } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "ACTIVE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function EnvelopeSuccessPage() {
  const router = useRouter();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [encryptedKey, setEncryptedKey] = useState<string>("LOADING...");
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/codechef-puzzle/complete")
      .then((res) => res.json())
      .then((data) => {
        if (data.encryptedKey) {
          setEncryptedKey(data.encryptedKey);
        }
      })
      .catch(() => setEncryptedKey("BBX-FRAG-ERR"));

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
        synth.playClick();

        if (line.includes("Restored")) {
          synth.playSuccess();
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleOpenEnvelope = () => {
    if (hasBeenOpened) return;

    synth.playClick();
    synth.playSuccess();
    setIsOpened(true);
    setHasBeenOpened(true);
  };

  const handleCopyKey = () => {
    if (!encryptedKey || encryptedKey === "LOADING...") return;

    navigator.clipboard.writeText(encryptedKey);
    setCopied(true);
    synth.playClick();

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const handleProceed = () => {
    synth.playClick();
    router.push("/core-vault");
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-04"
        exeName="RECOVERY_COMPLETE.EXE"
        terminalLabel="DECRYPTED RECOVERY TOKEN"
        maintenanceSeal="#4094"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="classified_transmission_vault.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-04"
        directiveTitle="CLASSIFIED DIRECTIVE // TOKEN EXTRACTION"
        directiveText={
          <>
            This transmission contains the vault recovery signature token.
            <br />
            Break the seal and copy the token before exiting this module node.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="DECRYPTED"
        radarSublabel="RECOVERY TOKEN ACTIVE"
        bottomBarText="RECONSTRUCTION NODE DECOMMISSIONED"
        bottomBarSerial="#8409-PUZZLE-OK"
        wallStencil="CONTROL ROOM 04 // VISUAL SECTOR"
      >
        {/* Terminal Logs in Left CRT panel */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {terminalLines.map((line, index) => (
            <p
              key={index}
              className={`text-xs ${
                line.includes("Restored")
                  ? "text-[#33ff66] font-bold drop-shadow-[0_0_5px_#33ff66]"
                  : line.includes("CLASSIFIED")
                  ? "text-[#f59e0b] font-bold"
                  : "text-[#3c663a]"
              }`}
            >
              &gt; {line}
            </p>
          ))}
        </div>

        {/* Envelope / Decrypted code section */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="flex flex-col items-center justify-center py-2">
            {!isOpened && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm bg-[#040e04] border border-[#1a2d1d] rounded-md p-6 text-center space-y-4 relative shadow-[0_0_20px_rgba(51,255,102,0.05)]"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[#ff3333] font-mono text-[9px] font-bold uppercase">
                  <Lock size={10} /> SEALED
                </div>

                <div className="w-14 h-14 mx-auto rounded-full bg-[#020502] border border-[#1a2d1d] flex items-center justify-center text-[#33ff66]">
                  <Mail size={24} className="animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                    RESTORED TRANSMISSION
                  </h3>
                  <p className="font-mono text-[10px] text-[#3c663a] leading-relaxed">
                    A recovery fragment was dispatched upon logo restoration.
                    Break the security seal to view the encrypted token.
                  </p>
                </div>

                <button
                  onClick={handleOpenEnvelope}
                  className="w-full py-2.5 border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono font-bold text-xs tracking-widest rounded-none transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Unlock size={13} /> BREAK SEAL
                </button>
              </motion.div>
            )}

            {isOpened && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md space-y-4"
              >
                <div className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1a2d1d] pb-2 font-mono">
                    <span className="text-[10px] text-[#33ff66] flex items-center gap-1 font-bold uppercase">
                      <Unlock size={12} /> DECRYPTED
                    </span>
                    <span className="text-[8px] text-[#ff3333] font-bold tracking-widest uppercase border border-[#ff3333]/30 px-1.5 py-0.5 rounded bg-[#3a0c0e]/30">
                      SEALS UPON EXIT
                    </span>
                  </div>

                  <div className="space-y-1.5 text-center">
                    <p className="font-mono text-[9px] text-[#3c663a] uppercase tracking-widest font-bold">
                      ENCRYPTED RECOVERY TOKEN
                    </p>
                    
                    <div className="bg-[#020502] border border-[#1a2d1d] rounded p-3.5 flex items-center justify-between gap-3 shadow-inner">
                      <span className="font-mono text-xl font-bold tracking-widest text-[#33ff66] truncate select-all">
                        {encryptedKey}
                      </span>

                      <button
                        onClick={handleCopyKey}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          copied
                            ? "bg-[#33ff66] text-black shadow-[0_0_10px_#33ff66]"
                            : "border border-[#33ff66] text-[#33ff66] hover:bg-[#33ff66] hover:text-black"
                        }`}
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1a1408] border border-[#f59e0b]/30 rounded p-3 text-left font-mono text-[10px] text-[#3c663a] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#f59e0b] font-bold uppercase">
                      <AlertTriangle size={12} /> ADVISORY:
                    </div>
                    <p className="leading-relaxed">
                      Copy and save this token manually. Once you navigate away, the envelope cannot be reopened. You will require this token to unlock <span className="text-[#33ff66] font-bold">Module 5 (Core Vault)</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Proceed control bar */}
          <div className="pt-3 border-t border-[#1a2d1d] flex flex-col gap-2 select-none">
            <button
              onClick={handleProceed}
              disabled={!hasBeenOpened}
              className={`w-full py-3.5 border font-mono text-xs font-bold tracking-widest transition-all duration-300 uppercase flex items-center justify-center gap-2 ${
                hasBeenOpened
                  ? "border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] cursor-pointer animate-pulse"
                  : "border-[#1a2d1d] text-[#264c23] bg-transparent opacity-30 cursor-not-allowed"
              }`}
            >
              PROCEED TO CORE VAULT <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}