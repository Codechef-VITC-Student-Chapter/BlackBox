"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { synth } from "@/utils/synthAudio";
import Editor from "@monaco-editor/react";
import LeaderboardSection from "@/components/certification/LeaderboardSection";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";
import { AlertTriangle, Terminal } from "lucide-react";

function HexBolt({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute w-2 h-2 rounded-full bg-[#131b14] border border-[#253629] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center z-20 ${className}`}
    >
      <div className="w-1.5 h-[1px] bg-[#384f3b] transform rotate-45" />
    </div>
  );
}

const STARTER_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  python: `def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()`,
  go: `package main

import "fmt"

func main() {
    // Write your code here
}`
};

type Problem = {
  _id: string;
  title: string;
  description: string;
  published?: boolean;
  cpu_time_limit: number;
  memory_limit: number;
};

type RunResult = {
  testcase: number | string;
  verdict: string;
  time?: number | string;
  memory?: number | string;
  passed: boolean;
  expected?: string;
  stdout?: string;
  error?: string;
  stderr?: string;
};

type SubmitResult = {
  verdict: string;
  total?: number;
  passed?: number;
  time?: number | string;
  memory?: number | string;
  message?: string;
  error?: string;
};

type CodingTab = "problem" | "editor" | "leaderboard";

const TABS: { id: CodingTab; label: string }[] = [
  { id: "problem", label: "PROBLEM STATEMENT" },
  { id: "editor", label: "CODE SANDBOX" },
  { id: "leaderboard", label: "LEADERBOARD" },
];

const getErrorMessage = (err: unknown) => (
  err instanceof Error ? err.message : "Unexpected error"
);

