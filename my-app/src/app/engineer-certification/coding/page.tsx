"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";
import { useRouter } from "next/navigation";

import ProblemSection from "@/components/certification/ProblemSection";
import LeaderboardSection from "@/components/certification/LeaderboardSection";
import EditorSection from "@/components/certification/EditorSection";
import BottomBar from "@/components/certification/BottomBar";
import VerdictModal from "@/components/certification/VerdictModal";

export default function CodingPage() {
  const [showVerdict, setShowVerdict] = useState(false);
  const router = useRouter();
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

        <EditorSection />

        {/* Console + Buttons */}

        <BottomBar />

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