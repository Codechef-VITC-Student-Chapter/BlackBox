"use client";

import Link from "next/link";

export default function CodeChefIntroPage() {
  return (
    <main className="relative min-h-screen bg-[#050810] flex flex-col items-center justify-center gap-8 px-4 overflow-hidden font-mono">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #22d3ee 0px, #22d3ee 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex items-center gap-3 px-6 py-2.5 bg-red-950/40 border-2 border-red-500 rounded shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
        <span className="text-red-400 font-bold tracking-[0.2em] text-xs md:text-sm">
          EMERGENCY ALERT
        </span>
        <span className="w-px h-4 bg-red-700" />
        <span className="text-red-300 font-bold tracking-[0.15em] text-xs md:text-sm">
          SOLVE LOGO
        </span>
      </div>

      <div
        className="relative px-10 py-2 bg-gradient-to-b from-cyan-400 to-cyan-700 border-2 border-cyan-200/60 shadow-[0_4px_0_rgba(21,94,117,1),0_0_25px_rgba(34,211,238,0.5)]"
        style={{
          clipPath: "polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)",
        }}
      >
        <span className="text-black font-bold tracking-[0.2em] text-xs md:text-sm">
          MODULE 4 // VISUAL SUBSYSTEM
        </span>
      </div>

      <div className="relative text-center space-y-3 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-[0_0_14px_rgba(34,211,238,0.4)]">
          LOGO CORRUPTED
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          BLACKBOX's visual subsystem has been shattered into fragments. Reassemble the
          CodeChef logo to restore it and recover the data hidden inside.
        </p>
      </div>

      <Link
        href="/codechef-puzzle/puzzle-board"
        className="relative px-8 py-3 rounded-lg bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-cyan-200 text-black font-bold tracking-widest text-sm uppercase shadow-[0_5px_0_rgba(21,94,117,1),0_0_30px_rgba(34,211,238,0.4)] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_rgba(21,94,117,1)] transition-all"
      >
        Initiate Repair
      </Link>
    </main>
  );
}