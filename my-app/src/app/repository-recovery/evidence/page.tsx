"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
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

    const xRot = (y / rect.height) * 4;
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
      className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 flex flex-col justify-between h-[230px] relative select-none"
    >
      <div>
        <div className="flex justify-between font-mono text-[10px] text-[#3c663a] tracking-widest uppercase mb-1">
          <span>{id}</span>
          <span className="bg-[#030703] border border-[#1a2d1d] text-[#3c663a] px-2 py-0.5 rounded text-[10px]">{size}</span>
        </div>
        <h3 className="font-mono text-sm font-bold text-[#33ff66] mb-2">{name}</h3>
        <p className="text-[#3c663a] text-xs leading-relaxed mb-2">{desc}</p>
        <p className="font-mono text-[10px] text-[#33ff66]/70 italic">
          {hint}
        </p>
      </div>

      <div>
        {downloading ? (
          <div className="w-full">
            <div className="w-full h-1.5 bg-[#020502] border border-[#1a2d1d]/40 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full ${completed ? 'bg-[#33ff66] shadow-[0_0_8px_#33ff66]' : 'bg-[#33ff66]/60'} transition-all duration-100`} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] tracking-wider text-[#3c663a]">
              <span className={completed ? 'text-[#33ff66] font-bold' : ''}>
                {completed ? 'DOWNLOAD COMPLETED' : 'DOWNLOADING FILE'}
              </span>
              <span className={completed ? 'text-[#33ff66] font-bold' : 'text-[#33ff66] font-bold'}>
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleDownload}
            className="w-full border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black font-mono text-xs px-3 py-1.5 tracking-widest rounded select-none cursor-pointer transition-all duration-250 uppercase"
          >
            DOWNLOAD FILE
          </button>
        )}
      </div>
    </div>
  );
}

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "ACTIVE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "LOCKED", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function RecoveredEvidenceLocker() {
  const router = useRouter();
  const [downloadedState, setDownloadedState] = useState<Record<string, boolean>>({
    backup: false,
    server: false,
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
      <BlackboxShell
        moduleCode="MOD-02"
        exeName="EVIDENCE_LOCKER.EXE"
        terminalLabel="ARTIFACT RETRIEVAL SYSTEM"
        maintenanceSeal="#4092"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="evidence_checker.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-02"
        directiveTitle="CLASSIFIED DIRECTIVE // RECOVERY LOCKER"
        directiveText={
          <>
            The archive contains fragments of what was lost. Download and inspect every artifact. Check signatures and file contents.
            <br />
            Let CyberChef do the cooking. Verify the evidence layout fully.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="RETRIEVING"
        radarSublabel="FORENSIC SCAN"
        bottomBarText="CAUTION: ARTIFACT INTEGRITY UNVERIFIED"
        bottomBarSerial="#8409-EVIDENCE"
        wallStencil="CONTROL ROOM 04 // RECOVERY SECTOR"
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative z-10">
          <div className="w-full text-left mb-1 select-none">
            <p className="font-mono text-[10px] font-bold tracking-[2px] text-[#33ff66]/80 uppercase">
              FORENSIC ARCHIVES
            </p>
            <h1 className="font-mono text-xl font-bold tracking-wide text-white uppercase mt-0.5">
              RECOVERED EVIDENCE LOCKER
            </h1>
            <p className="text-[#3c663a] text-xs mt-1 leading-relaxed max-w-2xl">
              Analyze the recovered files to extract the missing repository details. CyberChef is cooking... Download both files to unlock the reconstruction terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EvidenceFileCard 
              id="FILE_01"
              fileKey="backup"
              size="12 B"
              name="backup.bin"
              desc="Recovered binary archive. Contains corrupted sector snapshots."
              hint='"XOR operation reveals the path. Key: 0x5A (CyberChef is cooking...)"'
              url="/downloads/backup.bin"
              onDownloaded={handleDownloaded}
            />
            <EvidenceFileCard 
              id="FILE_02"
              fileKey="server"
              size="1.06 MB"
              name="server_room.png"
              desc="High resolution snapshot of primary node rack prior to system failure."
              hint='"The end of the image holds secrets. Decryption: ROT13. CyberChef is cooking..."'
              url="/images/server_room.png"
              onDownloaded={handleDownloaded}
            />
          </div>

          <div className="text-right mt-2 select-none">
            <button 
              onClick={handleProceed}
              disabled={!isAllDownloaded}
              className={`font-mono font-bold tracking-widest border py-2.5 px-6 rounded transition-all duration-300 uppercase ${
                isAllDownloaded 
                  ? "border-[#33ff66] bg-[#33ff66] text-[#000000] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] cursor-pointer" 
                  : "border-[#1a2d1d] text-[#264c23] opacity-30 cursor-not-allowed"
              }`}
            >
              I HAVE ENOUGH EVIDENCE
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
