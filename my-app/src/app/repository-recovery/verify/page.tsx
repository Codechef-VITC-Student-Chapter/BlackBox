"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

interface LogLine {
  text: string;
  type: "normal" | "system" | "success" | "error";
}

const INITIAL_LOGS: LogLine[] = [
  { text: "Repository Connection Established.", type: "normal" },
  { text: "Verifying Repository Integrity...", type: "system" },
  { text: "WARNING: Integrity Verification Failed", type: "error" },
  { text: "STATUS: Recovery Key Signature Missing", type: "error" },
  { text: "DIAGNOSTIC: Manual verification required.", type: "system" }
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "ACTIVE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function RepositoryVerification() {
  const router = useRouter();
  
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  
  const [terminalLines, setTerminalLines] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Awaiting signature check...");
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fill progress bar 0% -> 25% on mount
  useEffect(() => {
    let currentPct = 0;
    const progressTimer = setInterval(() => {
      currentPct += 1;
      if (currentPct >= 25) {
        currentPct = 25;
        clearInterval(progressTimer);
      }
      setProgress(currentPct);
    }, 25);

    return () => clearInterval(progressTimer);
  }, []);

  // Play boot-like audits logs on mount
  useEffect(() => {
    let logIdx = 0;
    function printInitLogs() {
      if (logIdx < INITIAL_LOGS.length) {
        setTerminalLines((prev) => [...prev, INITIAL_LOGS[logIdx]]);
        synth.playClick();
        
        if (INITIAL_LOGS[logIdx].type === "error") {
          synth.playError();
        }
        
        logIdx++;
        activeIntervalRef.current = setTimeout(printInitLogs, 600);
      } else {
        setProgressStatus("Signature missing. Awaiting key...");
      }
    }

    const startTimeout = setTimeout(printInitLogs, 500);

    return () => {
      clearTimeout(startTimeout);
      if (activeIntervalRef.current) clearTimeout(activeIntervalRef.current);
    };
  }, []);

  const addTerminalLine = (text: string, type: "normal" | "system" | "success" | "error" = "normal") => {
    setTerminalLines((prev) => [...prev, { text, type }]);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    synth.playClick();
    
    setErrorMsg("");
    setIsShaking(false);
    setLoading(true);
    
    addTerminalLine(`AUDITING KEY CODE: ${key}...`, "system");
    addTerminalLine("Contacting repository authorization server...", "normal");
    
    try {
      const res = await fetch("/api/verifyRecoveryKey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryKey: key })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid Recovery Key");
      }
      
      addTerminalLine("SIGNATURE ACCEPTED: Integrity Authorized.", "success");
      addTerminalLine("Decrypting remaining files structure...", "normal");
      
      setProgressStatus("Synchronizing files...");
      synth.playProgress(2.5);
      
      let currentPct = 25;
      const successInterval = setInterval(() => {
        currentPct += 3;
        if (currentPct >= 100) {
          currentPct = 100;
          setProgress(100);
          clearInterval(successInterval);
          
          setProgressStatus("Synchronization Complete.");
          addTerminalLine("REPOSITORY INTEGRITY: 100% SECURE.", "success");
          addTerminalLine("ACCESS LEVEL: LEVEL 3 AUTHORIZED.", "success");
          addTerminalLine("MODULE 2 STATUS: COMPLETED.", "system");
          
          synth.playSuccess();
          setCompleted(true);
        } else {
          setProgress(currentPct);
          if (currentPct % 4 === 0) {
            synth.playClick();
          }
        }
      }, 60);
      
    } catch (err) {
      setTimeout(() => {
        const error = err instanceof Error ? err : new Error(String(err));
        addTerminalLine(`VERIFICATION FAILURE: ${(error.message || "").toUpperCase()}`, "error");
        synth.playError();
        
        setIsShaking(true);
        setErrorMsg(error.message || "Invalid Recovery Key");
        setLoading(false);
        
        setTimeout(() => setIsShaking(false), 500);
      }, 800);
    }
  };

  const handleProceed = () => {
    synth.playClick();
    router.push("/network-labyrinth");
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="KEY_VERIFY.EXE"
        terminalLabel="SIGNATURE VERIFICATION TERMINAL"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="integrity_check.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        directiveTitle="CLASSIFIED DIRECTIVE // VERIFICATION"
        directiveText={
          <>
            Repository keys must be verified before gateway routing.
            <br />
            Ensure you submit the correct decryption key found in archives.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="VERIFYING"
        radarSublabel="INTEGRITY CHECK"
        bottomBarText="CAUTION: ONE-TIME VERIFICATION ONLY"
        bottomBarSerial="#8409-VERIFY"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        {/* Terminal Logs inside CRT functional area */}
        <div className="max-h-40 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {terminalLines.map((line, idx) => (
            <p 
              key={idx} 
              className={`mb-1 ${
                line.type === "system" ? "text-[#33ff66] drop-shadow-[0_0_4px_rgba(51,255,102,0.4)]" : 
                line.type === "error" ? "text-[#ff3333] font-bold drop-shadow-[0_0_4px_rgba(255,51,51,0.5)]" : 
                line.type === "success" ? "text-[#33ff66] font-bold drop-shadow-[0_0_4px_rgba(51,255,102,0.6)]" :
                "text-[#33ff66]/80"
              }`}
            >
              &gt; {line.text}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Verification Form */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-2">
              // INTEGRITY VERIFICATION SIGNATURE
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#170809]/90 border border-[#ff3333]/30 text-[#ff3333] text-xs font-mono p-3 rounded"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {!completed ? (
              <form onSubmit={handleVerify} className="space-y-4" autoComplete="off">
                <div className="space-y-2">
                  <label htmlFor="recovery-key-input" className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                    RECOVERY SIGNATURE KEY
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                    <input 
                      type="text" 
                      id="recovery-key-input"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      disabled={loading}
                      className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-lg outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase"
                      placeholder="BBX-RECOVERY-XXXXX" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono font-bold tracking-widest py-3 rounded-none transition-all duration-300 uppercase cursor-pointer`}
                >
                  SUBMIT KEY FOR VALIDATION
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border border-[#33ff66]/40 bg-[#061006]/90 text-[#33ff66] text-xs leading-relaxed font-mono">
                  <span className="font-bold block uppercase tracking-wider mb-1">// SYSTEM SECURE</span>
                  Repository verified. Access coordinates loaded successfully. You are cleared for next operations phase.
                </div>

                <button 
                  onClick={handleProceed}
                  className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-3.5 rounded-none hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 uppercase animate-pulse cursor-pointer"
                >
                  PROCEED TO NETWORK LABYRINTH
                </button>
              </div>
            )}
          </div>

          {/* Verification Progress Bar */}
          <div className="mt-4 pt-3 border-t border-[#1a2d1d]">
            <div className="flex justify-between font-mono text-[9px] text-[#3c663a] mb-1.5">
              <span>{progressStatus}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-[#020502] border border-[#1a2d1d]/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#33ff66] transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
