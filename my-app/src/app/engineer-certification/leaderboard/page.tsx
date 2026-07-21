"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Trophy, Terminal, Medal } from "lucide-react";

export default function FinalLeaderboardPage() {
  const leaderboard = [
    {
      rank: 1,
      team: "ByteBreakers",
      modules: "6/6",
      penalty: "0",
      time: "01:21:34",
    },
    {
      rank: 2,
      team: "StackSmashers",
      modules: "6/6",
      penalty: "2",
      time: "01:25:12",
    },
    {
      rank: 3,
      team: "NullPointers",
      modules: "6/6",
      penalty: "4",
      time: "01:29:45",
    },
    {
      rank: 4,
      team: "Segmentation Fault",
      modules: "6/6",
      penalty: "5",
      time: "01:34:18",
    },
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}

        <div className="glass-panel overflow-hidden">

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">
            <Terminal size={18} className="text-secondary-text" />

            <span className="font-mono text-sm uppercase tracking-widest text-secondary-text">
              BLACKBOX Complete
            </span>
          </div>

          <div className="p-8 text-center">

            <Trophy
              size={65}
              className="mx-auto text-primary mb-5"
            />

            <h1 className="font-heading text-4xl uppercase tracking-widest text-primary">
              Congratulations
            </h1>

            <p className="font-mono text-secondary-text mt-3">
              BLACKBOX has been fully restored.
            </p>

          </div>

        </div>

        {/* Team Photo */}

        <div className="glass-panel p-8">

          <h2 className="font-heading text-xl uppercase tracking-widest text-primary mb-6">
            Team Photo
          </h2>

          <div className="border-[8px] border-yellow-500 rounded-xl p-3 w-fit mx-auto">

            {/* Temporary Placeholder */}

            <div className="w-[650px] h-[360px] rounded-lg bg-surface flex items-center justify-center">

              <p className="font-mono text-secondary-text">
                Team Photo Appears Here
              </p>

            </div>

          </div>

          <p className="font-mono text-center text-secondary-text mt-5">
            🥇 Champion Frame
          </p>

        </div>

        {/* Team Stats */}

        <div className="grid md:grid-cols-4 gap-5">

          <StatCard
            title="Team"
            value="ByteBreakers"
          />

          <StatCard
            title="Final Rank"
            value="#1"
          />

          <StatCard
            title="Recovery Time"
            value="01:21:34"
          />

          <StatCard
            title="Penalty"
            value="+0 min"
          />

        </div>

        {/* Leaderboard */}

        <div className="glass-panel overflow-hidden">

          <div className="border-b border-border bg-surface/40 p-4 flex items-center gap-3">

            <Medal size={18} className="text-primary" />

            <span className="font-mono uppercase tracking-widest text-sm">
              Final Leaderboard
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full font-mono">

              <thead className="border-b border-border text-secondary-text">

                <tr>

                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">Team</th>
                  <th className="p-4 text-left">Modules</th>
                  <th className="p-4 text-left">Penalty</th>
                  <th className="p-4 text-left">Time</th>

                </tr>

              </thead>

              <tbody>

                {leaderboard.map((team) => (

                  <tr
                    key={team.rank}
                    className="border-b border-border hover:bg-surface/30 transition"
                  >

                    <td className="p-4">{team.rank}</td>
                    <td className="p-4">{team.team}</td>
                    <td className="p-4">{team.modules}</td>
                    <td className="p-4">{team.penalty}</td>
                    <td className="p-4">{team.time}</td>

                  </tr>

                ))}

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

            <br /><br />

            Observe.

            Investigate.

            Connect.

            Recover.

          </p>

          <p className="font-mono text-primary mt-8">
            — The Architect
          </p>

        </div>

      </div>
    </PageTransition>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-5"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-secondary-text">
        {title}
      </p>

      <p className="font-heading text-2xl text-primary mt-3">
        {value}
      </p>
    </motion.div>
  );
}