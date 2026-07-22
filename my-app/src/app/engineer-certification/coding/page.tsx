"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { useRouter } from "next/navigation";

import ProblemSection from "@/components/certification/ProblemSection";
import LeaderboardSection from "@/components/certification/LeaderboardSection";
import EditorSection from "@/components/certification/EditorSection";
import BottomBar from "@/components/certification/BottomBar";
import VerdictModal from "@/components/certification/VerdictModal";

const starterCode = {
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\n    return 0;\n}`,
  java: `public class Main {\n\n    public static void main(String[] args) {\n\n    }\n\n}`,
  python: `def solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n\n}\n`,
};

export default function CodingPage() {
  const [showVerdict, setShowVerdict] = useState(false);
  const router = useRouter();

  // Lifted state from EditorSection
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCode.cpp);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setCode(starterCode[lang as keyof typeof starterCode]);
  };

  // State for BottomBar (Judge0 integration)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "BLACKBOX Judge Ready.",
    "Waiting for submission..."
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setConsoleOutput(prev => [...prev, `\n> Executing ${language} code...`]);

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();

      if (!response.ok) {
        setConsoleOutput(prev => [...prev, `Error: ${result.error || "Failed to execute"}`]);
        return;
      }

      // Format Judge0 result
      const newOutput = [];
      if (result.compile_output) {
        newOutput.push(`Compiler Output:\n${result.compile_output}`);
      }
      if (result.stdout) {
        newOutput.push(`stdout:\n${result.stdout}`);
      }
      if (result.stderr) {
        newOutput.push(`stderr:\n${result.stderr}`);
      }
      if (result.message) {
        newOutput.push(`Message:\n${result.message}`);
      }
      
      newOutput.push(`Status: ${result.status?.description}`);
      newOutput.push(`Time: ${result.time}s | Memory: ${result.memory}KB`);

      setConsoleOutput(prev => [...prev, ...newOutput]);

    } catch (err: any) {
      setConsoleOutput(prev => [...prev, `Exception: ${err.message}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    await handleRunCode();
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Problem Statement */}
          <div className="xl:col-span-2 h-[650px]">
            <ProblemSection />
          </div>
          {/* Timer + Leaderboard */}
          <div className="h-[650px]">
            <LeaderboardSection />
          </div>
        </div>

        {/* Code Editor */}
        <EditorSection 
          language={language}
          code={code}
          setCode={setCode}
          changeLanguage={changeLanguage}
        />

        {/* Console + Buttons */}
        <BottomBar 
          consoleOutput={consoleOutput}
          isExecuting={isExecuting}
          onRunCode={handleRunCode}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Temporary Verdict Modal */}
      <VerdictModal
        open={showVerdict}
        verdict="Accepted"
        passed={15}
        total={15}
        onClose={() => setShowVerdict(false)}
      />

      {/* Temporary Floating Button (Remove after backend integration) */}
      <button
        onClick={() => router.push("/engineer-certification/verdict")}
        className="fixed bottom-8 right-8 px-5 py-3 rounded-md bg-primary text-black font-bold shadow-lg hover:scale-105 transition"
      >
        Test Verdict
      </button>
    </PageTransition>
  );
}