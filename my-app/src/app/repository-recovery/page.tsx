"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { useAudio } from "@/hooks/useAudio";
import { Terminal } from "./components/Terminal";
import { StatusPanel } from "./components/StatusPanel";
import { initializeDevToolsArtifactsM2 } from "@/utils/devToolsArtifactsM2";

interface CustomWindow extends Window {
  showRepositoryVerified?: () => void;
  handleRepositorySuccess?: () => void;
}

const failedSequence = [
  "Connecting to Secure Repository Host...",
  "Verifying Cryptographic Signatures...",
  "Bypassing Repository Firewall...",
  "ERROR: Missing Recovery Fragment",
  "REPOSITORY DECRYPTION FAILED",
  "",
  "DIAGNOSTIC HINTS DETECTED:",
  "- Platform: Check the transmission layers.",
  "- Owner: Analyze the active session context.",
  "- Project: Interrogate the DOM container attributes."
];

const successSequence = [
  "[OVERRIDE DECRYPTION INJECTED]",
  "Authentication Verified...",
  "Recovering Commit History...",
  "Loading Contributor Logs...",
  "Repository Restored.",
  "Synchronization Complete."
];

export default function RepositoryRecoveryPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [repoStatus, setRepoStatus] = useState<"FAILED" | "RECOVERING" | "RECOVERED">("FAILED");
  const [isComplete, setIsComplete] = useState(false);
  
  const { playSound } = useAudio();
  
  // Refs to control intervals and state across callbacks
  const initialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const successIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVerifiedStarted = useRef(false);

  // Placeholder function for success state (State 2)
  const handleRepositorySuccess = useCallback(() => {
    if (isVerifiedStarted.current) return;
    isVerifiedStarted.current = true;

    // Clear initial failure sequence if it was still running
    if (initialIntervalRef.current) {
      clearInterval(initialIntervalRef.current);
    }

    setRepoStatus("RECOVERING");
    playSound("success");

    let i = 0;
    successIntervalRef.current = setInterval(() => {
      if (i < successSequence.length) {
        const line = successSequence[i];
        setTerminalLines(prev => [...prev, line]);
        playSound("typing");

        if (line.includes("Verified") || line.includes("Restored") || line.includes("Complete")) {
          playSound("success");
        }

        if (line === "Synchronization Complete.") {
          setRepoStatus("RECOVERED");
          setIsComplete(true);
          if (successIntervalRef.current) {
            clearInterval(successIntervalRef.current);
          }
        }
        i++;
      } else {
        if (successIntervalRef.current) {
          clearInterval(successIntervalRef.current);
        }
      }
    }, 800);
  }, [playSound]);

  // Initialize page, animations and devtools clues
  useEffect(() => {
    // 1. Load hidden devtools artifacts
    initializeDevToolsArtifactsM2();

    // 2. Register window functions for manual success triggering
    const win = typeof window !== "undefined" ? (window as unknown as CustomWindow) : null;
    if (win) {
      win.showRepositoryVerified = handleRepositorySuccess;
      win.handleRepositorySuccess = handleRepositorySuccess;
    }

    // 3. Start State 1 (Failure) Sequence animation
    let i = 0;
    initialIntervalRef.current = setInterval(() => {
      if (i < failedSequence.length) {
        const line = failedSequence[i];
        setTerminalLines(prev => [...prev, line]);
        playSound("typing");
        if (line.includes("FAILED") || line.includes("ERROR")) {
          playSound("error");
        }
        i++;
      } else {
        if (initialIntervalRef.current) {
          clearInterval(initialIntervalRef.current);
        }
      }
    }, 800);

    // Cleanup on unmount
    return () => {
      if (initialIntervalRef.current) clearInterval(initialIntervalRef.current);
      if (successIntervalRef.current) clearInterval(successIntervalRef.current);
      if (win) {
        delete win.showRepositoryVerified;
        delete win.handleRepositorySuccess;
      }
    };
  }, [playSound, handleRepositorySuccess]);

  return (
    <PageTransition>
      <div 
        className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-8"
        data-project="github_project_placeholder"
      >
        
        {/* Terminal Component */}
        <Terminal lines={terminalLines} isComplete={isComplete} />

        {/* System Status Panel */}
        <StatusPanel repoStatus={repoStatus} />
        
      </div>
    </PageTransition>
  );
}
