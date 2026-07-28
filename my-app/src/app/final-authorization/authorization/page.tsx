"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, {
  StatusCardInfo,
} from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const STATUS_CARDS: StatusCardInfo[] = [
  {
    title: "Authentication",
    status: "COMPLETE",
    modId: "MOD-01",
    serial: "SN:84-A1",
    iconType: "auth",
  },
  {
    title: "Repository",
    status: "COMPLETE",
    modId: "MOD-02",
    serial: "SN:84-R2",
    iconType: "repo",
  },
  {
    title: "Network",
    status: "COMPLETE",
    modId: "MOD-03",
    serial: "SN:84-N3",
    iconType: "net",
  },
  {
    title: "Visual/Puzzle",
    status: "COMPLETE",
    modId: "MOD-04",
    serial: "SN:84-V4",
    iconType: "puzzle",
  },
  {
    title: "Core Vault",
    status: "COMPLETE",
    modId: "MOD-05",
    serial: "SN:84-C5",
    iconType: "vault",
  },
  {
    title: "Final Authorization",
    status: "ACTIVE",
    modId: "MOD-06",
    serial: "SN:84-F6",
    iconType: "final",
  },
  {
    title: "Certification",
    status: "LOCKED",
    modId: "MOD-07",
    serial: "SN:84-E7",
    iconType: "cert",
  },
];

export default function AuthorizationPage() {
  const [submission, setSubmission] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function authorizeGateway() {
    synth.playClick();

    if (!submission.trim()) {
      synth.playError();
      setSuccess(false);
      setMessage("RECOVERY SUBMISSION REQUIRED");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/final-authorization/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          submission: submission.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        synth.playError();
        setSuccess(false);
        setMessage(data.message ?? "AUTHORIZATION FAILED");
        return;
      }

      synth.playSuccess();

      setSuccess(true);
      setMessage("FINAL AUTHORIZATION GRANTED");
    } catch {
      synth.playError();
      setSuccess(false);
      setMessage("NETWORK FAILURE");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
  <BlackboxShell
    moduleCode="MOD-06"
    exeName="GATEWAY_AUTH.EXE"
    terminalLabel="FINAL AUTHORIZATION"
    maintenanceSeal="#4097"
    pwrLight="green"
    errLight="red"
    errLabel="ERR"
    terminalHeaderExe="credentials_gate.log"
    baudRate="9600 BAUD"
    ttyNumber="TTY-06"
    directiveTitle="CLASSIFIED DIRECTIVE // FINAL AUTHORIZATION"
    directiveText={
      <>
        Submit the complete recovery sequence to verify your
        identity.
        <br />
        Recovery format:
        <span className="text-[#33ff66]">
          {" "}
          RECOVERYKEY-ENGINEERID
        </span>
      </>
    }
    statusLabel="SYSTEM STATUS"
    statusCards={STATUS_CARDS}
    radarLabel="AUTHORIZING"
    radarSublabel="FINAL GATEWAY"
    bottomBarText="ENGINEER AUTHORIZATION REQUIRED"
    bottomBarSerial="#8409-FINAL"
    wallStencil="CONTROL ROOM 04 // GATEWAY CENTER"
    compactStatus
  >
    <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">

      <div className="space-y-4">

        <div className="text-[10px] text-[#3c663a] uppercase tracking-widest border-b border-[#1a2d1d] pb-1.5 mb-2 font-bold select-none">
          // FINAL AUTHORIZATION TERMINAL
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 font-mono text-[10px] border flex items-center gap-2 ${
                success
                  ? "bg-[#061006]/90 border-[#33ff66]/30 text-[#33ff66]"
                  : "bg-[#170809]/90 border-[#ff3333]/30 text-[#ff3333]"
              }`}
            >
              {success ? (
                <CheckCircle2 size={13} />
              ) : (
                <AlertTriangle size={13} />
              )}

              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[#040e04] border border-[#1a2d1d] p-3 text-[10px] text-[#3c663a] space-y-1">

          <p className="text-[#33ff66] font-bold uppercase tracking-wider">
            // AUTHORIZATION NOTICE
          </p>

          <p>
            Enter the complete recovery submission exactly as
            recovered from the previous modules.
          </p>

          <p className="text-[#5cff7f]">
            FORMAT:
          </p>

          <p className="text-white">
            BLACKBOXYYYYMMDD-ENGINEERID
          </p>

        </div>

        <div className="space-y-2">

          <label
            htmlFor="submission-input"
            className="text-[10px] text-[#3c663a] uppercase tracking-widest block font-bold"
          >
            RECOVERY SUBMISSION
          </label>

          <div className="relative flex items-center">

            <span className="absolute left-0 text-[#3c663a] font-bold">
              &gt;_
            </span>

            <input
              id="submission-input"
              type="text"
              value={submission}
              onChange={(e) => {
                setSubmission(e.target.value.toUpperCase());
                setMessage("");
              }}
              placeholder="BLACKBOX20260729-ENG12345"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent border-b-2 border-[#33ff66] text-[#33ff66] font-mono text-sm outline-none caret-[#33ff66] placeholder-[#264c23] py-2 pl-7 uppercase tracking-widest"
            />

          </div>

        </div>

        <button
          disabled={submitting}
          onClick={authorizeGateway}
          className="
            w-full
            border
            border-[#33ff66]
            bg-[#33ff66]
            text-black
            font-mono
            font-bold
            tracking-widest
            py-3.5
            text-xs
            uppercase
            transition-all
            duration-300
            hover:shadow-[0_0_12px_rgba(51,255,102,0.6)]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {submitting
            ? "VERIFYING AUTHORIZATION..."
            : "AUTHORIZE GATEWAY"}
        </button>
                {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#040e04] border border-[#1a2d1d] p-4 rounded space-y-3 font-mono text-xs text-[#3c663a]"
          >
            <span className="text-[#33ff66] font-bold block uppercase tracking-wider">
              // AUTHORIZATION COMPLETE
            </span>

            <p>
              Recovery submission accepted.
            </p>

            <div className="text-[9px] space-y-1">
              <p>RECOVERY KEY ........ VERIFIED</p>
              <p>ENGINEER ID ........ VERIFIED</p>
              <p>MODULE STATUS ...... COMPLETE</p>
              <p>NEXT MODULE ........ ENGINEER CERTIFICATION</p>
            </div>

            <p className="text-[#33ff66] animate-pulse">
              Redirecting to Engineer Certification...
            </p>
          </motion.div>
        )}

      </div>
    </div>
  </BlackboxShell> 
</PageTransition>
);
}
