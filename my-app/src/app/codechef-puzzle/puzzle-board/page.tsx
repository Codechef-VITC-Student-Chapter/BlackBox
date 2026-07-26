"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const PuzzleBoard = dynamic(() => import("./PuzzleBoard"), { ssr: false });

function generateFragment() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BBX-${out}`;
}

export default function CodeChefPuzzlePage() {
  const router = useRouter();

  const handleSolved = () => {
    const fragment = generateFragment();
    localStorage.setItem("blackbox_fragment_module4", fragment);
    router.push("/codechef-puzzle/success");
  };

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

      <div className="relative text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-[0_0_14px_rgba(34,211,238,0.4)]">
          LOGO CORRUPTED
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
          Reassemble the CodeChef logo to restore the visual subsystem.
        </p>
      </div>

      <PuzzleBoard imageSrc="/images/logo.png" gridSize={5} onSolved={handleSolved} />

      <p className="relative text-slate-600 text-xs tracking-widest">
        &gt; slide tiles into the empty slot with the red dot
      </p>
    </main>
  );
}