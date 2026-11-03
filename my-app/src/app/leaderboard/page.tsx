"use client";

import { useEffect, useState } from "react";
import { Trophy, ArrowLeft, RefreshCw, Loader2, Award, Users, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { LeaderboardEntry } from "@/lib/scoring/ctfd";

export default function GlobalLeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadLeaderboard(isManual = false) {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
        }
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(() => loadLeaderboard(), 10000);
    return () => clearInterval(interval);
  }, []);

  const totalTeams = leaderboard.length;
  const topTeam = leaderboard[0];
  const totalSolves = leaderboard.reduce((sum, t) => sum + (t.modulesCompleted || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-zinc-50 font-sans">

      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-zinc-50 px-4 py-2 shadow-sm backdrop-blur-md"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <button
          onClick={() => loadLeaderboard(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-zinc-50 px-3.5 py-2 shadow-sm backdrop-blur-md"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin text-emerald-400" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:p-8 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Event Standings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50">
              Leaderboard
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg">
              Real-time standings across all system recovery modules.
            </p>
          </div>

          <div className="h-14 w-14 rounded-xl border border-zinc-800/80 bg-zinc-900/60 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
            <Trophy size={28} />
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-1.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Teams</span>
            <Users size={16} />
          </div>
          <div className="text-2xl font-bold text-zinc-50">{totalTeams}</div>
          <p className="text-xs text-zinc-500">Registered Participants</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-1.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Leading Team</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-50 truncate">
            {topTeam ? topTeam.teamName : "N/A"}
          </div>
          <p className="text-xs text-zinc-500">
            {topTeam ? `${topTeam.score} pts` : "No scores yet"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-1.5 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider">Modules Solved</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-50">{totalSolves}</div>
          <p className="text-xs text-zinc-500">Across All Teams</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-sm backdrop-blur-md">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Standings Table</h2>
            <p className="text-xs text-zinc-400">Ranked by score and solve timestamp</p>
          </div>
          {loading && <Loader2 size={16} className="animate-spin text-zinc-400" />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="border-b border-zinc-800/80 bg-zinc-950/40 text-xs font-medium uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4 w-24">Rank</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4 text-center">Current Module</th>
                <th className="px-6 py-4 text-center">Modules Solved</th>
                <th className="px-6 py-4 text-right">Score</th>
                <th className="px-6 py-4 text-right">Last Solve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {leaderboard.map((team) => (
                <tr
                  key={team.teamId}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-zinc-200">
                    <div className="flex items-center gap-1.5">
                      {team.rank === 1 && <span className="text-amber-400 font-bold">🥇</span>}
                      {team.rank === 2 && <span className="text-zinc-300 font-bold">🥈</span>}
                      {team.rank === 3 && <span className="text-amber-600 font-bold">🥉</span>}
                      <span>#{team.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-100">{team.teamName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
                      Module 0{team.currentModule}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-zinc-300 font-medium">
                    {team.modulesCompleted} / 7
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    {team.score} pts
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-zinc-400">
                    {team.lastSolveAt
                      ? new Date(team.lastSolveAt).toLocaleTimeString()
                      : "—"}
                  </td>
                </tr>
              ))}

              {leaderboard.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 text-sm">
                    No team scores recorded yet. Standings will update on first module solve.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
