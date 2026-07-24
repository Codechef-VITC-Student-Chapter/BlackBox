"use client";

import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { Camera, CameraIcon, ArrowRight } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

export default function VictoryCapturePage() {
  const router = useRouter();

  const handleCapture = () => {
    synth.playClick();
    synth.playScanSweep();
  };

  const handleContinue = () => {
    synth.playClick();
    router.push("/leaderboard");
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-06"
        exeName="VICTORY_CAPTURE.EXE"
        terminalLabel="PHOTO CAPTURE TERMINAL"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="victory_capture.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // VICTORY CAPTURE"
        directiveText={
          <>
            Align camera sensors before triggering the victory capture snapshot.
            <br />
            Gather your team inside the vector bounds of the frame.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURED"
        radarSublabel="GRADER SECURE"
        bottomBarText="VICTORY FRAME ACQUIRED"
        bottomBarSerial="#8409-VICTORY"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4">
          <div className="text-center py-2 select-none">
            <Camera
              size={52}
              className="mx-auto text-[#33ff66] mb-2 drop-shadow-[0_0_8px_#33ff66]"
            />
            <h1 className="font-mono text-xl font-bold tracking-widest text-[#33ff66] uppercase">
              Engineer Certified
            </h1>
            <p className="font-mono text-[10px] text-[#3c663a] mt-0.5">
              One final step before BLACKBOX closes.
            </p>
          </div>

          {/* Camera Frame Preview */}
          <div className="border-2 border-dashed border-[#33ff66]/30 bg-[#030703] rounded-md h-48 flex flex-col items-center justify-center relative select-none">
            <CameraIcon
              size={48}
              className="text-[#3c663a] mb-2 animate-pulse"
            />
            <p className="font-mono text-xs text-[#3c663a] font-bold">
              CAMERA PREVIEW ARRAY
            </p>
            <p className="font-mono text-[10px] text-[#3c663a]/65 mt-1">
              Webcam will mount here upon click.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 font-mono text-[10px] text-[#3c663a] leading-relaxed space-y-1">
            <p className="text-[#33ff66] font-bold uppercase tracking-wider mb-1">{"// CAPTURE YOUR VICTORY"}</p>
            <p>Gather your entire team inside the frame.</p>
            <p>Your final achievement frame is calculated based on leaderboard rank.</p>
            <p className="text-white font-bold pt-1">Smile... this moment is permanent.</p>
          </div>

          <div className="flex gap-3 select-none">
            <button
              onClick={handleCapture}
              className="flex-1 border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black transition-all duration-250 py-2.5 font-mono text-xs font-bold uppercase cursor-pointer"
            >
              CAPTURE PHOTO
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_10px_rgba(51,255,102,0.6)] transition-all duration-250 py-2.5 font-mono text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
            >
              CONTINUE <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
