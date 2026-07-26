"use client";



import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

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
      <BlackboxShell
        moduleCode="MOD-07"
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
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  synth.playClick();
                  setActiveTab(tab.id);
                }}
                className={`border font-mono text-[10px] px-3 py-1 font-bold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                    ? "border-[#33ff66] text-black bg-[#33ff66]"
                    : "border-[#1a2d1d] text-[#3c663a] bg-[#020502] hover:text-[#33ff66] hover:border-[#33ff66]/40"
                  }`}
              >
                {tab.id === "leaderboard" ? `${tab.label} [${formatTime(timeLeft)}]` : tab.label}
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
                  {problem ? (
                    <>
                      <div>
                        <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-1">
                          {problem.title}
                        </h2>
                        <div 
                          className="text-[#3c663a] whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: problem.description }}
                        />
                      </div>

                      <div>
                        <h3 className="text-[#33ff66] font-bold uppercase tracking-wide mb-1">
                          Constraints
                        </h3>
                        <div className="bg-[#030703] border border-[#1a2d1d] p-3 text-[10px] space-y-0.5">
                          <p>CPU Limit: {problem.cpu_time_limit}s</p>
                          <p>Memory Limit: {problem.memory_limit} KB</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>Loading problem data...</div>
                  )}
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
                    <span className="font-bold uppercase tracking-wider">{"// PLATFORM STANDINGS"}</span>
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