export default function CodingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CodingTab>("problem");

  // Problem state
  const [problem, setProblem] = useState<Problem | null>(null);

  // Editor states
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(STARTER_CODE.cpp);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "BLACKBOX Judge Ready.",
    "Awaiting code execution..."
  ]);
  const [isRunning, setIsRunning] = useState(false);

  // Leaderboard states
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  // Fetch first published problem
  useEffect(() => {
    fetch("/api/admin/problems")
      .then(res => res.json())
      .then((data: Problem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const firstProb = data.find((p) => p.published) || data[0];
          setProblem(firstProb);
        }
      })
      .catch(console.error);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    let isMounted = true;
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.leaderboard)) {
            setLeaderboard(data.leaderboard);
          }
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        if (isMounted) setLeaderboardLoading(false);
      }
    }
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const changeLanguage = (lang: string) => {
    synth.playClick();
    setLanguage(lang);
    setCode(STARTER_CODE[lang as keyof typeof STARTER_CODE]);
  };

  const mapLangToId = (lang: string) => {
    switch (lang) {
      case "cpp": return 54;
      case "java": return 62;
      case "python": return 71;
      case "go": return 60;
      default: return 54;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    if (!problem) return;
    synth.playClick();

    setIsRunning(true);
    setConsoleLogs(["Compiling source code...", "Executing public test cases..."]);
    
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problem._id,
          language_id: mapLangToId(language),
          source_code: code,
        })
      });
      
      const data = await res.json() as RunResult[] | { error?: string };
      if (!res.ok) {
        throw new Error(Array.isArray(data) ? "Execution failed" : data.error || "Execution failed");
      }
      
      const logs = ["Execution Completed!"];
      if (!Array.isArray(data)) throw new Error("Execution failed");

      data.forEach((tc) => {
        logs.push(`Testcase #${tc.testcase}: ${tc.verdict} [${tc.time || 0}s, ${tc.memory || 0}KB]`);
        if (!tc.passed) {
          logs.push(`  Expected: ${tc.expected || "hidden"}`);
          logs.push(`  Got:      ${tc.stdout?.trim() || tc.error || tc.stderr || "Empty output"}`);
        }
      });
      
      setConsoleLogs(logs);
      synth.playSuccess();
    } catch (err: unknown) {
      setConsoleLogs(["> ERROR: " + getErrorMessage(err)]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem) return;
    synth.playClick();

    setIsRunning(true);

    setConsoleLogs([
      "Compiling source code...",
      "Submitting to BLACKBOX grading queue...",
      "Evaluating all hidden test cases..."
    ]);
    
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problem._id,
          language_id: mapLangToId(language),
          source_code: code,
        })
      });
      
      const data = await res.json() as SubmitResult;
      if (!res.ok) throw new Error(data.error || "Submission failed");
      
      if (data.verdict === "Accepted") {
        synth.playSuccess();
        setConsoleLogs([
          "GRADING COMPLETED.",
          `SUCCESS: ALL ${data.total} TESTCASES PASSED!`,
          `Time: ${data.time}s | Memory: ${data.memory}KB`,
          "Rerouting to verdict console..."
        ]);
        setTimeout(() => router.push("/engineer-certification/verdict"), 2500);
      } else {
        setConsoleLogs([
          "GRADING COMPLETED.",
          `FAILED: ${data.message}`,
          `Passed: ${data.passed} / ${data.total}`
        ]);
      }
    } catch (err: unknown) {
      setConsoleLogs(["> ERROR: " + getErrorMessage(err)]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <PageTransition>
      {/* Specular glass reflections and CRT sweep animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glass-glare-sweep {
          0% { background-position: -200% -200%; }
          100% { background-position: 300% 300%; }
        }
        @keyframes crt-flicker {
          0%, 100% { opacity: 0.98; }
          48% { opacity: 0.98; }
          50% { opacity: 0.95; }
          52% { opacity: 0.99; }
          94% { opacity: 0.98; }
          96% { opacity: 0.94; }
          98% { opacity: 1; }
        }
      `}} />

      <div className="w-screen h-screen bg-[#020402] font-mono text-[#33ff66] flex flex-col overflow-hidden select-none relative z-10">
        
        {/* ============================================================ */}
        {/* 1. RETRO ENVIRONMENT TERMINAL DECORATIONS                      */}
        {/* ============================================================ */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none opacity-25 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.95)_85%,#010201_100%)] pointer-events-none z-10" />
        
        {/* Metal Beams styling */}
        <div className="absolute top-0 bottom-0 left-3 w-8 bg-[#070b07] border-x border-[#122014] opacity-50 z-0 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-3 w-8 bg-[#070b07] border-x border-[#122014] opacity-50 z-0 pointer-events-none" />
        
        {/* Conduit */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#060a06] border-b border-[#122014] opacity-50 z-0 pointer-events-none" />
        
        {/* Volumetric glow */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-full max-w-2xl h-60 bg-[radial-gradient(ellipse_at_top,rgba(51,255,102,0.08)_0%,transparent_70%)] z-0 pointer-events-none" />

        {/* Floor fog */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(to_top,rgba(2,5,2,0.5)_0%,transparent_100%)] pointer-events-none z-10" />

        {/* Wall stencil */}
        <div className="absolute bottom-10 left-16 hidden md:flex items-center gap-4 text-[9px] text-[#122414] uppercase tracking-widest opacity-45 pointer-events-none z-0">
          <span>CONTROL ROOM 04 // ENG SECTOR</span>
        </div>

        {/* ============================================================ */}
        {/* 2. TOP BAR HEADER                                            */}
        {/* ============================================================ */}
        <header className="h-10 border-b border-[#122014] bg-[#020502] flex items-center justify-between px-6 z-50 relative flex-shrink-0 text-[10px] uppercase tracking-widest">
          <HexBolt className="top-1 left-1" />
          <HexBolt className="top-1 right-1" />
          
          <div className="flex items-center gap-2">
            <span className="text-[#33ff66] font-bold">[MOD-07]</span>
            <span className="text-[#254228]">·</span>
            <span>CODE_SANDBOX.EXE</span>
            <span className="text-[#254228]">·</span>
            <span className="text-[#254228] hidden sm:inline">SECURE CODE INTERPRETER</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 bg-[#120e06] text-[#b45309] px-2 py-0.5 border border-[#3f260a] rounded">
              <AlertTriangle size={11} className="text-[#d97706]" />
              <span>MAINTENANCE SEAL #4096</span>
            </div>

            <div className="flex items-center gap-2 bg-[#030503] px-2.5 py-0.5 rounded border border-[#122014]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#33ff66] shadow-[0_0_8px_#33ff66] animate-pulse" />
                <span className="text-[#33ff66] text-[8px] font-bold">PWR</span>
              </div>
              <div className="w-[1px] h-3 bg-[#122014]" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                <span className="text-[8px] font-bold text-[#ff3333]">ERR</span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. MAIN WORKSPACE CONTAINER                                   */}
        {/* ============================================================ */}
        <div className="flex flex-1 overflow-hidden relative z-10 flex-col">
          
          {/* Subheader log line */}
          <div className="h-10 border-b border-[#122014] bg-[#030603] px-4 flex items-center justify-between text-xs flex-shrink-0 text-[#33ff66]/80 font-mono">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#33ff66]" />
              <span className="font-bold">sandbox_compiler.log</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#254228]">
              <span>9600 BAUD</span>
              <span className="bg-[#060c07] text-[#33ff66] px-2 py-0.5 border border-[#122815] rounded">
                TTY-06
              </span>
            </div>
          </div>

          {/* CRT Screen Display */}
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0 bg-[#010201]">
            {/* Scanlines, glass, specular sweep overlays */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)] opacity-90" />
            <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.04)_0%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.06)_50%,transparent_55%)] bg-[length:250%_250%] animate-[glass-glare-sweep_25s_infinite_ease-in-out]" />
            <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] bg-[radial-gradient(#33ff66_1px,transparent_1px)] [background-size:18px_18px]" />

            {/* Split Panel (LeetCode Style Layout) */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden min-h-0 h-full relative z-10 animate-[crt-flicker_3s_infinite_ease-in-out]">
              
              {/* Left Column: Problem description / Leaderboard */}
              <div className="flex-1 flex flex-col border border-[#122014] bg-[#000000] rounded overflow-hidden min-h-[300px] md:h-full">
                {/* Tab Selectors */}
                <div className="flex items-center gap-1.5 border-b border-[#122014] p-3 select-none flex-shrink-0 bg-[#020502]">
                  {TABS.filter((tab) => tab.id !== "editor").map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        synth.playClick();
                        setActiveTab(tab.id);
                      }}
                      className={`border font-mono text-[10px] px-3 py-1.5 font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === tab.id
                          ? "border-[#33ff66] text-black bg-[#33ff66]"
                          : "border-[#122014] text-[#254228] bg-[#000000] hover:text-[#33ff66] hover:border-[#33ff66]/40"
                      }`}
                    >
                      {tab.id === "leaderboard" ? `${tab.label} [${formatTime(timeLeft)}]` : tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Areas */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0 relative bg-[#000000]">
                  {(activeTab === "problem" || activeTab === "editor") && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 font-mono text-xs text-[#86efac] leading-relaxed"
                    >
                      {problem ? (
                        <>
                          <div>
                            <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-2 border-b border-[#122014] pb-1">
                              {problem.title}
                            </h2>
                            <div 
                              className="text-[#86efac] whitespace-pre-wrap leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: problem.description }}
                            />
                          </div>

                          <div className="pt-2">
                            <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-2">
                              Constraints
                            </h3>
                            <div className="bg-[#020402] border border-[#122014] p-3 text-[10px] space-y-1 rounded">
                              <p className="flex justify-between">
                                <span className="text-[#254228]">CPU Limit:</span>
                                <span className="text-[#33ff66] font-bold">{problem.cpu_time_limit}s</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-[#254228]">Memory Limit:</span>
                                <span className="text-[#33ff66] font-bold">{problem.memory_limit} KB</span>
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 animate-pulse text-[#254228]">Loading problem data...</div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "leaderboard" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full w-full min-h-[300px]"
                    >
                      <LeaderboardSection />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column: Code Sandbox */}
              <div className="flex-1 flex flex-col border border-[#122014] bg-[#000000] rounded overflow-hidden min-h-[400px] md:h-full">
                {/* Editor settings / Header (With top action buttons) */}
                <div className="flex justify-between items-center bg-[#020502] border-b border-[#122014] px-4 py-2.5 select-none flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#254228] font-bold tracking-wider">CODE EDITOR</span>
                  
                  <div className="flex items-center gap-4">
                    {/* Language select */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-[#254228] font-bold">LANGUAGE</span>
                      <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="bg-[#000000] border border-[#122014] px-2 py-1 font-mono text-xs text-[#33ff66] focus:outline-none rounded hover:border-[#33ff66]/40 transition-colors cursor-pointer"
                      >
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                      </select>
                    </div>

                    {/* Action buttons (LeetCode Top Bar style) */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="border border-[#122014] text-[#254228] bg-transparent hover:border-[#33ff66] hover:text-[#33ff66] hover:bg-[#33ff66]/5 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 px-3 py-1 rounded font-mono text-[10px] font-bold uppercase cursor-pointer"
                      >
                        RUN
                      </button>
                      <button
                        onClick={handleSubmitCode}
                        disabled={isRunning}
                        className="border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_12px_rgba(51,255,102,0.5)] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 px-3 py-1 rounded font-mono text-[10px] font-bold uppercase cursor-pointer"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Monaco Editor Container */}
                <div className="flex-1 bg-[#000000] overflow-hidden relative min-h-[220px]">
                  <Editor
                    height="100%"
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    theme="vs-dark"
                    options={{
                      fontSize: 12,
                      fontFamily: "Courier New, monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 10 }
                    }}
                  />
                </div>

                {/* Console Log stream */}
                <div className="border-t border-[#122014] bg-[#020502] p-4 flex flex-col gap-3 flex-shrink-0">
                  <div className="flex items-center justify-between select-none">
                    <span className="font-mono text-[9px] text-[#254228] font-bold">CONSOLE OUTPUT</span>
                    {isRunning && (
                      <span className="font-mono text-[9px] text-[#33ff66] animate-pulse">RUNNING...</span>
                    )}
                  </div>

                  <div className="bg-[#000000] border border-[#122014] rounded p-3 font-mono text-[10px] h-24 overflow-y-auto space-y-1">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="text-[#86efac] leading-relaxed break-all">
                        &gt; <span className={log.includes("SUCCESS") || log.includes("COMPLETED") ? "text-[#33ff66] font-bold" : ""}>{log}</span>
                      </div>
                    ))}
                    {isRunning && (
                      <span className="inline-block w-1.5 h-3 bg-[#33ff66] animate-pulse align-middle ml-1" />
                    )}
                  </div>
                </div>

              </div>
              
            </div>
          </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}