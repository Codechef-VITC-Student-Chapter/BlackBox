"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const LOADING_STEPS = [
  "Preparing Judge...",
  "Loading Compiler...",
  "Generating Test Cases...",
  "System Ready.",
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "COMPLETE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
  { title: "Final Authorization", status: "COMPLETE", modId: "MOD-07", serial: "SN:84-F7", iconType: "final" },
];

export default function SuccessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    synth.playSuccessFanfare();

    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 2500);

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          synth.playClick();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1000);



    return () => {
      clearTimeout(titleTimer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-07"
        exeName="GATEWAY_COMPLETE.EXE"
        terminalLabel="AUTH COMPLETE"
        maintenanceSeal="#4097"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="success_transmission.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-07"
        directiveTitle="CLASSIFIED DIRECTIVE // VERDICT COMPLETED"
        directiveText={
          <>
            All security firewalls have been cleared.
            <br />
            Redirecting to engineer certification logs.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SECURED"
        radarSublabel="GATEWAY COMPLETE"
        bottomBarText="GATEWAY ACCESS GRANTED PERMANENTLY"
        bottomBarSerial="#8409-FINAL-OK"
        wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4 text-center font-mono">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes finalGlitch {
              0%, 100% { opacity: 0.05; transform: none; }
              50% { opacity: 0.15; transform: skewX(-5deg); }
            }
            .final-glitch-overlay {
              animation: finalGlitch 1.5s ease-in-out infinite;
            }
          `}} />

          {/* Glitch Overlay */}
          <div className="final-glitch-overlay absolute inset-0 bg-[#33ff66]/5 pointer-events-none z-0" />

          <div className="space-y-2 select-none relative z-10">
            <p className="text-[#33ff66] font-bold text-sm tracking-widest uppercase">
              FINAL BARRIER DESTROYED
            </p>
            <p className="text-white text-xs tracking-wider">
              SECURE CHANNEL ESTABLISHED
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center relative z-10 my-4 min-h-[140px]">
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <h1 className="text-2xl font-bold tracking-widest text-[#33ff66] uppercase drop-shadow-[0_0_8px_#33ff66]">
                  ENGINEER
                  <br />
                  CERTIFICATION
                </h1>

                <div className="bg-[#030703] border border-[#1a2d1d] rounded p-4 text-left max-w-xs mx-auto text-[10px] space-y-1 text-[#3c663a] font-bold">
                  {LOADING_STEPS.slice(0, step + 1).map((item, idx) => (
                    <p key={idx}>
                      &gt; {item}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {step === LOADING_STEPS.length - 1 && (
  <div className="relative z-10 py-2 space-y-4">
    <div className="text-[#33ff66] font-bold animate-pulse text-xs">
      // ENGINE READY
    </div>

    <button
      onClick={() => {
        synth.playSuccess();
        router.push("/engineer-certification");
      }}
      className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold text-xs tracking-widest py-3.5 hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all uppercase cursor-pointer"
    >
      ENTER ENGINEER CERTIFICATION
    </button>
  </div>
)}
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}