"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Trophy, Terminal, Medal, Loader2 } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";

export default function FinalLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.leaderboard)) {
            setLeaderboard(data.leaderboard);
          }
        }
      } catch (err) {
        console.error("Failed to load final leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  const topTeam = leaderboard[0];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />
            <span className="font-mono text-sm uppercase tracking-widest text-secondary-text">
              BLACKBOX Complete
            </span>
          </div>

          <div className="p-8 text-center">
            <Trophy size={65} className="mx-auto text-primary mb-5 animate-pulse" />
            <h1 className="font-heading text-4xl uppercase tracking-widest text-primary font-bold">
              Congratulations
            </h1>
            <p className="font-mono text-secondary-text mt-3">
              BLACKBOX has been fully restored.
            </p>
          </div>
        </div>

        {/* Champion Frame */}
        {topTeam && (
          <div className="glass-panel p-8 text-center">
            <h2 className="font-heading text-xl uppercase tracking-widest text-primary mb-6">
              Champion Team
            </h2>
            <div className="border-[6px] border-yellow-500 rounded-xl p-6 w-fit mx-auto bg-surface/50 space-y-2">
              <p className="font-heading text-3xl text-white font-bold">{topTeam.teamName}</p>
              <p className="font-mono text-lg text-primary">{topTeam.score} PTS</p>
            </div>
            <p className="font-mono text-center text-secondary-text mt-5">
              🥇 Champion Frame
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {topTeam && (
          <div className="grid md:grid-cols-4 gap-5">
            <StatCard title="Champion Team" value={topTeam.teamName} />
            <StatCard title="Top Score" value={`${topTeam.score} pts`} />
            <StatCard title="Modules Solved" value={`${topTeam.modulesCompleted}/7`} />
            <StatCard title="Penalty Deductions" value={`-${topTeam.penalties} pts`} />
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-border bg-surface/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Medal size={18} className="text-primary" />
              <span className="font-mono uppercase tracking-widest text-sm text-text">
                CTFd Dynamic Leaderboard
              </span>
            </div>
            {loading && <Loader2 size={16} className="animate-spin text-primary" />}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full font-mono">
              <thead className="border-b border-border text-secondary-text text-xs uppercase tracking-wider bg-surface/20">
                <tr>
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">Team</th>
                  <th className="p-4 text-left">Score</th>
                  <th className="p-4 text-left">Modules Solved</th>
                  <th className="p-4 text-left">Penalty</th>
                  <th className="p-4 text-left">Last Solve Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((team) => (
                  <tr
                    key={team.teamId}
                    className="hover:bg-surface/30 transition-colors text-sm"
                  >
                    <td className="p-4 font-bold text-primary">#{team.rank}</td>
                    <td className="p-4 font-semibold text-text">{team.teamName}</td>
                    <td className="p-4 text-primary font-bold">{team.score} pts</td>
                    <td className="p-4 text-secondary-text">{team.modulesCompleted} / 7</td>
                    <td className="p-4 text-danger/80">-{team.penalties} pts</td>
                    <td className="p-4 text-secondary-text text-xs">
                      {team.lastSolveAt
                        ? new Date(team.lastSolveAt).toLocaleTimeString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
                {leaderboard.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-secondary-text text-xs">
                      No leaderboard data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="glass-panel p-8 text-center">
          <h2 className="font-heading text-2xl uppercase tracking-widest text-primary mb-4">
            Thank You
          </h2>
          <p className="font-mono text-secondary-text leading-7">
            BLACKBOX was never about finding hidden clues.
            <br />
            It was about thinking like an engineer.
            <br />
            <br />
            Observe. Investigate. Connect. Recover.
          </p>
          <p className="font-mono text-primary mt-8">— The Architect</p>
        </div>
      </div>
    </PageTransition>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-secondary-text">
        {title}
      </p>
      <p className="font-heading text-2xl text-primary mt-3 font-bold truncate">
        {value}
      </p>
    </motion.div>
  );
}