"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const MODES = ["SAFE", "SEMI", "AUTO"];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "COMPLETE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
  { title: "Final Authorization", status: "ACTIVE", modId: "MOD-07", serial: "SN:84-F7", iconType: "final" },
];

export default function ak47() {
  const router = useRouter();
  const [modeIndex, setModeIndex] = useState(0);
  const [activated, setActivated] = useState(false);

  function handleModeChange() {
    synth.playClick();
    if (activated) return;

    if (modeIndex < MODES.length - 1) {
      setModeIndex(modeIndex + 1);
    } else {
      setActivated(true);
      synth.playError();
    }
  }

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-07"
        exeName="WEAPON_SYSTEM.EXE"
        terminalLabel="VT-100 WEAPON SYSTEM DIAGNOSTIC"
        maintenanceSeal="#4097"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="weapon_controller.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-07"
        directiveTitle="CLASSIFIED DIRECTIVE // WEAPON INTERACTION"
        directiveText={
          <>
            Configure weapon safety modes to test target relays.
            <br />
            Ensure credentials authorization signature is applied.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="LOCKED"
        radarSublabel="WEAPON RELAY CONTROLLER"
        bottomBarText="CAUTION: WEAPON CONTROLLER SECURED"
        bottomBarSerial="#8409-WEAPON"
        wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1.5 mb-2 font-bold select-none">
              // WEAPON CONFIGURATION SELECTOR
            </div>

            <div className="space-y-2 font-mono text-xs text-[#3c663a]">
              <p>MODEL : <span className="text-[#33ff66] font-bold">AK47</span></p>
              <p>RECOVERY MODE : <span className="text-[#33ff66] font-bold">ACTIVE</span></p>
              <p>STATE : <span className={`font-bold ${activated ? "text-[#33ff66]" : "text-[#ff3333]"}`}>{activated ? "ONLINE" : "DISABLED"}</span></p>
            </div>

            {/* AK47 Image */}
            <div className="flex justify-center items-center py-4 select-none">
              <motion.img
                src="/images/ak47.png"
                alt="AK47"
                className={`w-64 object-contain transition-all duration-500 ${activated ? "" : "opacity-30 grayscale"}`}
                animate={{ scale: activated ? 1.04 : 1 }}
              />
            </div>

            {/* Selector */}
            <div className="flex flex-col items-center gap-2 select-none">
              <span className="text-[9px] text-[#3c663a] uppercase font-bold tracking-widest">SAFETY SELECTOR</span>
              <button
                onClick={handleModeChange}
                className="w-full border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] py-3 font-mono font-bold tracking-widest uppercase cursor-pointer text-xs"
              >
                {activated ? "WEAPON ONLINE" : `MODE : ${MODES[modeIndex]}`}
              </button>
            </div>

            {/* Logs on activated */}
            {activated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#170809]/90 border border-[#ff3333]/30 p-3 font-mono text-[10px] text-[#ff3333] space-y-2"
              >
                <p className="font-bold">// AUTHENTICATION REJECTED</p>
                <p>Weapon system online but locked by high-level authority gateway check. Recovery key authorization required.</p>
                <button
                  onClick={() => {
                    synth.playClick();
                    router.push("/final-authorization/authorization");
                  }}
                  className="mt-1 border border-[#ff3333] text-[#ff3333] bg-transparent hover:bg-[#ff3333] hover:text-black font-mono text-xs font-bold py-1.5 px-3 uppercase transition-all duration-200 cursor-pointer"
                >
                  ENTER RECOVERY KEY
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}