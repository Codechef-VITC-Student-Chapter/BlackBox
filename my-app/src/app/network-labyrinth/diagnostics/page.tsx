"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";

const SCAN_LINES = [
  "Initializing network probe...",
  "Establishing packet capture...",
  "Routing diagnostic requests...",
  "Analyzing response signatures...",
  "Correlating traffic patterns...",
  "Diagnostics complete.",
];

const ENDPOINTS = [
  "/api/network-labyrinth/status",
  "/api/network-labyrinth/network",
  "/api/network-labyrinth/services",
  "/api/network-labyrinth/health",
  "/api/network-labyrinth/internal",
  "/api/network-labyrinth/recovery",
];

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "ACTIVE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "LOCKED", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "LOCKED", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
];

interface ResponseInfo {
  status: number | "PENDING" | "FAILED";
  headers?: Record<string, string>;
  body?: string;
}

export default function DiagnosticsPage() {
  const router = useRouter();
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [responses, setResponses] = useState<Record<string, ResponseInfo>>({});

  const runProbes = () => {
    synth.playClick();
    setDone(false);
    setLineIndex(0);
    setScanPct(0);
    
    // Initialize status
    const initialResponses: Record<string, ResponseInfo> = {};
    ENDPOINTS.forEach(url => {
      initialResponses[url] = { status: "PENDING" };
    });
    setResponses(initialResponses);

    // Staggered fetches
    ENDPOINTS.forEach((url, i) => {
      setTimeout(async () => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const headers: Record<string, string> = {};
          res.headers.forEach((val, key) => {
            headers[key] = val;
          });

          setResponses(prev => ({
            ...prev,
            [url]: { status: res.status, headers, body: text.slice(0, 120) }
          }));

          if (res.status === 200) synth.playSuccess();
          else if (res.status === 403) synth.playError();
          else synth.playClick();
        } catch {
          setResponses(prev => ({
            ...prev,
            [url]: { status: "FAILED" }
          }));
          synth.playError();
        }
      }, i * 420);
    });

    // Animate scanning progress logs
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setLineIndex(idx);
      setScanPct(Math.round((idx / (SCAN_LINES.length - 1)) * 100));
      if (idx >= SCAN_LINES.length - 1) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 600);
      }
    }, 900);
  };

  // Run probes on mount
  useEffect(() => {
    runProbes();
  }, []);

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-03"
        exeName="GATEWAY_PROBE.EXE"
        terminalLabel="NETWORK DIAGNOSTIC ENGINE"
        maintenanceSeal="#4093"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="diagnostics_sweep.log"
        baudRate="1200 BAUD"
        ttyNumber="TTY-03"
        directiveTitle="CLASSIFIED DIRECTIVE // DIAGNOSTICS"
        directiveText={
          <>
            Gateway probes sweep the available endpoints for signals.
            <br />
            Inspect response headers and status codes via network logs.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="PROBING"
        radarSublabel="GATEWAY SWEEP"
        bottomBarText="CAUTION: NETWORK TRAFFIC MONITORED"
        bottomBarSerial="#8409-DIAG"
        wallStencil="CONTROL ROOM 04 // GATEWAY SECTOR"
      >
        {/* Probe Logs Terminal output */}
        <div className="max-h-36 overflow-y-auto mb-4 border-b border-[#122414] pb-4 flex-shrink-0 space-y-1 text-xs">
          {SCAN_LINES.slice(0, lineIndex + 1).map((line, i) => (
            <p key={i} className="text-[#3c663a]">
              &gt; <span className={i === lineIndex && !done ? "text-[#33ff66]" : ""}>{line}</span>
            </p>
          ))}
        </div>

        {/* Diagnostic Response cards grid */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#264c23] uppercase tracking-widest border-b border-[#112211] pb-1">
              <span>// API RESULT RACKS</span>
              <span>{scanPct}%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ENDPOINTS.map((url) => {
                const info = responses[url] || { status: "PENDING" };
                const isPending = info.status === "PENDING";
                const isFailed = info.status === "FAILED";
                const is200 = info.status === 200;
                const is403 = info.status === 403;

                return (
                  <div key={url} className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-3 font-mono text-[10px] flex flex-col justify-between gap-1.5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-[#33ff66] font-bold truncate max-w-[150px]">{url.replace("/api/network-labyrinth/", "")}</span>
                      <span className={`px-1.5 py-0.5 border text-[8px] uppercase tracking-widest ${
                        is200 ? "border-[#33ff66] text-[#33ff66] bg-[#0c1e0b]" :
                        is403 ? "border-[#ff3333] text-[#ff3333] bg-[#3a0c0e]" :
                        isPending ? "border-[#f59e0b] text-[#f59e0b] bg-[#1a1408] animate-pulse" :
                        "border-[#ff3333] text-[#ff3333]"
                      }`}>
                        {info.status}
                      </span>
                    </div>

                    {!isPending && !isFailed && info.headers && (
                      <div className="text-[9px] space-y-0.5">
                        {info.headers["x-node-id"] && (
                          <div className="text-[#f59e0b] truncate">X-Node-Id: {info.headers["x-node-id"]}</div>
                        )}
                        {info.headers["x-restricted-fragment"] && (
                          <div className="text-[#f59e0b] truncate">X-Restricted-Fragment: {info.headers["x-restricted-fragment"]}</div>
                        )}
                        {info.body && (
                          <div className="text-[#33ff66] truncate">Body: {info.body}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#1a2d1d]">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={runProbes}
                disabled={!done}
                className="flex-1 border border-[#33ff66] text-[#33ff66] bg-transparent hover:bg-[#33ff66] hover:text-black transition-all duration-300 font-mono tracking-widest py-2.5 text-xs font-bold uppercase cursor-pointer text-center"
              >
                TRIGGER PROBES
              </button>
              {done && (
                <>
                  <button
                    onClick={() => router.push("/network-labyrinth/logs")}
                    className="flex-1 border border-[#1a2d1d] text-[#3c663a] bg-transparent hover:border-[#33ff66] hover:text-[#33ff66] transition-all duration-300 font-mono tracking-widest py-2.5 text-xs font-bold uppercase cursor-pointer text-center"
                  >
                    OPEN ACTIVITY LOGS
                  </button>
                  <button
                    onClick={() => router.push("/network-labyrinth/submit-key")}
                    className="flex-1 border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.6)] transition-all duration-300 font-mono tracking-widest py-2.5 text-xs font-bold uppercase cursor-pointer text-center animate-pulse"
                  >
                    SUBMIT RECOVERY KEY
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}
