"use client";

import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { CheckCircle2, ArrowRight } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

export default function RecoveryCompletePage() {
  const router = useRouter();

  const modules = [
    "Authentication",
    "Repository",
    "Gateway",
    "CodeChef Puzzle",
    "Core",
    "Engineer Certification",
  ];

  const handleContinue = () => {
    synth.playClick();
    router.push("/engineer-certification/victory-capture");
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-06"
        exeName="SYSTEM_RECOVERY.EXE"
        terminalLabel="STAGE 6 COMPLETE"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="system_restore.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // RESTORATION"
        directiveText={
          <>
            Subsystems recovery operations complete.
            <br />
            Deploy the victory capture sequence to claim certification.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURED"
        radarSublabel="GRADER SECURE"
        bottomBarText="RECOVERY COMPLETED SUCCESSFULLY"
        bottomBarSerial="#8409-RECOVERY-OK"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4">
          <div className="text-center py-2 select-none">
            <CheckCircle2
              size={52}
              className="mx-auto text-[#33ff66] mb-2 drop-shadow-[0_0_8px_#33ff66]"
            />
            <h1 className="font-mono text-xl font-bold tracking-widest text-[#33ff66] uppercase">
              System Restored
            </h1>
            <p className="font-mono text-[10px] text-[#3c663a] mt-0.5">
              Every subsystem has been successfully recovered.
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-2 select-none">
            <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1 font-bold">
              // BLACKBOX ARCHIVE STATUS
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {modules.map((module) => (
                <div
                  key={module}
                  className="flex items-center justify-between border border-[#1a2d1d] bg-[#040e04] rounded-md px-3 py-2 font-mono text-[#3c663a]"
                >
                  <span>{module}</span>
                  <span className="text-[#33ff66] font-bold">✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Transmission */}
          <div className="bg-[#030703] border border-[#1a2d1d] rounded-md p-4 font-mono text-[10px] text-[#3c663a] leading-relaxed space-y-1">
            <p className="text-[#33ff66] font-bold uppercase tracking-wider mb-1">// FINAL TRANSMISSION</p>
            <p>Congratulations. You recovered BLACKBOX.</p>
            <p>You investigated. You observed.</p>
            <p>You connected every clue. You restored every subsystem.</p>
            <p className="text-white font-bold pt-1">The system finally trusts you.</p>
          </div>

          <div className="bg-[#030703] border border-[#1a2d1d] rounded-md p-3 font-mono text-[10px] text-[#3c663a] space-y-0.5">
            <p>&gt; Preparing Final Archive...</p>
            <p>&gt; Generating Engineer Identity...</p>
            <p>&gt; One final memory remains.</p>
          </div>

          <div className="pt-2 select-none">
            <button
              onClick={handleContinue}
              className="w-full border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] py-3.5 px-6 font-mono font-bold tracking-widest rounded-none transition-all duration-300 uppercase cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              CONTINUE <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}