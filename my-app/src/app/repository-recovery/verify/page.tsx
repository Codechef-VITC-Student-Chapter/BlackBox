"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
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

  // 1. Fill progress bar 0% -> 25% on mount
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

  // 2. Play boot-like audits logs on mount
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
      
      // Success Case
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
          
          // Try to update header state directly
          const statusInd = document.getElementById("layout-status-indicator");
          const statusTxt = document.getElementById("layout-status-text");
          if (statusInd && statusTxt) {
            statusInd.className = "w-2 h-2 rounded-full bg-success shadow-[0_0_8px_#22c55e]";
            statusTxt.innerText = "RESTORED 100%";
            statusTxt.className = "text-success font-bold text-shadow-[0_0_6px_rgba(39,201,63,0.4)]";
          }
        } else {
          setProgress(currentPct);
          if (currentPct % 4 === 0) {
            synth.playClick();
          }
        }
      }, 60);
      
    } catch (err: any) {
      setTimeout(() => {
        addTerminalLine(`VERIFICATION FAILURE: ${(err.message || "").toUpperCase()}`, "error");
        synth.playError();
        
        setIsShaking(true);
        setErrorMsg(err.message || "Invalid Recovery Key");
        setLoading(false);
        
        // Clear shake after animation completes
        setTimeout(() => setIsShaking(false), 500);
      }, 800);
    }
  };

  const handleReturnToRepo = () => {
    synth.playClick();
    router.push("/repository-recovery/recover");
  };

  const handleProceed = () => {
    synth.playClick();
    router.push("/network-labyrinth");
  };

  // Auto scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  return (
    <PageTransition>
      <div 
        className={`w-full max-w-[800px] glass-panel p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 shadow-2xl items-start border border-white/10 select-none ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        {/* Style tag for drawing checkmark */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes drawCheckmark {
            to { stroke-dashoffset: 0; }
          }
          .checkmark-animated-svg {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawCheckmark 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .glitch-text-red {
            animation: textGlitch 0.3s steps(2, start) infinite;
          }
          @keyframes textGlitch {
            0% { transform: skew(0.5deg); }
            50% { transform: skew(-0.5deg) opacity(0.85); }
            100% { transform: skew(0deg); }
          }
        `}} />

        {/* Left Column: Input Form & Success states */}
        <div>
          <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-4 uppercase">
            REPOSITORY VERIFICATION
          </div>

          <p className="text-secondary-text text-xs leading-relaxed mb-6">
            The repository has been restored successfully. However, a unique <span className="font-bold text-white">Recovery Key</span> was embedded inside the GitHub files. Locate it and submit it below to complete Module 2.
          </p>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-danger/10 border border-danger/30 text-danger text-[11.5px] font-mono p-4 rounded mb-5 leading-normal shadow-[0_0_12px_rgba(255,77,109,0.1)]"
              >
                Verification Failed.<br/>
                <span className="glitch-text-red font-bold block mt-1 uppercase">Recovery Key Invalid.</span>
                Search the repository again.
              </motion.div>
            )}
          </AnimatePresence>

          {!completed ? (
            <form onSubmit={handleVerify} className="space-y-5" autoComplete="off">
              <div className="space-y-1.5">
                <label htmlFor="key-input" className="font-mono text-[10.5px] font-bold text-secondary-text uppercase tracking-widest block">
                  RECOVERY KEY
                </label>
                <input 
                  type="text" 
                  id="key-input"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  disabled={loading}
                  className="w-full bg-black/40 border border-primary/25 focus:border-primary/60 rounded px-4 py-3 font-mono text-sm text-white tracking-widest font-bold focus:outline-none transition-colors"
                  placeholder="BBX-RECOVERY-XXXXX" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full font-mono font-bold tracking-widest border py-3 px-6 rounded transition-all duration-300 uppercase ${
                    loading
                      ? "border-white/10 text-secondary-text/40 bg-white/5 opacity-50 cursor-not-allowed"
                      : "border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_15px_#00e5ff] cursor-pointer"
                  }`}
                >
                  VERIFY KEY
                </button>
                
                <button 
                  type="button" 
                  onClick={handleReturnToRepo}
                  disabled={loading}
                  className={`w-full font-mono font-bold tracking-widest border py-3 px-6 rounded transition-all duration-300 uppercase ${
                    loading
                      ? "border-white/5 text-secondary-text/30 bg-transparent opacity-50 cursor-not-allowed"
                      : "border-white/10 text-secondary-text hover:border-white/20 hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  RETURN TO REPOSITORY
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center py-4">
              {/* Checkmark SVG */}
              <div className="flex justify-center mb-6">
                <svg className="w-20 h-20 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]" viewBox="0 0 52 52">
                  <circle className="stroke-success/30 stroke-2 fill-none" cx="26" cy="26" r="25" />
                  <path 
                    className="checkmark-animated-svg stroke-success fill-none stroke-[3.5] stroke-linecap-round" 
                    d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                  />
                </svg>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full font-mono font-bold tracking-widest border border-success text-success bg-success/5 hover:bg-success hover:text-black hover:shadow-[0_0_20px_#22c55e] py-3.5 px-6 rounded transition-all duration-300 uppercase animate-pulse cursor-pointer"
              >
                PROCEED TO MODULE 3
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Verification core audit logs */}
        <div className="flex flex-col h-full min-h-[300px] justify-between">
          <div className="flex flex-col">
            <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-4 uppercase">
              VERIFICATION CORE
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface/50 border border-white/10 border-b-0 rounded-t-lg select-none">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <span className="font-mono text-[11px] text-secondary-text/80 ml-2">verificator_audit.log</span>
            </div>
            
            <div className="bg-black/60 border border-white/10 rounded-b-lg p-5 font-mono text-[11.5px] leading-relaxed overflow-y-auto no-scrollbar h-[180px] max-h-[180px]">
              {terminalLines.map((line, idx) => (
                <p 
                  key={idx} 
                  className={`mb-1.5 ${
                    line.type === "system" ? "text-primary text-shadow-[0_0_4px_rgba(0,229,255,0.3)]" : 
                    line.type === "error" ? "text-danger font-bold text-shadow-[0_0_4px_rgba(255,77,109,0.3)]" : 
                    line.type === "success" ? "text-success text-shadow-[0_0_4px_rgba(34,197,94,0.3)]" :
                    "text-white/80"
                  }`}
                >
                  &gt; {line.text}
                </p>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Progress loader HUD */}
          <div>
            <div className="font-mono text-[10.5px] text-secondary-text tracking-widest uppercase mb-1.5">
              VERIFYING INTEGRITY LAYER
            </div>
            <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_#00e5ff] transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-secondary-text max-w-[170px] truncate">{progressStatus}</span>
              <span className="text-primary font-bold">{Math.floor(progress)}%</span>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
