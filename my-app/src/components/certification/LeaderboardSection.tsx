"use client";

import { motion } from "framer-motion";
import { Trophy, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export default function LeaderboardSection() {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const leaderboard = [
    {
      rank: 1,
      team: "404_Not_Found",
      verdict: "Accepted",
      penalty: 2,
    },
    {
      rank: 2,
      team: "NullPointers",
      verdict: "Running",
      penalty: 1,
    },
    {
      rank: 3,
      team: "StackSmashers",
      verdict: "Wrong Answer",
      penalty: 4,
    },
    {
      rank: 4,
      team: "SegFault",
      verdict: "Pending",
      penalty: 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel h-full w-full flex flex-col overflow-hidden"    >
      {/* Header */}
      <div className="border-b border-border bg-surface/50 p-4 flex items-center gap-3">
        <Trophy size={18} className="text-secondary-text" />
        <span className="font-mono text-sm tracking-widest text-secondary-text">
          ENGINEER STATUS
        </span>
      </div>

      {/* Timer */}
      <div className="p-6 border-b border-border">

        <div className="flex items-center gap-2 mb-3">
          <Timer size={18} className="text-primary" />
          <span className="font-mono text-sm text-secondary-text">
            TIME REMAINING
          </span>
        </div>

        <div className="font-heading text-4xl tracking-widest text-primary">
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>

      </div>

      {/* Leaderboard */}

      <div className="flex-1 min-h-0 overflow-y-auto p-5">

        <h3 className="font-mono text-sm text-secondary-text uppercase tracking-widest mb-5">
          Live Leaderboard
        </h3>

        <div className="space-y-4">

          {leaderboard.map((team) => (
            <motion.div
              key={team.rank}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-4 border border-border"
            >
              <div className="flex justify-between items-center mb-2">

                <span className="font-heading text-primary text-lg">
                  #{team.rank}
                </span>

                <span className="font-mono text-xs text-secondary-text">
                  +{team.penalty} min
                </span>

              </div>

              <p className="font-mono text-text mb-2">
                {team.team}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded font-mono
                ${
                  team.verdict === "Accepted"
                    ? "bg-primary/20 text-primary"
                    : team.verdict === "Wrong Answer"
                    ? "bg-danger/20 text-danger"
                    : team.verdict === "Running"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-surface text-secondary-text"
                }`}
              >
                {team.verdict}
              </span>
            </motion.div>
          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-border bg-surface/40 p-4">

        <p className="font-mono text-xs text-secondary-text leading-6">
          Rankings are based on:
          <br />
          • Accepted Submission
          <br />
          • Penalty Time
          <br />
          • Submission Timestamp
        </p>

      </div>
    </motion.div>
  );
}