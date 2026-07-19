"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Terminal, CheckCircle2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useRouter } from "next/navigation";

export default function CoreRecoveryPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [masterKey, setMasterKey] = useState("");
  const { playSound } = useAudio();
  const router = useRouter();

  useEffect(() => {
    const sequence = [
      "CORE_RECOVERY.EXE",
      "Loading...",
      "██████████ 100%",
      "SYSTEM REPORT",
      "Recovery Records Found.",
      "Integrity Check : FAILED",
      "",
      "You already solved it.",
      "You just don't know it yet.",
      "The Core accepts only those",
      "who remember."
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        setTerminalLines((prev) => [...prev, sequence[i]]);
        playSound("typing");
        i++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [playSound]);

  const handleSubmit = async () => {
    if (!masterKey.trim()) return;
    
    playSound("typing");
    
    try {
      const response = await fetch("/api/core-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterKey })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTerminalLines((prev) => [...prev, "Master Key Accepted.", "Initializing Core..."]);
        setTimeout(() => {
          router.push("/core-vault/success");
        }, 1500);
      } else {
        setTerminalLines((prev) => [...prev, `ERROR: ${data.message || "Validation Failed"}`]);
        setMasterKey("");
      }
    } catch (error) {
      setTerminalLines((prev) => [...prev, "ERROR: Connection to Core failed."]);
    }
  };

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* Left Terminal */}

        <div className="flex-1 glass-panel flex flex-col overflow-hidden">

          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm tracking-wider text-secondary-text">
              CORE_RECOVERY.EXE
            </span>
          </div>

          <div className="flex-1 p-6 space-y-3 font-mono text-sm">

            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${line?.includes("FAILED") ? "text-danger" : ""}
                  ${line === "SYSTEM REPORT" ? "text-primary font-bold" : ""}
                  ${line?.includes("remember") ? "text-primary" : ""}
                  ${line === "" ? "h-3" : ""}
                `}
              >
                {line !== "" && `> ${line}`}
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block ml-2 w-2.5 h-4 bg-primary"
            />

            <div className="pt-8 space-y-4">

              <p className="font-mono text-secondary-text">
                Master Recovery Key
              </p>

              <input
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="Enter Recovery Key..."
                className="w-full bg-transparent border border-border px-4 py-3 font-mono text-text outline-none focus:border-primary"
              />

              <button
                onClick={handleSubmit}
                className="w-full border border-primary text-primary py-3 font-mono hover:bg-primary hover:text-background transition-all duration-300"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

        {/* Right Panel */}

        <div className="lg:w-80 flex flex-col gap-4">

          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
            Recovery Status
          </h2>

          <StatusCard title="Authentication" status="RECOVERED" />
          <StatusCard title="Repository" status="RECOVERED" />
          <StatusCard title="Gateway" status="RECOVERED" />
          <StatusCard title="Puzzle" status="RECOVERED" />
          <StatusCard title="Core" status="AWAITING" locked />

        </div>

      </div>
    </PageTransition>
  );
}

function StatusCard({
  title,
  status,
  locked = false,
}: {
  title: string;
  status: string;
  locked?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex justify-between items-center border ${
        locked
          ? "border-border"
          : "border-primary/30 bg-primary/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {locked ? (
          <Lock size={18} className="text-secondary-text" />
        ) : (
          <CheckCircle2 size={18} className="text-primary" />
        )}

        <span className="font-mono text-sm text-text">
          {title}
        </span>
      </div>

      <span
        className={`font-mono text-xs px-2 py-1 rounded ${
          locked
            ? "bg-surface text-secondary-text"
            : "bg-primary/20 text-primary"
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
}