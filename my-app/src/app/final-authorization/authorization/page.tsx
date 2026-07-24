"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { Lock, Unlock, AlertTriangle, CheckCircle2 } from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "COMPLETE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
  { title: "Final Authorization", status: "ACTIVE", modId: "MOD-07", serial: "SN:84-F7", iconType: "final" },
];

export default function AuthorizationPage() {
  const router = useRouter();

  const [recoveryKey, setRecoveryKey] = useState("");
  const [engineerId, setEngineerId] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);

  function verifyRecoveryKey() {
    synth.playClick();
    const regex = /^BLACKBOX\d{8}$/;

    if (!regex.test(recoveryKey)) {
      synth.playError();
      setMessage("INVALID RECOVERY KEY FORMAT");
      return;
    }

    const datePart = recoveryKey.substring(8);
    const year = Number(datePart.substring(0, 4));
    const month = Number(datePart.substring(4, 6));
    const day = Number(datePart.substring(6, 8));

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      synth.playError();
      setMessage("INVALID DATE FORMAT");
      return;
    }

    synth.playSuccess();
    setMessage("PRIMARY AUTHORIZATION VERIFIED");
    setStep(2);
  }

  async function verifyEngineerId() {
    synth.playClick();
    if (!engineerId) {
      synth.playError();
      setMessage("ENGINEER ID REQUIRED");
      return;
    }

    // backend placeholder
    const backendVerified = true;

    if (backendVerified) {
      synth.playSuccess();
      setAuthorized(true);
      setMessage("FINAL AUTHORIZATION GRANTED");
    } else {
      synth.playError();
      setMessage("ENGINEER ID VERIFICATION FAILED");
    }
  }

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-07"
        exeName="GATEWAY_AUTH.EXE"
        terminalLabel="CREDENTIAL AUTHENTICATOR"
        maintenanceSeal="#4097"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="credentials_gate.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-07"
        directiveTitle="CLASSIFIED DIRECTIVE // DOUBLE HANDSHAKE"
        directiveText={
          <>
            Gateway security relies on verification check.
            <br />
            Phase 1: Enter recovery key. Phase 2: Verify Engineer identifier.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="DECRYPTING"
        radarSublabel="HANDSHAKE GATEWAY"
        bottomBarText="CAUTION: MULTI-FACTOR AUTHORIZATION ACTIVE"
        bottomBarSerial="#8409-MFA"
        wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
        compactStatus={true}
      >
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#1a2d1d] pb-1.5 mb-2 font-bold select-none">
              // MFA CONTROL GATES [STEP {step}/2]
            </div>

            {/* Notification logs */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 font-mono text-[10px] border flex items-center gap-2 ${
                    message.includes("VERIFIED") || message.includes("GRANTED")
                      ? "bg-[#061006]/90 border-[#33ff66]/30 text-[#33ff66]"
                      : "bg-[#170809]/90 border-[#ff3333]/30 text-[#ff3333]"
                  }`}
                >
                  {message.includes("VERIFIED") || message.includes("GRANTED") ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <AlertTriangle size={13} />
                  )}
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 1: Recovery Key */}
            {step === 1 && (
              <div className="space-y-4 font-mono">
                <div className="space-y-2">
                  <label htmlFor="recovery-key-input" className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                    RECOVERY KEY (FORMAT: BLACKBOX[YYYYMMDD])
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                    <input
                      id="recovery-key-input"
                      type="text"
                      value={recoveryKey}
                      onChange={(e) => {
                        setRecoveryKey(e.target.value);
                        setMessage("");
                      }}
                      placeholder="ENTER RECOVERY KEY"
                      className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase tracking-widest"
                    />
                  </div>
                </div>

                <button
                  onClick={verifyRecoveryKey}
                  className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-3.5 hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 uppercase cursor-pointer text-xs"
                >
                  VERIFY PRIMARY LOCK
                </button>
              </div>
            )}

            {/* STEP 2: Engineer ID */}
            {step === 2 && !authorized && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 font-mono"
              >
                <div className="bg-[#040e04] border border-[#1a2d1d] p-3 text-[10px] text-[#3c663a] space-y-1">
                  <p className="text-[#33ff66] font-bold block uppercase tracking-wider">// PRIMARY AUTHORIZED</p>
                  <p>Primary authorization validated. Access lock sequence requires secondary Engineer identification.</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#3c663a] uppercase font-bold block">RECOVERY SIGNATURE</span>
                  <div className="bg-[#030703] border border-[#1a2d1d] p-2 text-xs text-[#33ff66] truncate">{recoveryKey}</div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="engineer-id-input" className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                    ENGINEER IDENTIFICATION NUMBER
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                    <input
                      id="engineer-id-input"
                      type="text"
                      value={engineerId}
                      onChange={(e) => {
                        setEngineerId(e.target.value);
                        setMessage("");
                      }}
                      placeholder="ENTER ENGINEER ID"
                      className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase tracking-widest"
                    />
                  </div>
                  <span className="text-[8px] text-[#3c663a] block">Expected syntax: &lt;RecoveryKey&gt;-&lt;EngineerID&gt;</span>
                </div>

                <button
                  onClick={verifyEngineerId}
                  className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-3.5 hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 uppercase cursor-pointer text-xs"
                >
                  AUTHORIZE SECONDARY LOCK
                </button>
              </motion.div>
            )}

            {/* AUTHORIZED SUCCESS */}
            {authorized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 font-mono text-xs text-[#3c663a] leading-relaxed"
              >
                <div className="bg-[#040e04] border border-[#1a2d1d] p-4 rounded space-y-3">
                  <div>
                    <span className="text-[#33ff66] font-bold block uppercase tracking-wider">// SYSTEM CLEARED</span>
                    Welcome back, Engineer. Double handshake verified successfully. Final authorization codes granted.
                  </div>
                  <div className="text-[9px] space-y-0.5">
                    <p>RECOVERY KEY ........ VERIFIED</p>
                    <p>ENGINEER ID ........ VERIFIED</p>
                    <p>WEAPON SYSTEM ...... UNLOCKED</p>
                    <p className="text-white font-bold">Awaiting fire command payload initialization...</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    synth.playClick();
                    synth.playSuccess();
                    router.push("/final-authorization/fire-sequence");
                  }}
                  className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-4 hover:shadow-[0_0_15px_#33ff66] transition-all duration-300 uppercase cursor-pointer text-sm animate-pulse"
                >
                  INITIALIZE FIRE SEQUENCE
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}