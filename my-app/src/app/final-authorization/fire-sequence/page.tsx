"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { Crosshair } from "lucide-react";
import { synth } from "@/utils/synthAudio";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "COMPLETE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
  { title: "Final Authorization", status: "ACTIVE", modId: "MOD-07", serial: "SN:84-F7", iconType: "final" },
];

export default function FireSequencePage() {
  const router = useRouter();
  const [fired, setFired] = useState(false);
  const [complete, setComplete] = useState(false);

  function fireWeapon() {
    if (fired) return;
    setFired(true);
    synth.playClick();
    synth.playError(); // Mock gunshot sound frequency

    setTimeout(() => {
      setComplete(true);
    }, 2500);

    setTimeout(() => {
      router.push("/final-authorization/success");
    }, 6000);
  }

  return (
    <PageTransition>
      <BlackboxShell
<<<<<<< HEAD
        moduleCode="MOD-06"
=======
        moduleCode="MOD-07"
>>>>>>> upstream/main
        exeName="FIRE_SEQUENCE.EXE"
        terminalLabel="WEAPON SYSTEM OVERRIDE"
        maintenanceSeal="#4097"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="weapon_discharge.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-07"
        directiveTitle="CLASSIFIED DIRECTIVE // DISCHARGE"
        directiveText={
          <>
            Click inside the crosshair sector bounds to deploy weapon payload.
            <br />
            Warning: Discharge causes local firewall node corruption.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="DEPLOYING"
        radarSublabel="WEAPON INTERACTION"
        bottomBarText="WARNING: WEAPON DISCHARGE IMMINENT"
        bottomBarSerial="#8409-FIRE"
        wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
        compactStatus={true}
      >
        <div 
          onClick={fireWeapon}
          className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#030703] border border-[#1a2d1d] cursor-crosshair rounded select-none ${
            fired ? "animate-shake" : ""
          }`}
        >
          {/* Firing Shake style */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shake {
              0%, 100% { transform: translate(0, 0); }
              10%, 30%, 50%, 70%, 90% { transform: translate(-3px, -3px); }
              20%, 40%, 60%, 80% { transform: translate(3px, 3px); }
            }
            .animate-shake {
              animation: shake 0.4s ease-in-out;
            }
          `}} />

          {/* Crosshair */}
          {!fired && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute text-[#33ff66] opacity-80"
            >
              <Crosshair size={72} strokeWidth={1.5} />
            </motion.div>
          )}

          {/* Firewall */}
          <AnimatePresence>
            {!complete && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={fired ? { scale: 0, opacity: 0, rotate: 20 } : {}}
                transition={{ duration: 1.2 }}
                className="absolute w-52 h-52 border border-[#33ff66]/40 bg-[#040e04]/80 flex items-center justify-center"
              >
                <div className="text-[#33ff66] font-mono tracking-widest text-xs font-bold uppercase">
                  DIGITAL FIREWALL
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Muzzle Flash */}
          <AnimatePresence>
            {fired && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-24 h-24 rounded-full bg-white"
              />
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute text-center font-mono space-y-4 p-4"
              >
                <p className="text-[#ff3333] text-lg font-bold tracking-widest drop-shadow-[0_0_8px_#ff3333] uppercase">
                  FIREWALL SHATTERED
                </p>

                <div className="text-[#3c663a] text-xs space-y-1">
                  <p>Round Expended.</p>
                  <p>1 / 1</p>
                  <p>Weapon Locked.</p>
                  <p className="text-[#33ff66] font-bold">Mission Complete.</p>
                </div>

                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="pt-2 text-[#33ff66] text-xs font-bold"
                >
                  TRANSMITTING DATA CLUSTER...
                  <br />
                  ████████████████
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click to fire label */}
          {!fired && (
            <div className="absolute bottom-6 text-[#3c663a] font-mono text-xs font-bold tracking-widest animate-pulse">
              CLICK TO EXECUTE PAYLOAD
            </div>
          )}
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}