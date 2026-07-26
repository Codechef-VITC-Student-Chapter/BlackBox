"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { CheckCircle2 } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

export default function VerdictPage() {
  const router = useRouter();

  // Temporary data (replace with backend later)
  const verdict = "Accepted";
  const language = "C++";
  const passed = 15;
  const total = 15;
  const executionTime = "124 ms";
  const memory = "38 MB";
  const penalty = "+0 min";

  useEffect(() => {
    synth.playSuccessFanfare();
  }, []);

  const handleContinue = () => {
    synth.playClick();
    router.push("/engineer-certification/recovery-complete");
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-07"
        exeName="SUBMISSION_VERDICT.EXE"
        terminalLabel="ASSESSMENT STATUS"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="grading_verdict.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // GRADER VERDICT"
        directiveText={
          <>
            Assessment results verified.
            <br />
            You are cleared to claim the certification.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURED"
        radarSublabel="GRADER SECURE"
        bottomBarText="CAUTION: VERDICT DECISION FINAL"
        bottomBarSerial="#8409-VERDICT"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4">
          {/* Verdict Status */}
          <div className="text-center py-2 select-none">
            <CheckCircle2
              size={52}
              className="mx-auto text-[#33ff66] mb-2 drop-shadow-[0_0_8px_#33ff66]"
            />
            <h1 className="font-mono text-xl font-bold tracking-widest text-[#33ff66] uppercase">
              {verdict}
            </h1>
            <p className="font-mono text-[10px] text-[#3c663a] mt-0.5">
              Solution successfully verified.
            </p>
          </div>

          {/* Grader stats */}
          <div className="grid grid-cols-2 gap-2 text-[10px] select-none">
            {[
              { label: "Language", value: language },
              { label: "Submission ID", value: "#18" },
              { label: "Passed Testcases", value: `${passed}/${total}` },
              { label: "Execution Time", value: executionTime },
              { label: "Memory Used", value: memory },
              { label: "Penalty", value: penalty },
            ].map(info => (
              <div key={info.label} className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-2.5 font-mono">
                <span className="text-[#3c663a] block uppercase font-bold text-[8px] tracking-widest">{info.label}</span>
                <span className="text-[#33ff66] font-bold block mt-0.5 text-xs">{info.value}</span>
              </div>
            ))}
          </div>

          {/* Terminal log */}
          <div className="bg-[#030703] border border-[#1a2d1d] p-3 font-mono text-[10px] space-y-1">
            <p className="text-[#3c663a]">&gt; Running hidden test cases...</p>
            <p className="text-[#3c663a]">&gt; Checking constraints...</p>
            <p className="text-[#3c663a]">&gt; Validating output...</p>
            <p className="text-[#33ff66] font-bold">&gt; All test cases passed.</p>
          </div>

          <div className="pt-2 select-none">
            <button
              onClick={handleContinue}
              className="w-full border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] py-3 px-6 font-mono font-bold tracking-widest rounded-none transition-all duration-300 uppercase cursor-pointer text-xs"
            >
              CONTINUE TO CERTIFICATION
            </button>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}