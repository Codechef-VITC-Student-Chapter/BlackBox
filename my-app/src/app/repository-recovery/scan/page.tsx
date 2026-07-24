"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const SCAN_LOGS = [
  "INITIALIZING EMERGENCY BACKUP SCAN...",
  "CALIBRATING OPTICAL FORENSIC SENSORS... OK",
  "READING DATA CHUNKS (ECC LEVEL: H)...",
  "SECTOR 0x38F: [PARTIALLY CORRUPTED]",
  "REBUILDING DEGRADED QR SUB-SECTORS...",
  "EXTRACTING TARGET EMBEDDED METADATA...",
  "DECRYPTION COMPLETED SUCCESSFULLY."
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "ACTIVE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function QRForensicScan() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([
    "SENSOR STATUS: CONNECTED",
    "Waiting for calibration sequence..."
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const startScan = () => {
    synth.playClick();
    setIsScanning(true);
    setLogs(["INITIALIZING EMERGENCY BACKUP SCAN..."]);

    let logIdx = 1;
    function printScanLogs() {
      if (logIdx < SCAN_LOGS.length) {
        setLogs((prev) => [...prev, SCAN_LOGS[logIdx]]);
        synth.playClick();

        if (logIdx % 2 === 0) {
          synth.playScanSweep();
        }

        logIdx++;
        setTimeout(printScanLogs, 600);
      } else {
        setTimeout(() => {
          synth.playPopup();
          setShowModal(true);
        }, 500);
      }
    }

    setTimeout(printScanLogs, 600);
  };

  const handleCloseModal = () => {
    synth.playClick();
    setShowModal(false);
    setIsScanning(false);
    setShowContinue(true);
  };

  const handleContinue = () => {
    synth.playClick();
    router.push("/repository-recovery/evidence");
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="QR_SCAN.EXE"
        terminalLabel="SENSOR CALIBRATION ARRAY"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="sensor_capture.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        directiveTitle="CLASSIFIED DIRECTIVE // CALIBRATION"
        directiveText={
          <>
            Emergency backup scan recovers visual sectors of the system.
            <br />
            Ensure optical sensor grids are aligned prior to decryption.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="CALIBRATING"
        radarSublabel="SENSOR SCAN"
        bottomBarText="CAUTION: SENSOR ARRAY ACTIVE"
        bottomBarSerial="#8409-QRSCAN"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        {/* Scan Log Terminal */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {logs.map((log, idx) => (
            <p 
              key={idx} 
              className={`mb-1 ${
                log.startsWith("SENSOR STATUS:") || log.endsWith("SUCCESSFULLY.") 
                  ? "text-[#33ff66] drop-shadow-[0_0_4px_rgba(51,255,102,0.4)]" 
                  : "text-[#33ff66]/80"
              }`}
            >
              &gt; {log}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Functional scanner viewport */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between items-center p-2">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scanSweepFast {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            @keyframes scanSweepSlow {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            @keyframes qrFlicker {
              0%, 100% { opacity: 0.95; filter: none; }
              50% { opacity: 0.6; filter: hue-rotate(15deg) brightness(1.3) contrast(1.1); }
            }
          `}} />

          <div className="relative w-[220px] h-[220px] bg-black/40 border border-[#1a2d1d] rounded flex justify-center items-center overflow-hidden shadow-[0_0_15px_rgba(51,255,102,0.05)] select-none">
            {/* Sweep laser line */}
            <div 
              className="absolute left-0 w-full h-[2px] bg-[#33ff66] z-10 shadow-[0_0_8px_#33ff66,0_0_15px_#33ff66]"
              style={{
                animation: isScanning 
                  ? "scanSweepFast 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite" 
                  : "scanSweepSlow 4s linear infinite"
              }}
            />

            {/* QR image clue */}
            <img 
              src="/images/damaged_qr.png" 
              alt="Corrupted Sector QR" 
              className="w-[90%] h-[90%] object-contain opacity-95 image-render-pixelated select-none pointer-events-none border border-[#33ff66]/30 filter brightness-[0.9] contrast-[1.1]"
              style={{
                animation: isScanning ? "qrFlicker 0.2s infinite" : "none"
              }}
            />
          </div>

          {/* Trigger button controls */}
          <div className="w-full mt-4">
            {!showContinue ? (
              <button 
                onClick={startScan}
                disabled={isScanning}
                className={`w-full font-mono font-bold tracking-widest border py-3 px-6 rounded-none transition-all duration-300 uppercase ${
                  isScanning 
                    ? "border-[#1a2d1d] text-[#264c23] bg-transparent opacity-30 cursor-not-allowed" 
                    : "border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] cursor-pointer"
                }`}
              >
                {isScanning ? "Scanning..." : "SCAN QR SECTOR"}
              </button>
            ) : (
              <button 
                onClick={handleContinue}
                className="w-full font-mono font-bold tracking-widest border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] py-3 px-6 rounded-none transition-all duration-300 uppercase animate-pulse cursor-pointer"
              >
                CONTINUE TO LOCKER
              </button>
            )}
          </div>

        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[4px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[420px] bg-[#030703] border border-[#33ff66]/40 rounded-none p-6 shadow-[0_0_20px_rgba(51,255,102,0.15)] relative font-mono text-[#33ff66]"
              >
                <div className="flex items-center gap-2 font-bold tracking-[2px] border-b border-[#1a2d1d] pb-3 mb-4 uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#33ff66] animate-ping" />
                  <span>EMERGENCY BACKUP DECRYPTED</span>
                </div>
                
                <div className="text-xs leading-relaxed space-y-4 text-[#33ff66]/80">
                  <p className="border-b border-dashed border-[#1a2d1d] pb-2.5">
                    Forensic analysis of the corrupted sector successfully extracted metadata:
                  </p>
                  
                  <table className="w-full text-left font-mono">
                    <tbody>
                      <tr className="border-b border-[#1a2d1d]/50">
                        <td className="py-2 text-[#3c663a] font-bold uppercase tracking-wider">Platform:</td>
                        <td className="py-2 text-[#33ff66]">GitHub</td>
                      </tr>
                      <tr className="border-b border-[#1a2d1d]/50">
                        <td className="py-2 text-[#3c663a] font-bold uppercase tracking-wider">Owner:</td>
                        <td className="py-2 text-[#ff3333] font-bold uppercase tracking-widest">[CORRUPTED]</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-[#3c663a] font-bold uppercase tracking-wider">Repository:</td>
                        <td className="py-2 text-[#ff3333] font-bold uppercase tracking-widest">[CORRUPTED]</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <p className="text-[10px] text-[#3c663a] italic leading-relaxed pt-2">
                    Note: Owner and repository strings are missing. You must inspect the recovered evidence locker to retrieve them.
                  </p>
                </div>
                
                <button 
                  onClick={handleCloseModal}
                  className="mt-6 w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black transition-all duration-300 py-3 rounded-none cursor-pointer uppercase font-bold tracking-widest text-xs"
                >
                  CLOSE DIAGNOSTIC
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </BlackboxShell>
    </PageTransition>
  );
}
