"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import BlackboxShell, { StatusCardInfo } from "@/components/ui/BlackboxShell";
import { synth } from "@/utils/synthAudio";
import Editor from "@monaco-editor/react";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";

const STATUS_CARDS: StatusCardInfo[] = [
  { title: "Authentication", status: "COMPLETE", modId: "MOD-01", serial: "SN:84-A1", iconType: "auth" },
  { title: "Repository", status: "COMPLETE", modId: "MOD-02", serial: "SN:84-R2", iconType: "repo" },
  { title: "Network", status: "COMPLETE", modId: "MOD-03", serial: "SN:84-N3", iconType: "net" },
  { title: "Visual/Puzzle", status: "COMPLETE", modId: "MOD-04", serial: "SN:84-V4", iconType: "puzzle" },
  { title: "Core Vault", status: "COMPLETE", modId: "MOD-05", serial: "SN:84-C5", iconType: "vault" },
  { title: "Certification", status: "ACTIVE", modId: "MOD-06", serial: "SN:84-E6", iconType: "cert" },
];

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

export default function CodingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"problem" | "editor" | "leaderboard">("problem");

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

  const handleRunCode = () => {
    synth.playClick();
    setIsRunning(true);
    setConsoleLogs([
      "Compiling source code...",
      "Executing sample test cases...",
      "SUCCESS: Sample test cases passed [Execution Time: 42ms]"
    ]);
    setTimeout(() => {
      synth.playSuccess();
      setIsRunning(false);
    }, 1200);
  };

  const handleSubmitCode = () => {
    synth.playClick();
    setIsRunning(true);
    setConsoleLogs([
      "Compiling source code...",
      "Submitting to BLACKBOX grading queue...",
      "Evaluating hidden test cases [01/15]...",
      "Evaluating hidden test cases [15/15]...",
      "GRADING COMPLETED. Rerouting to verdict console..."
    ]);
    setTimeout(() => {
      synth.playSuccess();
      router.push("/engineer-certification/verdict");
    }, 2500);
  };

  const formatTime = (timeSec: number) => {
    const minutes = Math.floor(timeSec / 60);
    const seconds = timeSec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <PageTransition>
      <BlackboxShell
        moduleCode="MOD-06"
        exeName="CODE_SANDBOX.EXE"
        terminalLabel="SECURE CODE INTERPRETER"
        maintenanceSeal="#4096"
        pwrLight="green"
        errLight="red"
        errLabel="ERR"
        terminalHeaderExe="sandbox_compiler.log"
        baudRate="9600 BAUD"
        ttyNumber="TTY-06"
        directiveTitle="CLASSIFIED DIRECTIVE // CODE CHALLENGE"
        directiveText={
          <>
            Complete the programming challenge in the code editor.
            <br />
            Ensure all constraints are met before sending to the grading queue.
          </>
        }
        statusLabel="SYSTEM STATUS"
        statusCards={STATUS_CARDS}
        radarLabel="SANDBOX"
        radarSublabel="COMPILER ACTIVE"
        bottomBarText="CAUTION: CODE EXECUTION MONITORED"
        bottomBarSerial="#8409-CODING"
        wallStencil="CONTROL ROOM 04 // ENG SECTOR"
        compactStatus={true}
      >
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Tab selectors */}
          <div className="flex items-center gap-1.5 border-b border-[#1a2d1d] pb-2 mb-3 select-none flex-shrink-0">
            {[
              { id: "problem", label: "PROBLEM STATEMENT" },
              { id: "editor", label: "CODE SANDBOX" },
              { id: "leaderboard", label: `LEADERBOARD [${formatTime(timeLeft)}]` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  synth.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`border font-mono text-[10px] px-3 py-1 font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-[#33ff66] text-black bg-[#33ff66]"
                    : "border-[#1a2d1d] text-[#3c663a] bg-[#020502] hover:text-[#33ff66] hover:border-[#33ff66]/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Areas */}
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {activeTab === "problem" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 font-mono text-xs text-[#3c663a] leading-relaxed pr-2"
              >
                <div className="border border-[#1a2d1d] bg-[#040e04] rounded-md p-4 space-y-4">
                  <div>
                    <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
                      Corrupted Network Nodes
                    </h2>
                    <p className="text-[#3c663a]">
                      During the recovery of the BLACKBOX infrastructure, several communication nodes became corrupted. Your task is to determine the minimum recovery operations required to reconnect the system.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                      Problem Statement
                    </h3>
                    <p className="text-[#3c663a]">
                      You are given a graph consisting of <span className="text-[#33ff66] font-bold">N</span> nodes and <span className="text-[#33ff66] font-bold">M</span> edges. Every edge connects two different nodes.
                      <br /><br />
                      Find the minimum number of operations required to reconnect every node so that the entire network becomes connected.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                      Input Format
                    </h3>
                    <ul className="list-disc ml-5 space-y-0.5 text-[#3c663a]">
                      <li>First line contains N and M.</li>
                      <li>Next M lines contain two integers U and V.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                      Output Format
                    </h3>
                    <p className="text-[#3c663a]">
                      Print one integer — the minimum operations required.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                      Constraints
                    </h3>
                    <div className="bg-[#030703] border border-[#1a2d1d] p-3 text-[10px] space-y-0.5">
                      <p>1 ≤ N ≤ 2 × 10⁵</p>
                      <p>0 ≤ M ≤ 2 × 10⁵</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                      Sample Data
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div>
                        <span className="text-[#3c663a] font-bold block mb-1">SAMPLE INPUT</span>
                        <pre className="bg-[#030703] border border-[#1a2d1d] p-2 text-[#33ff66]">
{`4 2
1 2
3 4`}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[#3c663a] font-bold block mb-1">SAMPLE OUTPUT</span>
                        <pre className="bg-[#030703] border border-[#1a2d1d] p-2 text-[#33ff66]">
{`1`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "editor" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full space-y-3 min-h-0"
              >
                {/* Editor settings */}
                <div className="flex justify-between items-center bg-[#040e04] border border-[#1a2d1d] px-3 py-2 rounded-md flex-shrink-0 select-none">
                  <span className="font-mono text-[10px] text-[#3c663a] font-bold">EDITOR LANGUAGE</span>
                  <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-[#030703] border border-[#1a2d1d] px-3 py-1 font-mono text-xs text-[#33ff66] focus:outline-none"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>

                {/* Monaco Editor Container */}
                <div className="flex-1 border border-[#1a2d1d] bg-[#020502] overflow-hidden min-h-[180px] relative">
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
                <div className="bg-[#030703] border border-[#1a2d1d] rounded-md p-3.5 font-mono text-[10px] h-24 overflow-y-auto flex-shrink-0 space-y-0.5">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="text-[#3c663a]">
                      &gt; <span className={log.includes("SUCCESS") || log.includes("COMPLETED") ? "text-[#33ff66] font-bold" : ""}>{log}</span>
                    </div>
                  ))}
                  {isRunning && (
                    <span className="inline-block w-1.5 h-3 bg-[#33ff66] animate-pulse align-middle ml-1" />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 flex-shrink-0 select-none">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex-1 border border-[#1a2d1d] text-[#3c663a] bg-transparent hover:border-[#33ff66] hover:text-[#33ff66] transition-all duration-250 py-2.5 font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    RUN CODE
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    disabled={isRunning}
                    className="flex-1 border border-[#33ff66] text-black bg-[#33ff66] hover:shadow-[0_0_10px_rgba(51,255,102,0.6)] transition-all duration-250 py-2.5 font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    SUBMIT SOLUTION
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 font-mono text-xs text-[#3c663a]"
              >
                <div className="bg-[#040e04] border border-[#1a2d1d] rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1a2d1d] pb-2">
                    <span className="font-bold uppercase tracking-wider">// PLATFORM STANDINGS</span>
                    {leaderboardLoading && <span className="animate-pulse">POLLING GATEWAY...</span>}
                  </div>

                  {leaderboard.length === 0 && !leaderboardLoading ? (
                    <div className="text-center py-6 text-[#3c663a]/50">No team scores recorded yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map((team) => (
                        <div
                          key={team.teamId}
                          className="bg-[#020502] border border-[#1a2d1d] p-3 flex justify-between items-center text-[10px] hover:border-[#33ff66]/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#f59e0b] font-bold">#{team.rank}</span>
                            <span className="text-white font-bold truncate max-w-[140px]">{team.teamName}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[#33ff66] font-bold block">{team.score} PTS</span>
                            <span className="text-[8px] text-[#3c663a]">{team.modulesCompleted} / 7 COMPLETED</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </BlackboxShell>
    </PageTransition>
  );
}