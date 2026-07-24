"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";

interface FileCardProps {
  id: string;
  fileKey: string;
  size: string;
  name: string;
  desc: string;
  hint: string;
  url: string;
  onDownloaded: (key: string) => void;
}

function EvidenceFileCard({ id, fileKey, size, name, desc, hint, url, onDownloaded }: FileCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [transformStyle, setTransformStyle] = useState("");

  const handleDownload = () => {
    synth.playClick();
    setDownloading(true);
    synth.playProgress(0.8);

    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 15) + 5;
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(interval);
        setProgress(100);
        setCompleted(true);
        synth.playSuccess();

        // Trigger file download
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Notify parent
        onDownloaded(fileKey);
      } else {
        setProgress(currentPct);
        if (currentPct % 3 === 0) {
          synth.playClick();
        }
      }
    }, 100);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const xRot = (y / rect.height) * 4; // Max 4deg rotation
    const yRot = -(x / rect.width) * 4;

    setTransformStyle(`perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.15s ease-out" }}
      className="glass-panel p-6 flex flex-col justify-between h-[230px] border border-white/10 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,229,255,0.05)] bg-surface/30 relative"
    >
      <div>
        <div className="flex justify-between font-mono text-[10px] text-secondary-text tracking-widest uppercase mb-1">
          <span>{id}</span>
          <span>{size}</span>
        </div>
        <h3 className="font-mono text-sm font-bold text-white mb-2">{name}</h3>
        <p className="text-secondary-text text-[11.5px] leading-relaxed mb-2.5">{desc}</p>
        <p className="font-mono text-[10.5px] text-primary/75 italic">
          {hint}
        </p>
      </div>

      <div>
        {downloading ? (
          <div className="w-full">
            <div className="w-full h-1.5 bg-black/40 border border-white/5 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full ${completed ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-primary shadow-[0_0_8px_#00e5ff]'} transition-all duration-100`} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] tracking-wider text-secondary-text">
              <span className={completed ? 'text-success font-bold' : ''}>
                {completed ? 'DOWNLOAD COMPLETED' : 'DOWNLOADING FILE'}
              </span>
              <span className={completed ? 'text-success font-bold' : 'text-primary font-bold'}>
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleDownload}
            className="w-full font-mono text-xs font-bold tracking-widest border border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_12px_#00e5ff] transition-all duration-300 py-2.5 rounded uppercase select-none cursor-pointer"
          >
            DOWNLOAD FILE
          </button>
        )}
      </div>
    </div>
  );
}

export default function RecoveredEvidenceLocker() {
  const router = useRouter();
  const [downloadedState, setDownloadedState] = useState<Record<string, boolean>>({
    backup: false,
    server: false,
    voice: false,
    recovery: false
  });

  const handleDownloaded = (key: string) => {
    setDownloadedState((prev) => {
      const next = { ...prev, [key]: true };
      return next;
    });
  };

  const isAllDownloaded = Object.values(downloadedState).every(status => status === true);

  const handleProceed = () => {
    synth.playSuccess();
    router.push("/repository-recovery/recover");
  };

  return (
    <PageTransition>
      <div className="w-full max-w-[1000px] flex flex-col gap-6 items-center">
        
        {/* Title HUD Banner */}
        <div className="w-full text-left mb-2 select-none">
          <p className="font-mono text-xs font-bold tracking-[2.5px] text-primary uppercase">
            FORENSIC ARCHIVES
          </p>
          <h1 className="font-sans text-3xl font-black tracking-wide text-white uppercase mt-1">
            RECOVERED EVIDENCE LOCKER
          </h1>
          <p className="text-secondary-text text-sm mt-1.5 leading-relaxed max-w-2xl">
            Analyze the recovered files to extract the missing repository details. Download all 4 files to unlock the reconstruction terminal.
          </p>
        </div>

        {/* Evidence Grid of Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          <EvidenceFileCard 
            id="FILE_01"
            fileKey="backup"
            size="12 B"
            name="backup.bin"
            desc="Recovered binary archive. Contains corrupted sector snapshots."
            hint='"XOR operation reveals the path. Key: 0x5A"'
            url="/downloads/backup.bin"
            onDownloaded={handleDownloaded}
          />
          <EvidenceFileCard 
            id="FILE_02"
            fileKey="server"
            size="1.06 MB"
            name="server_room.png"
            desc="High resolution snapshot of primary node rack prior to system failure."
            hint='"The end of the image holds secrets. Decryption: ROT13."'
            url="/images/server_room.png"
            onDownloaded={handleDownloaded}
          />
          <EvidenceFileCard 
            id="FILE_03"
            fileKey="voice"
            size="102 B"
            name="voice.log"
            desc="Transcribed audio transmission containing distress frequency pulses."
            hint='"Telemetry burst capture. Burst duration: 300ms is Dash, 100ms is Dot."'
            url="/downloads/voice.log"
            onDownloaded={handleDownloaded}
          />
          <EvidenceFileCard 
            id="FILE_04"
            fileKey="recovery"
            size="144 B"
            name="recovery.log"
            desc="Diagnostic readout log retrieved from emergency restore partition."
            hint='"The first letter of each system event contains the final segment."'
            url="/downloads/recovery.log"
            onDownloaded={handleDownloaded}
          />
        </div>

        {/* Proceed Action Button */}
        <div className="w-full text-right mt-4 select-none">
          <button 
            onClick={handleProceed}
            disabled={!isAllDownloaded}
            className={`font-mono font-bold tracking-widest border py-3.5 px-10 rounded transition-all duration-500 uppercase ${
              isAllDownloaded 
                ? "border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_#00e5ff] animate-pulse cursor-pointer" 
                : "border-white/10 text-secondary-text/40 bg-white/5 opacity-50 cursor-not-allowed"
            }`}
          >
            I HAVE ENOUGH EVIDENCE
          </button>
        </div>

      </div>
    </PageTransition>
  );
}
