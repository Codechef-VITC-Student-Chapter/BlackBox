"use client";

import { motion } from "framer-motion";
import { Lock, XCircle, CheckCircle } from "lucide-react";
import React from "react";

interface StatusPanelProps {
  repoStatus: "FAILED" | "RECOVERING" | "RECOVERED" | "ONLINE";
}

export function StatusPanel({ repoStatus }: StatusPanelProps) {
  return (
    <div className="lg:w-80 flex flex-col gap-4">
      <h2 className="font-heading text-lg text-secondary-text uppercase tracking-widest mb-2">
        System Status
      </h2>

      <StatusCard 
        title="Authentication" 
        status="ONLINE" 
      />
      <StatusCard 
        title="Repository" 
        status={repoStatus} 
      />
      <StatusCard 
        title="Network" 
        status="LOCKED" 
      />
      <StatusCard 
        title="Memory" 
        status="LOCKED" 
      />
      <StatusCard 
        title="Core" 
        status="LOCKED" 
      />
    </div>
  );
}

interface StatusCardProps {
  title: string;
  status: "FAILED" | "RECOVERING" | "RECOVERED" | "ONLINE" | "LOCKED";
}

function StatusCard({ title, status }: StatusCardProps) {
  const isFailed = status === "FAILED";
  const isRecovered = status === "RECOVERED" || status === "ONLINE";
  const isRecovering = status === "RECOVERING";

  // Determine icon based on status
  const getIcon = () => {
    if (isFailed) return <XCircle size={18} className="text-danger" />;
    if (isRecovered) return <CheckCircle size={18} className="text-success" />;
    if (isRecovering) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <XCircle size={18} className="text-warning" />
        </motion.div>
      );
    }
    return <Lock size={18} className="text-secondary-text" />;
  };

  // Determine border and background styles
  const getCardStyle = () => {
    if (isFailed) return "border-danger/30 bg-danger/5";
    if (isRecovered) return "border-success/30 bg-success/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
    if (isRecovering) return "border-warning/30 bg-warning/5";
    return "border-border hover:border-white/10";
  };

  // Determine status label styles
  const getLabelStyle = () => {
    if (isFailed) return "bg-danger/20 text-danger";
    if (isRecovered) return "bg-success/20 text-success";
    if (isRecovering) return "bg-warning/20 text-warning";
    return "bg-surface text-secondary-text";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 flex items-center justify-between border transition-all duration-300 ${getCardStyle()}`}
    >
      <div className="flex items-center gap-3">
        <div>{getIcon()}</div>
        <span className="font-mono text-sm text-text">{title}</span>
      </div>
      <span className={`font-mono text-xs px-2 py-1 rounded select-none ${getLabelStyle()}`}>
        {status}
      </span>
    </motion.div>
  );
}
