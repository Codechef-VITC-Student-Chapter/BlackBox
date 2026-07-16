"use client";

import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { useRef, useEffect } from "react";

interface TerminalProps {
  lines: string[];
  isComplete?: boolean;
}

export function Terminal({ lines, isComplete = false }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when lines change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineClassName = (line: string) => {
    if (line.includes("FAILED") || line.includes("ERROR") || line.includes("UNREADABLE")) {
      return "text-danger";
    }
    if (
      line.includes("Verified") ||
      line.includes("Restored") ||
      line.includes("Complete") ||
      line.includes("Synchronized") ||
      line.includes("Accepted")
    ) {
      return "text-success";
    }
    if (line.includes("OVERRIDE") || line.includes("BYPASS") || line.includes("INJECTED")) {
      return "text-warning";
    }
    return "text-primary";
  };

  return (
    <div className="flex-1 glass-panel flex flex-col overflow-hidden relative min-h-[400px]">
      {/* Terminal Title Bar */}
      <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3 select-none">
        <TerminalIcon size={18} className="text-secondary-text" />
        <span className="font-mono text-sm text-secondary-text tracking-wider">REPO_RECOVERY.EXE</span>
      </div>

      {/* Terminal Content Panel */}
      <div 
        ref={containerRef}
        className="p-6 font-mono text-sm space-y-3 flex-1 overflow-y-auto no-scrollbar scroll-smooth"
      >
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={getLineClassName(line)}
          >
            {`> ${line}`}
          </motion.div>
        ))}

        {/* Blinking Cursor */}
        {!isComplete && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2.5 h-4 bg-primary inline-block ml-2 align-middle"
          />
        )}
      </div>

      {/* Terminal Footer Info */}
      <div className="p-6 border-t border-border bg-surface/30">
        <p className="font-mono text-secondary-text text-sm">
          Everything you need <br />
          is already here. <br />
          <span className="text-text mt-2 block">Look closer.</span>
        </p>
      </div>
    </div>
  );
}
