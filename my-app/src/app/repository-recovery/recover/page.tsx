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

export default function RepositoryReconstruction() {
  const router = useRouter();
  
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [terminalLines, setTerminalLines] = useState<LogLine[]>([
    { text: "ENGINE STATUS: STANDBY", type: "system" },
    { text: "Input recovery coordinates to begin restoration...", type: "normal" }
  ]);
  
  const [showSync, setShowSync] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const syncProgressRef = useRef(0);

  const addTerminalLine = (text: string, type: "normal" | "system" | "success" | "error" = "normal") => {
    setTerminalLines((prev) => [...prev, { text, type }]);
  };

  const handleReconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    synth.playClick();
    
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    
    addTerminalLine(`INITIATING BACKUP SEARCH: github.com/${owner}/${repo}...`, "system");
    
    try {
      const res = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repository: repo })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Repository Not Found");
      }
      
      // Success Case
      addTerminalLine("SUCCESS: MIRROR HOST IDENTIFIED. CONNECTING...", "success");
      setSuccessMsg("Repository Located. Connecting...");
      
      // Update header status text via DOM lookup if accessible
      const statusInd = document.getElementById("layout-status-indicator");
      const statusTxt = document.getElementById("layout-status-text");
      if (statusInd && statusTxt) {
        statusInd.className = "w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_#ffcc00] animate-[ping_1s_step-end_infinite]";
        statusTxt.innerText = "SYNCING";
        statusTxt.className = "text-warning font-bold";
      }
      
      setShowSync(true);
      synth.playProgress(4.0);
      
      const logsToPrint = [
        { pct: 15, text: "Syncing Git object metadata... OK" },
        { pct: 30, text: "Retrieving tree objects: 142 objects" },
        { pct: 50, text: "Reconstructing commit history (318 commits)..." },
        { pct: 70, text: "Extracting active branches (5 active branches)..." },
        { pct: 85, text: "Pulling release package indexes (14 releases)..." },
        { pct: 95, text: "Repository integrity checked: OK" },
        { pct: 100, text: "SYNCHRONIZATION COMPLETED. EXPORTING ACCESS KEY..." }
      ];
      
      let nextLogIdx = 0;
      const totalSyncTime = 4000;
      const syncIntervalTime = 40;
      const steps = totalSyncTime / syncIntervalTime;
      const stepVal = 100 / steps;
      
      const syncInterval = setInterval(() => {
        syncProgressRef.current += stepVal;
        if (syncProgressRef.current >= 100) {
          syncProgressRef.current = 100;
          setSyncProgress(100);
          clearInterval(syncInterval);
          
          addTerminalLine(logsToPrint[logsToPrint.length - 1].text, "success");
          synth.playSuccess();
          
          setTimeout(() => {
            router.push("/repository-recovery/success");
          }, 1000);
        } else {
          setSyncProgress(syncProgressRef.current);
          
          if (Math.random() > 0.85) {
            synth.playClick();
          }
          
          if (nextLogIdx < logsToPrint.length - 1 && syncProgressRef.current >= logsToPrint[nextLogIdx].pct) {
            addTerminalLine(logsToPrint[nextLogIdx].text, "system");
            nextLogIdx++;
          }
        }
      }, syncIntervalTime);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      addTerminalLine(`ERROR: ${error.message}`, "error");
      synth.playError();
      setErrorMsg(error.message || "Repository Not Found. Try Again.");
      setLoading(false);
    }
  };

  // Auto scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  return (
    <PageTransition>
      <div className="w-full max-w-[900px] glass-panel p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr] gap-10 shadow-2xl items-start border border-white/10 select-none">
        
        {/* Left Column: Coordinates Form */}
        <div>
          <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-6 uppercase">
            RECONSTRUCTION PARAMETERS
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-danger/10 border border-danger/30 text-danger text-[12px] font-mono p-3.5 rounded mb-4 shadow-[0_0_12px_rgba(255,77,109,0.1)]"
              >
                {errorMsg}
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-success/10 border border-success/30 text-success text-[12px] font-mono p-3.5 rounded mb-4 shadow-[0_0_12px_rgba(34,197,94,0.1)]"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleReconstruct} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <label htmlFor="owner-input" className="font-mono text-[10.5px] font-bold text-secondary-text uppercase tracking-widest block">
                REPOSITORY OWNER
              </label>
              <input 
                type="text" 
                id="owner-input"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 focus:border-primary/60 rounded px-4 py-3 font-mono text-sm text-white placeholder:text-secondary-text/30 focus:outline-none transition-colors"
                placeholder="e.g. administrator" 
                required 
              />
            </div>
            
            <div className="space-y-1.5 mb-6">
              <label htmlFor="repo-input" className="font-mono text-[10.5px] font-bold text-secondary-text uppercase tracking-widest block">
                REPOSITORY NAME
              </label>
              <input 
                type="text" 
                id="repo-input"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 focus:border-primary/60 rounded px-4 py-3 font-mono text-sm text-white placeholder:text-secondary-text/30 focus:outline-none transition-colors"
                placeholder="e.g. core-system" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-mono font-bold tracking-widest border py-3 px-6 rounded transition-all duration-300 uppercase ${
                loading
                  ? "border-white/10 text-secondary-text/40 bg-white/5 opacity-50 cursor-not-allowed"
                  : "border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_15px_#00e5ff] cursor-pointer"
              }`}
            >
              RECOVER REPOSITORY
            </button>
          </form>

          <div className="font-mono text-[11px] text-secondary-text/50 line-height-relaxed border-t border-dashed border-white/10 pt-4 mt-6">
            <p>HELP ADVISORY:</p>
            <p className="mt-1">Repository mirror structures are mapping to:</p>
            <p className="text-primary tracking-wider mt-0.5">github.com/&lt;owner&gt;/&lt;repository&gt;</p>
          </div>
        </div>

        {/* Right Column: Rebuild Log Terminal */}
        <div className="flex flex-col h-full min-h-[300px] justify-between">
          <div className="flex flex-col">
            <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-4 uppercase">
              REBUILD MONITOR
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2.5 bg-surface/50 border border-white/10 border-b-0 rounded-t-lg select-none">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <span className="font-mono text-[11px] text-secondary-text/80 ml-2">reconstruct_engine.log</span>
            </div>
            
            <div className="bg-black/60 border border-white/10 rounded-b-lg p-5 font-mono text-[11.5px] leading-relaxed overflow-y-auto no-scrollbar h-[210px] max-h-[210px]">
              {terminalLines.map((line, idx) => {
                if (!line) return null;
                return (
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
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Sync Progress Bar (Renders on Success) */}
          <AnimatePresence>
            {showSync && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6"
              >
                <div className="font-mono text-[10.5px] text-primary tracking-widest uppercase mb-1.5">
                  REBUILD SYNCHRONIZATION
                </div>
                <div className="w-full h-2 bg-black/40 border border-white/10 rounded-full overflow-hidden mb-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_#00e5ff] transition-all duration-100 ease-out" 
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-primary">Restoring file trees...</span>
                  <span className="text-primary font-bold">{Math.floor(syncProgress)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </PageTransition>
  );
}
