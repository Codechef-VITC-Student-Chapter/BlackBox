"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { synth } from "@/utils/synthAudio";

const DEFAULT_IMAGE_SRC = "/images/logo.png";

function buildSolvedTiles(total: number) {
  return Array.from({ length: total }, (_, i) => i);
}

function getNeighbors(blankIndex: number, size: number) {
  const row = Math.floor(blankIndex / size);
  const col = blankIndex % size;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(blankIndex - size);
  if (row < size - 1) neighbors.push(blankIndex + size);
  if (col > 0) neighbors.push(blankIndex - 1);
  if (col < size - 1) neighbors.push(blankIndex + 1);
  return neighbors;
}

function shuffleTiles(size: number): number[] {
  const total = size * size;
  const moves = total * 25;
  const tiles = buildSolvedTiles(total);
  let blankIndex = total - 1;
  let lastMove = -1;

  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(blankIndex, size).filter((n) => n !== lastMove);
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[blankIndex], tiles[next]] = [tiles[next], tiles[blankIndex]];
    lastMove = blankIndex;
    blankIndex = next;
  }

  if (tiles.every((v, i) => v === i)) return shuffleTiles(size);
  return tiles;
}

export default function PuzzleBoard() {
  const router = useRouter();
  const gridSize = 5;
  const imageSrc = DEFAULT_IMAGE_SRC;
  const total = gridSize * gridSize;
  const [tiles, setTiles] = useState<number[]>(() => buildSolvedTiles(total));
  const [moves, setMoves] = useState(0);
  const [solving, setSolving] = useState(false);

  useEffect(() => {
    setTiles(shuffleTiles(gridSize));
  }, [gridSize]);

  const blankIndex = tiles.indexOf(total - 1);
  const isSolved = tiles.every((value, index) => value === index);
  const tileSize = 100 / gridSize;

  const handleTileClick = useCallback(
    async (index: number) => {
      if (isSolved || solving) return;
      const neighbors = getNeighbors(blankIndex, gridSize);
      if (!neighbors.includes(index)) return;

      const next = [...tiles];
      [next[blankIndex], next[index]] = [next[index], next[blankIndex]];
      setTiles(next);
      setMoves((m) => m + 1);
      synth.playClick();

      // Check if solved after the move
      const newlySolved = next.every((value, idx) => value === idx);
      if (newlySolved) {
        setSolving(true);
        synth.playSuccess();
        try {
          const res = await fetch("/api/codechef-puzzle/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          if (data.encryptedKey) {
            sessionStorage.setItem("bbx_encrypted_key", data.encryptedKey);
          }
        } catch (err) {
          console.error("Failed to complete puzzle api call:", err);
        }
        setTimeout(() => {
          router.push("/codechef-puzzle/success");
        }, 1500);
      }
    },
    [tiles, blankIndex, gridSize, isSolved, solving, router]
  );

  const positions = useMemo(() => {
    return tiles.map((value, index) => {
      const posRow = Math.floor(index / gridSize);
      const posCol = index % gridSize;
      const srcRow = Math.floor(value / gridSize);
      const srcCol = value % gridSize;
      return { value, index, posRow, posCol, srcRow, srcCol };
    });
  }, [tiles, gridSize]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 select-none">
        <div className="flex items-center gap-2 px-4 py-1.5 glass-panel border border-[#1a4a16] bg-[#040804]/90">
          <span className="text-[#33ff66] text-[10px] font-bold tracking-wider">MOVES</span>
          <span className="text-[#33ff66] text-xs font-bold">{moves}</span>
        </div>
        <div
          className={`px-4 py-1.5 border text-[10px] font-bold tracking-wider cursor-default select-none ${
            isSolved
              ? "bg-[#0c1e0b] border-[#33ff66] text-[#33ff66]"
              : "bg-[#3a0c0e] border-[#ff3333] text-[#ff3333]"
          }`}
        >
          {isSolved ? "RESTORED" : "CORRUPTED"}
        </div>
      </div>

      <div className="relative p-[2px] bg-[#1a4a16] border border-[#1a4a16] shadow-[0_0_15px_rgba(51,255,102,0.1)]">
        <div
          className="relative bg-[#030703] overflow-hidden"
          style={{ width: "min(88vw, 320px)", aspectRatio: "1 / 1" }}
        >
          {positions.map(({ value, posRow, posCol, srcRow, srcCol, index }) => {
            const isBlank = value === total - 1;

            if (isBlank) {
              return (
                <div
                  key={value}
                  className="absolute flex items-center justify-center transition-transform duration-300 ease-out"
                  style={{
                    width: `${tileSize}%`,
                    height: `${tileSize}%`,
                    transform: `translate(${posCol * 100}%, ${posRow * 100}%)`,
                    padding: "2px",
                  }}
                >
                  <div className="w-full h-full border border-dashed border-[#ff3333]/80 bg-black/70 flex items-center justify-center animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] shadow-[0_0_8px_rgba(255,51,51,0.8)]" />
                  </div>
                </div>
              );
            }

            return (
              <button
                key={value}
                onClick={() => handleTileClick(index)}
                disabled={isSolved || solving}
                className="absolute transition-transform duration-300 ease-out active:translate-y-[1px] cursor-pointer"
                style={{
                  width: `${tileSize}%`,
                  height: `${tileSize}%`,
                  transform: `translate(${posCol * 100}%, ${posRow * 100}%)`,
                  padding: "2px",
                }}
              >
                <div
                  className="w-full h-full border border-[#1a4a16] overflow-hidden hover:brightness-110"
                  style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${(srcCol * 100) / (gridSize - 1)}% ${(srcRow * 100) / (gridSize - 1)}%`,
                  }}
                />
              </button>
            );
          })}

          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isSolved ? 1 : 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
