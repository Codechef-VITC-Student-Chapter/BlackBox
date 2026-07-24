"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import ProblemSection from "@/components/certification/ProblemSection";
import LeaderboardSection from "@/components/certification/LeaderboardSection";
import EditorSection from "@/components/certification/EditorSection";
import BottomBar from "@/components/certification/BottomBar";

export default function CodingPage() {
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
    </PageTransition>
  );
}