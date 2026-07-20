"use client";

import { motion } from "framer-motion";
import { Trophy, Timer, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";

export default function LeaderboardSection() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins countdown
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch live leaderboard and poll every 10s
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
        console.error("Leaderboard fetch failed:", err);
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
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel h-full w-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
        <Trophy size={18} className="text-secondary-text" />
        <span className="font-mono text-sm tracking-widest text-secondary-text uppercase">
          Engineer Status
        </span>
      </div>

      {/* Timer */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Timer size={18} className="text-primary" />
          <span className="font-mono text-sm text-secondary-text uppercase tracking-widest">
            Time Remaining
          </span>
        </div>

        <div className="font-heading text-4xl tracking-widest text-primary">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-mono text-sm text-secondary-text uppercase tracking-widest">
            Live CTFd Leaderboard
          </h3>
          {loading && <Loader2 size={14} className="animate-spin text-primary" />}
        </div>

        {leaderboard.length === 0 && !loading ? (
          <div className="text-center font-mono text-xs text-secondary-text py-8">
            No active team scores yet.
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((team) => (
              <motion.div
                key={team.teamId}
                whileHover={{ scale: 1.02 }}
                className="glass-panel p-4 border border-border"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-heading text-primary text-lg font-bold">
                    #{team.rank}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-primary font-bold">{team.score} pts</span>
                    {team.penalties > 0 && (
                      <span className="text-danger/80">-{team.penalties} pts</span>
                    )}
                  </div>
                </div>

                <p className="font-mono text-text font-semibold mb-2 truncate">
                  {team.teamName}
                </p>

                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded">
                    Module {team.currentModule}
                  </span>
                  <span className="text-secondary-text">
                    Solved: {team.modulesCompleted}/7
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-surface/40 p-4">
        <p className="font-mono text-xs text-secondary-text leading-6">
          CTFd Dynamic Scoring:
          <br />
          • Module points decay with solves
          <br />
          • Penalty per extra attempt
          <br />
          • Tie-breaker: Earlier solve time
        </p>
      </div>
    </motion.div>
  );
}