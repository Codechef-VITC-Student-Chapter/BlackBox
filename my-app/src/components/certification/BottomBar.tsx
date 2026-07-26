"use client";

import { motion } from "framer-motion";
import { Play, Send, Terminal, Loader2 } from "lucide-react";

interface BottomBarProps {
  consoleOutput: string[];
  isExecuting: boolean;
  onRunCode: () => void;
  onSubmit: () => void;
}

export default function BottomBar({ consoleOutput, isExecuting, onRunCode, onSubmit }: BottomBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel overflow-hidden mt-6"
    >
      {/* Header */}
      <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
        <Terminal size={18} className="text-secondary-text" />
        <span className="font-mono text-sm tracking-widest text-secondary-text">
          CONSOLE
        </span>
      </div>

      {/* Console Output */}
      <div className="bg-black h-36 overflow-y-auto p-5 font-mono text-sm space-y-2 whitespace-pre-wrap">
        {consoleOutput.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index * 0.1, 1) }}
            className={line.includes("Error") || line.includes("Exception") || line.includes("stderr:") ? "text-red-400" : "text-primary"}
          >
            {">"} {line}
          </motion.div>
        ))}

        {isExecuting && (
          <motion.div className="flex items-center gap-2 text-primary mt-2">
            <Loader2 size={14} className="animate-spin" />
            <span>Executing...</span>
          </motion.div>
        )}

        {!isExecuting && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-primary"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="border-t border-border bg-surface/40 p-5 flex justify-end gap-4">

        <motion.button
          onClick={onRunCode}
          disabled={isExecuting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-surface hover:border-primary transition-all font-mono text-sm disabled:opacity-50"
        >
          <Play size={17} />
          Run Code
        </motion.button>

        <motion.button
          onClick={onSubmit}
          disabled={isExecuting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-black font-bold hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Send size={17} />
          Submit
        </motion.button>

      </div>
    </motion.div>
  );
}