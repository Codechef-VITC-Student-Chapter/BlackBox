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



  function formatTime(timeLeft: number): import("react").ReactNode {

    const totalSeconds = Math.max(0, Math.floor(timeLeft));

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  }



  function handleSubmitCode(): void {

    synth.playClick();

    setIsRunning(true);

    setConsoleLogs([

      "Submitting solution...",

      "Running all test cases...",

      "Validating against hidden test suite...",

      "SUCCESS: All test cases passed [Execution Time: 128ms]",

      "Solution accepted and recorded on leaderboard."

    ]);

    setTimeout(() => {

      synth.playSuccess();

      setIsRunning(false);

      setTimeLeft(0);

    }, 2000);

  }



return (

  <PageTransition>

    <div className="h-screen w-screen bg-[#020502] text-[#33ff66] font-mono overflow-hidden">



      {/* Header */}

      <div className="h-12 border-b border-[#1a2d1d] flex items-center justify-between px-6 bg-[#030703]">

        <div className="text-sm font-bold tracking-widest">

          BLACKBOX // ENGINEER CERTIFICATION

        </div>



        <div className="text-xs text-[#3c663a]">

          TIME LEFT : {formatTime(timeLeft)}

        </div>

      </div>





      {/* Leetcode Layout */}

      <div className="h-[calc(100vh-48px)] grid grid-cols-2">





        {/* LEFT : PROBLEM */}

        <div className="border-r border-[#1a2d1d] overflow-y-auto p-6">



          <h1 className="text-white text-xl font-bold mb-6">

            Corrupted Network Nodes

          </h1>





          <section className="space-y-5 text-sm text-[#9ca3af] leading-relaxed">



            <div>

              <h2 className="text-[#33ff66] font-bold mb-2">

                Problem Statement

              </h2>



              <p>

                During the recovery of the BLACKBOX infrastructure,

                several communication nodes became corrupted.

                Determine the minimum recovery operations required

                to reconnect the system.

              </p>

            </div>





            <div>

              <h2 className="text-[#33ff66] font-bold mb-2">

                Input Format

              </h2>



              <p>

                First line contains N and M.

                <br />

                Next M lines contain two integers U and V.

              </p>

            </div>





            <div>

              <h2 className="text-[#33ff66] font-bold mb-2">

                Output Format

              </h2>



              <p>

                Print the minimum operations required.

              </p>

            </div>





            <div>

              <h2 className="text-[#33ff66] font-bold mb-2">

                Constraints

              </h2>



              <div className="bg-[#030703] border border-[#1a2d1d] p-3">

                1 ≤ N ≤ 2 × 10⁵

                <br />

                0 ≤ M ≤ 2 × 10⁵

              </div>



            </div>





            <div>

              <h2 className="text-[#33ff66] font-bold mb-2">

                Example

              </h2>



              <pre className="bg-[#030703] border border-[#1a2d1d] p-4 text-[#33ff66]">

{`Input:

4 2

1 2

3 4



Output:

1`}

              </pre>



            </div>





          </section>



        </div>









        {/* RIGHT : CODE EDITOR */}

        <div className="flex flex-col p-4 gap-3">





          {/* Language */}

          <div className="flex justify-between items-center">



            <span className="text-xs text-[#3c663a]">

              LANGUAGE

            </span>





            <select

              value={language}

              onChange={(e)=>changeLanguage(e.target.value)}

              className="

                bg-[#030703]

                border border-[#1a2d1d]

                text-[#33ff66]

                px-3 py-1

                text-xs

              "

            >



              <option value="cpp">

                C++

              </option>



              <option value="java">

                Java

              </option>



              <option value="python">

                Python

              </option>



              <option value="go">

                Go

              </option>



            </select>



          </div>









          {/* Monaco */}

          <div className="

              flex-1

              border

              border-[#1a2d1d]

              bg-[#020502]

              overflow-hidden

              relative

          ">



            <Editor

              height="100%"

              language={language==="cpp" ? "cpp" : language}

              value={code}

              onChange={(val)=>setCode(val || "")}

              theme="vs-dark"

              options={{

                fontSize:14,

                minimap:{enabled:false},

                automaticLayout:true,

                scrollBeyondLastLine:false,

                padding:{

                  top:15

                }

              }}

            />



          </div>









          {/* Console */}



          <div className="

              h-28

              bg-[#030703]

              border

              border-[#1a2d1d]

              p-3

              text-xs

              overflow-y-auto

          ">



            {consoleLogs.map((log,index)=>(

              <div key={index}>

                &gt; {log}

              </div>

            ))}



          </div>









          {/* Buttons */}



          <div className="flex gap-3">





            <button

              onClick={handleRunCode}

              disabled={isRunning}

              className="

                flex-1

                border border-[#1a2d1d]

                py-3

                text-xs

                hover:border-[#33ff66]

              "

            >

              RUN CODE

            </button>







            <button

              onClick={handleSubmitCode}

              disabled={isRunning}

              className="

                flex-1

                bg-[#33ff66]

                text-black

                py-3

                text-xs

                font-bold

              "

            >

              SUBMIT SOLUTION

            </button>





          </div>





        </div>





      </div>



    </div>

  </PageTransition>

);

}