"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Terminal,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useRouter } from "next/navigation";

export default function CoreVaultPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  // NEW: State and ref for the hidden input
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { playSound } = useAudio();
  const router = useRouter();

  // Keep the input focused automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const sequence = [
      "Checking recovered subsystems...",
      "Loading recovery status...",
      "Security Clearance Verified",
      "██████████ 100%",
      "CORE STATUS : OFFLINE",
      "Recovery Required"
    ];

    let i = 0;

    const interval = setInterval(() => {
      if (i < sequence.length) {
        const line = sequence[i];
        setTerminalLines((prev) => [...prev, line]);
        playSound("typing");
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSound]);

  // NEW: Handle user typing and hitting Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!command.trim()) return;

      if (command.toLowerCase() === "recover") {
        // If they type 'recover', route them just like the button!
        router.push("/core-vault/submit-key");
      } else {
        // Otherwise, echo their command and show an error
        setTerminalLines((prev) => [
          ...prev, 
          command, 
          "ERR: Command not recognized. Try 'recover'."
        ]);
        setCommand("");
        playSound("error"); // Optional: play error sound if you have one
      }
    }
  };

  return (
    <PageTransition>
      <div className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8">

        {/* Left Terminal */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden">
          <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
            <Terminal
              size={18}
              className="text-secondary-text"
            />
            <span className="font-mono text-sm tracking-wider text-secondary-text">
              CORE_RECOVERY.EXE
            </span>
          </div>

          {/* NEW: Added onClick here to keep input focused if they click the terminal window */}
          <div 
            className="flex-1 p-6 space-y-3 font-mono text-sm cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {terminalLines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${line.includes("OFFLINE") || line.includes("ERR:")
                    ? "text-danger"
                    : "text-primary"
                  }`}
              >
                {`> ${line}`}
              </motion.div>
            ))}

            {/* NEW: The Interactive Command Line replacing the static cursor */}
            <div className="flex items-center text-primary mt-2">
              <span className="mr-2">{">"}</span>
              <span>{command}</span>
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block ml-1 w-2.5 h-4 bg-primary"
              />
            </div>

            {/* NEW: The Hidden Input Element */}
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="opacity-0 absolute -z-10"
              autoFocus
            />
          </div>

          <div className="border-t border-border bg-surface/30 p-6">
            <div className="font-mono text-sm space-y-2">
              <p className="text-secondary-text">
                Recovered Modules
              </p>
              <div className="space-y-1 text-text">
                <p>✓ Authentication</p>
                <p>✓ Repository</p>
                <p>✓ Gateway</p>
                <p>✓ CodeChef Puzzle</p>
                <p className="text-danger">
                  ✖ Core
                </p>
              </div>
            </div>

            <button
            type="button"
              onClick={() => router.push("/core-vault/submit-key")}
              className="mt-8 w-full border border-primary text-primary font-mono py-3 hover:bg-primary hover:text-background transition-all duration-300"
            >
              Recover Core
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-80 flex flex-col gap-4">
          <h2 className="font-heading text-lg uppercase tracking-widest text-secondary-text">
            System Status
          </h2>
          <StatusCard
            title="Authentication"
            status="ONLINE"
            success
          />
          <StatusCard
            title="Repository"
            status="ONLINE"
            success
          />
          <StatusCard
            title="Gateway"
            status="ONLINE"
            success
          />
          <StatusCard
            title="Puzzle"
            status="COMPLETE"
            success
          />
          <StatusCard
            title="Core"
            status="LOCKED"
          />
          <StatusCard
            title="Final Authorization"
            status="PENDING"
          />
        </div>
      </div>
    </PageTransition>
  );
}

function StatusCard({
  title,
  status,
  success = false,
}: {
  title: string;
  status: string;
  success?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex justify-between items-center border ${success
          ? "border-primary/30 bg-primary/5"
          : "border-border"
        }`}
    >
      <div className="flex items-center gap-3">
        {success ? (
          <CheckCircle2
            size={18}
            className="text-primary"
          />
        ) : (
          <Lock
            size={18}
            className="text-secondary-text"
          />
        )}
        <span className="font-mono text-sm text-text">
          {title}
        </span>
      </div>
      <span
        className={`font-mono text-xs px-2 py-1 rounded ${success
            ? "bg-primary/20 text-primary"
            : "bg-surface text-secondary-text"
          }`}
      >
        {status}
      </span>
    </motion.div>
  );
}