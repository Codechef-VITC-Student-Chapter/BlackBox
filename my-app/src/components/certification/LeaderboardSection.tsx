"use client";

import { motion } from "framer-motion";
import { Trophy, Timer, Loader2, Award, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";

export default function LeaderboardSection() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch leaderboard data
  async function fetchLeaderboard() {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-md border border-[#1a2d1d] bg-[#040e04] h-full w-full flex flex-col overflow-hidden font-mono text-xs text-[#3c663a]">
      {/* Header */}
      <div className="border-b border-[#1a2d1d] bg-[#020502] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-[#f59e0b]" />
          <span className="font-bold uppercase tracking-wider text-white">
            PLATFORM STANDINGS
          </span>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchLeaderboard();
          }}
          className="text-[#33ff66] hover:text-white transition-colors p-1"
          title="Refresh Standings"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Timer Card */}
      <div className="p-3 border-b border-[#1a2d1d] bg-[#030703] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#3c663a]">
          <Timer size={13} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Assessment Time Remaining:
          </span>
        </div>

        <div className="text-sm font-bold tracking-widest text-[#33ff66]">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Standings List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-[#3c663a] uppercase tracking-wider flex items-center gap-1">
            <Award size={12} className="text-[#33ff66]" />
            LEADERBOARD RANKINGS
          </span>
          {loading && (
            <span className="text-[#33ff66] animate-pulse flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" /> POLLING...
            </span>
          )}
        </div>

        {leaderboard.length === 0 && !loading ? (
          <div className="text-center text-[10px] text-[#3c663a]/60 py-6">
            No team scores recorded yet.
          </div>
        ) : (
          leaderboard.map((team) => (
            <motion.div
              key={team.teamId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#020502] border border-[#1a2d1d] rounded p-2.5 flex items-center justify-between text-[10px] hover:border-[#33ff66]/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#f59e0b] w-5">#{team.rank}</span>
                <span className="text-white font-bold truncate max-w-[140px]">
                  {team.teamName}
                </span>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#33ff66] block">{team.score} PTS</span>
                <span className="text-[8px] text-[#3c663a]">
                  {team.modulesCompleted} / 7 SOLVED
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}