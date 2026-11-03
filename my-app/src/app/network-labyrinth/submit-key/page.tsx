"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useModuleGuard } from "@/hooks/useModuleGuard";

const FRAGMENT_COUNT = 4;

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

export default function GatewayRecoveryPage() {
  useModuleGuard(3);
  const router = useRouter();
  const [fragments, setFragments] = useState<string[]>(Array(FRAGMENT_COUNT).fill(""));
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFragment = (i: number, val: string) => {
    const next = [...fragments];
    next[i] = val.toUpperCase();
    setFragments(next);
  };

  const handleSubmit = async () => {
    if (!key.trim()) {
      setErrorMsg("Recovery key cannot be empty.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/network-labyrinth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim(), fragments }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setStatus("success");
        synth.playSuccess();
        setTimeout(() => router.push("/network-labyrinth/success"), 1200);
      } else {
        setStatus("error");
        synth.playError();
        setErrorMsg(data.message ?? "Invalid Recovery Key.");
      }
    } catch {
      setStatus("error");
      synth.playError();
      setErrorMsg("Connection error. Try again.");
    }
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="FRAGMENT_SUBMIT.EXE"
        terminalLabel="KEY FRAGMENT ASSEMBLER"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="gateway_rebuild.out"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        directiveTitle="CLASSIFIED DIRECTIVE // KEY ASSEMBLY"
        directiveText={
          <>
            Gateway recovery requires assembling the 4 fragments.
            <br />
            Ensure fragments and master recovery key signatures align.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="ASSEMBLING"
        radarSublabel="KEY VALIDATOR"
        bottomBarText="CAUTION: FRAGMENT INTEGRITY CHECK ACTIVE"
        bottomBarSerial="#8409-NETKEY"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#1a2d1d] pb-1.5 mb-2 font-bold select-none">
              // RECOVERED GATEWAY KEY FRAGMENTS
            </div>

            {/* Fragment inputs */}
            <div className="grid grid-cols-2 gap-3">
              {fragments.map((frag, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                    FRAGMENT {i + 1}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                    <input
                      id={`fragment-${i + 1}`}
                      type="text"
                      maxLength={24}
                      value={frag}
                      onChange={(e) => handleFragment(i, e.target.value)}
                      placeholder="________"
                      className="w-full bg-transparent border-b border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none caret-[#33ff66] placeholder-[#264c23] py-1 pl-7 uppercase tracking-wider"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Combined Key Preview */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold">
                COMBINED FRAGMENT PREVIEW
              </span>
              <div className="bg-[#030703] border border-[#1a2d1d] p-3 font-mono text-[#33ff66] text-xs tracking-widest min-h-[36px] select-all truncate">
                {fragments.join("") || "[NO FRAGMENTS DETECTED]"}
              </div>
            </div>

            {/* Recovery key input */}
            <div className="space-y-2 pt-2">
              <label
                htmlFor="recovery-key"
                className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold"
              >
                GATEWAY RECOVERY KEY
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-[#3c663a] font-bold">&gt;_</span>
                <input
                  id="recovery-key"
                  type="text"
                  value={key}
                  onChange={(e) => { setKey(e.target.value); setStatus("idle"); }}
                  placeholder="ENTER FULL RECOVERY KEY Signature"
                  className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Feedback messages */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 font-mono text-xs text-[#ff3333]"
                >
                  <AlertTriangle size={13} />
                  {errorMsg}
                </motion.div>
              )}
              {status === "success" && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs text-[#33ff66]"
                >
                  ✓ &nbsp;Recovery Key Accepted — redirecting...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-[#1a2d1d] flex justify-end select-none">
            {status === "loading" ? (
              <div className="flex items-center gap-2 font-mono text-xs text-[#3c663a] py-2">
                <Loader2 size={14} className="animate-spin text-[#33ff66]" />
                VALIDATING ASSEMBLER SIGNATURE...
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full border border-[#33ff66] text-black bg-[#33ff66] font-mono font-bold tracking-widest py-3.5 hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 uppercase cursor-pointer text-xs"
              >
                SUBMIT GATEWAY KEY
              </button>
            )}
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
