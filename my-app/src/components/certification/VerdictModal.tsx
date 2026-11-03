"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
  Loader2,
} from "lucide-react";

interface VerdictModalProps {
  open: boolean;
  verdict:
    | "Accepted"
    | "Wrong Answer"
    | "Compilation Error"
    | "Runtime Error"
    | "Time Limit Exceeded"
    | "Pending";
  passed?: number;
  total?: number;
  onClose: () => void;
}

export default function VerdictModal({
  open,
  verdict,
  passed = 0,
  total = 0,
  onClose,
}: VerdictModalProps) {
  const getStatus = () => {
    switch (verdict) {
      case "Accepted":
        return {
          icon: <CheckCircle2 size={50} />,
          color: "text-primary",
          border: "border-primary/40",
          message:
            "All test cases passed successfully.",
        };

      case "Wrong Answer":
        return {
          icon: <XCircle size={50} />,
          color: "text-danger",
          border: "border-danger/40",
          message:
            "Your output did not match the expected result.",
        };

      case "Compilation Error":
        return {
          icon: <AlertTriangle size={50} />,
          color: "text-yellow-400",
          border: "border-yellow-400/40",
          message:
            "Compilation failed. Check your syntax.",
        };

      case "Runtime Error":
        return {
          icon: <AlertTriangle size={50} />,
          color: "text-orange-400",
          border: "border-orange-400/40",
          message:
            "Program terminated unexpectedly.",
        };

      case "Time Limit Exceeded":
        return {
          icon: <Clock3 size={50} />,
          color: "text-blue-400",
          border: "border-blue-400/40",
          message:
            "Execution exceeded the time limit.",
        };

      default:
        return {
          icon: (
            <Loader2
              size={50}
              className="animate-spin"
            />
          ),
          color: "text-secondary-text",
          border: "border-border",
          message: "Evaluating submission...",
        };
    }
  };

  const status = getStatus();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: 0.85,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.85,
              opacity: 0,
            }}
            className={`glass-panel w-[520px] border ${status.border} overflow-hidden`}
          >
            {/* Header */}

            <div className="border-b border-border bg-surface/40 p-4 font-mono tracking-widest text-secondary-text">
              BLACKBOX JUDGE
            </div>

            {/* Body */}

            <div className="p-8 text-center">

              <div
                className={`${status.color} flex justify-center mb-6`}
              >
                {status.icon}
              </div>

              <h2
                className={`font-heading text-3xl uppercase tracking-wider ${status.color}`}
              >
                {verdict}
              </h2>

              <p className="font-mono text-secondary-text mt-5 leading-7">
                {status.message}
              </p>

              <div className="glass-panel mt-8 p-4 font-mono">

                <div className="flex justify-between mb-3">
                  <span>Passed Testcases</span>

                  <span className="text-primary">
                    {passed} / {total}
                  </span>
                </div>

                <div className="w-full bg-surface rounded-full h-2">

                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${total === 0 ? 0 : (passed / total) * 100}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="border-t border-border bg-surface/40 p-5 flex justify-end">

              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-black rounded font-bold hover:brightness-110 transition"
              >
                Close
              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}