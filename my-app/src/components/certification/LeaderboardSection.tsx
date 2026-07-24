"use client";

import { motion } from "framer-motion";
import { Trophy, Timer, Loader2, Award } from "lucide-react";
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
        if (isMounted) setLoading(false);
      }
    }

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 h-full w-full flex flex-col overflow-hidden font-sans text-zinc-50 shadow-sm backdrop-blur">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/60 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Trophy size={16} className="text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Leaderboard
          </span>
        </div>
      </div>

      {/* Timer Card */}
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
          <Timer size={14} />
          <span className="text-xs font-medium uppercase tracking-wider">
            Time Remaining
          </span>
        </div>

        <div className="text-3xl font-bold tracking-tight text-zinc-50">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Standings List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award size={13} className="text-zinc-400" />
            Standings
          </span>
          {loading && <Loader2 size={13} className="animate-spin text-zinc-400" />}
        </div>

        {leaderboard.length === 0 && !loading ? (
          <div className="text-center text-xs text-zinc-500 py-8">
            No team scores recorded yet.
          </div>
        ) : (
          leaderboard.map((team) => (
            <div
              key={team.teamId}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 flex items-center justify-between text-xs hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-amber-400 w-5">#{team.rank}</span>
                <span className="text-zinc-200 font-medium truncate max-w-[120px]">
                  {team.teamName}
                </span>
              </div>

              <div className="text-right">
                <p className="font-bold text-emerald-400">{team.score} pts</p>
                <p className="text-[10px] text-zinc-500">
                  {team.modulesCompleted} / 7 Solved
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}