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

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "ACTIVE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

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
      
      addTerminalLine("SUCCESS: MIRROR HOST IDENTIFIED. CONNECTING...", "success");
      setSuccessMsg("Repository Located. Connecting...");
      
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
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="GIT_RECOVERY.EXE"
        terminalLabel="REPOSITORY CLONE TERMINAL"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="GIT_RECOVERY.EXE"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        directiveTitle="CLASSIFIED DIRECTIVE // REMOTE RECOVERY"
        directiveText={
          <>
            Input the owner and name coordinates of the repository.
            <br />
            Ensure the format matches standard git parameters.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="CLONING"
        radarSublabel="HOST ACCESS"
        bottomBarText="CAUTION: REMOTE ACCESS RESTRICTED"
        bottomBarSerial="#8409-GITRECOV"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        {/* Terminal Log Stream inside CRT functional area */}
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

        {/* Reconstruction Form in CRT functional area */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-2">
              // RECONSTRUCTION PARAMETERS
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#170809]/90 border border-[#ff3333]/30 text-[#ff3333] text-[11px] font-mono p-3 rounded shadow-[0_0_12px_rgba(255,51,51,0.1)]"
                >
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#061006]/90 border border-[#33ff66]/30 text-[#33ff66] text-[11px] font-mono p-3 rounded shadow-[0_0_12px_rgba(51,255,102,0.1)]"
                >
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleReconstruct} className="space-y-4" autoComplete="off">
              <div className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 font-mono text-sm">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-3">
                  <span className="text-[#3c663a] font-bold">&gt;</span>
                  <span className="text-[#3c663a]">git clone https://github.com/</span>
                  <input 
                    type="text" 
                    id="owner-input"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    disabled={loading}
                    className="bg-transparent border-none border-b border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none w-40 caret-[#33ff66] placeholder-[#264c23] py-0 px-1 text-center"
                    placeholder="[OWNER]" 
                    required 
                  />
                  <span className="text-[#3c663a]">/</span>
                  <input 
                    type="text" 
                    id="repo-input"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    disabled={loading}
                    className="bg-transparent border-none border-b border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none w-40 caret-[#33ff66] placeholder-[#264c23] py-0 px-1 text-center"
                    placeholder="[REPO]" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black transition-all duration-300 font-mono tracking-widest py-3 rounded-none select-none cursor-pointer uppercase font-bold`}
              >
                RECOVER REPOSITORY
              </button>
            </form>
          </div>

          {/* Sync Progress Bar */}
          <AnimatePresence>
            {showSync && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4"
              >
                <div className="font-mono text-[9px] text-[#33ff66]/80 tracking-widest uppercase mb-1">
                  REBUILD SYNCHRONIZATION
                </div>
                <div className="w-full h-1.5 bg-[#020502] border border-[#1a2d1d] rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-[#33ff66] shadow-[0_0_8px_#33ff66] transition-all duration-100 ease-out" 
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[9px]">
                  <span className="text-[#33ff66]/60">Restoring file trees...</span>
                  <span className="text-[#33ff66] font-bold">{Math.floor(syncProgress)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="font-mono text-[10px] text-[#3c663a] leading-relaxed border-t border-dashed border-[#1a2d1d] pt-3 mt-4">
            <p>HELP ADVISORY:</p>
            <p className="mt-0.5">Repository mirror structures map to: github.com/&lt;owner&gt;/&lt;repository&gt;</p>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
