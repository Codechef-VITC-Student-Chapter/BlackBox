"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
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
        // Finished
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

  // Auto scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <PageTransition>
      <div className="w-full max-w-[900px] glass-panel p-8 grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr] gap-8 shadow-2xl items-center border border-white/10 relative">
        
        {/* Style injection for scanning/flickering animations */}
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

        {/* Left Column: Glitching Scanner Screen */}
        <div className="text-center flex flex-col items-center">
          <div className="relative w-[280px] h-[280px] bg-black/40 border border-white/10 rounded flex justify-center items-center overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.05)] mb-6 select-none">
            {/* Corners */}
            <div className="absolute top-2 left-2.5 font-mono text-[9px] text-primary/50">FRAG_07</div>
            <div className="absolute top-2 right-2.5 font-mono text-[9px] text-primary/50">SYS_BKP</div>
            <div className="absolute bottom-2 left-2.5 font-mono text-[9px] text-primary/50">REC_SCN</div>
            <div className="absolute bottom-2 right-2.5 font-mono text-[9px] text-primary/50">SEC_02</div>

            {/* Sweep laser line */}
            <div 
              className="absolute left-0 w-full h-[2px] bg-primary z-10 shadow-[0_0_8px_#00e5ff,0_0_15px_#00e5ff]"
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
              className="w-[90%] h-[90%] object-contain opacity-90 image-render-pixelated select-none pointer-events-none"
              style={{
                animation: isScanning ? "qrFlicker 0.2s infinite" : "none"
              }}
            />
          </div>
          
          <h2 className="font-heading text-lg font-bold tracking-wide mb-1">
            EMERGENCY BACKUP SECTOR
          </h2>
          <p className="text-secondary-text text-xs max-w-[270px] leading-relaxed">
            One emergency backup fragment survived the purge. Calibrate sensor to decode.
          </p>
        </div>

        {/* Right Column: Audit Terminal logs & controls */}
        <div className="flex flex-col justify-between h-full min-h-[320px]">
          <div>
            <div className="font-mono text-xs font-bold tracking-[2px] text-primary border-b border-white/10 pb-2 mb-4">
              DECRYPTION PANEL
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-surface/50 border border-white/10 border-b-0 rounded-t-lg select-none">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                </div>
                <span className="font-mono text-[11px] text-secondary-text/80 ml-2">sensor_capture.log</span>
              </div>
              
              <div className="bg-black/60 border border-white/10 rounded-b-lg p-5 font-mono text-[11.5px] leading-relaxed overflow-y-auto no-scrollbar h-[180px] max-h-[180px]">
                {logs.map((log, idx) => (
                  <p 
                    key={idx} 
                    className={`mb-1.5 ${
                      log.startsWith("SENSOR STATUS:") || log.endsWith("SUCCESSFULLY.") 
                        ? "text-primary text-shadow-[0_0_4px_rgba(0,229,255,0.3)]" 
                        : "text-white/80"
                    }`}
                  >
                    &gt; {log}
                  </p>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          {/* Trigger button controls */}
          <div className="flex gap-4 mt-6">
            {!showContinue ? (
              <button 
                onClick={startScan}
                disabled={isScanning}
                className={`flex-1 font-mono font-bold tracking-widest border py-3 px-6 rounded transition-all duration-300 uppercase ${
                  isScanning 
                    ? "border-white/10 text-secondary-text/40 bg-white/5 opacity-50 cursor-not-allowed" 
                    : "border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_#00e5ff] cursor-pointer"
                }`}
              >
                {isScanning ? "Scanning..." : "SCAN QR SECTOR"}
              </button>
            ) : (
              <button 
                onClick={handleContinue}
                className="flex-1 font-mono font-bold tracking-widest border border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_#00e5ff] py-3 px-6 rounded transition-all duration-300 uppercase animate-pulse cursor-pointer"
              >
                CONTINUE TO LOCKER
              </button>
            )}
          </div>
        </div>

        {/* Forensic Decryption Diagnostic Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[4px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[420px] bg-surface border border-white/10 rounded-lg p-6 shadow-2xl relative"
              >
                <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-primary tracking-[2px] border-b border-white/10 pb-3 mb-4 uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <span>EMERGENCY BACKUP DECRYPTED</span>
                </div>
                
                <div className="font-mono text-xs text-secondary-text leading-relaxed space-y-4">
                  <p className="border-b border-dashed border-white/10 pb-2.5">
                    Forensic analysis of the corrupted sector successfully extracted metadata:
                  </p>
                  
                  <table className="w-full text-left font-mono">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-white/55 font-bold uppercase tracking-wider">Platform:</td>
                        <td className="py-2 text-white">GitHub</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2 text-white/55 font-bold uppercase tracking-wider">Owner:</td>
                        <td className="py-2 text-danger font-bold uppercase tracking-widest text-shadow-[0_0_4px_rgba(255,77,109,0.4)]">[CORRUPTED]</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white/55 font-bold uppercase tracking-wider">Repository:</td>
                        <td className="py-2 text-danger font-bold uppercase tracking-widest text-shadow-[0_0_4px_rgba(255,77,109,0.4)]">[CORRUPTED]</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <p className="text-[11px] text-secondary-text/60 italic leading-relaxed pt-2">
                    Note: Owner and repository strings are missing. You must inspect the recovered evidence locker to retrieve them.
                  </p>
                </div>
                
                <button 
                  onClick={handleCloseModal}
                  className="mt-6 w-full font-mono font-bold tracking-widest border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 py-3 rounded cursor-pointer uppercase"
                >
                  CLOSE DIAGNOSTIC
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
