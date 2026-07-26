"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PuzzleBoardProps = {
  imageSrc: string;
  gridSize?: number;
  onSolved: () => void;
};

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

export default function PuzzleBoard({ imageSrc, gridSize = 5, onSolved }: PuzzleBoardProps) {
  const total = gridSize * gridSize;
  const [tiles, setTiles] = useState<number[]>(() => shuffleTiles(gridSize));
  const [moves, setMoves] = useState(0);

  const [fingerprints, setFingerprints] = useState<string[]>([]);
  const solvedRef = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const sample = 8;
      const canvas = document.createElement("canvas");
      canvas.width = gridSize * sample;
      canvas.height = gridSize * sample;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const fps: string[] = [];
      for (let value = 0; value < total; value++) {
        if (value === total - 1) {
          fps.push("BLANK");
          continue;
        }
        const r = Math.floor(value / gridSize);
        const c = value % gridSize;
        const data = ctx.getImageData(c * sample, r * sample, sample, sample).data;
        let fp = "";
        for (let i = 0; i < data.length; i += 4) {
          fp += (((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4)).toString(16);
        }
        fps.push(fp);
      }
      setFingerprints(fps);
    };
  }, [imageSrc, gridSize, total]);

  const blankIndex = tiles.indexOf(total - 1);
  const tileSize = 100 / gridSize;

  const checkSolved = useCallback(
    (arrangement: number[]) => {
      return arrangement.every((value, index) => {
        if (value === index) return true;
        if (fingerprints.length === total) {
          return fingerprints[value] === fingerprints[index] && fingerprints[index] !== "BLANK";
        }
        return false;
      });
    },
    [fingerprints, total]
  );

  const isSolved = checkSolved(tiles);

  const handleTileClick = useCallback(
    (index: number) => {
      if (isSolved) return;
      const neighbors = getNeighbors(blankIndex, gridSize);
      if (!neighbors.includes(index)) return;

      const next = [...tiles];
      [next[blankIndex], next[index]] = [next[index], next[blankIndex]];
      setTiles(next);
      setMoves((m) => m + 1);

      if (!solvedRef.current && checkSolved(next)) {
        solvedRef.current = true;
        onSolved();
      }
    },
    [tiles, blankIndex, gridSize, isSolved, onSolved, checkSolved]
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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-500/40 shadow-[0_3px_0_rgba(0,0,0,0.6)]">
          <span className="text-cyan-400 text-xs font-bold tracking-wider">MOVES</span>
          <span className="text-white text-sm font-bold">{moves}</span>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full border-2 shadow-[0_3px_0_rgba(0,0,0,0.6)] text-xs font-bold tracking-wider ${
            isSolved
              ? "bg-gradient-to-b from-cyan-400 to-cyan-600 border-cyan-200 text-black"
              : "bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 text-black"
          }`}
        >
          {isSolved ? "RESTORED" : "CORRUPTED"}
        </div>
      </div>

      <div className="relative p-[4px] rounded-2xl bg-gradient-to-b from-cyan-400 via-cyan-600 to-cyan-900 shadow-[0_6px_0_rgba(21,94,117,1),0_0_45px_rgba(34,211,238,0.35)]">
        <div
          className="relative bg-[#0a0e17] rounded-[14px] overflow-hidden"
          style={{ width: "min(92vw, 480px)", aspectRatio: "1 / 1" }}
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
                    padding: "1.5px",
                  }}
                >
                  <div className="w-full h-full rounded-sm border border-dashed border-red-500/70 bg-black/60 shadow-[0_0_14px_rgba(239,68,68,0.4),inset_0_2px_6px_rgba(0,0,0,0.8)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse" />
                  </div>
                </div>
              );
            }

            return (
              <button
                key={value}
                onClick={() => handleTileClick(index)}
                disabled={isSolved}
                className="absolute transition-transform duration-300 ease-out active:translate-y-[1px]"
                style={{
                  width: `${tileSize}%`,
                  height: `${tileSize}%`,
                  transform: `translate(${posCol * 100}%, ${posRow * 100}%)`,
                  padding: "1.5px",
                }}
              >
                <div
                  className="w-full h-full rounded-sm border border-cyan-500/60 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-2px_5px_rgba(0,0,0,0.55),0_2px_4px_rgba(0,0,0,0.5)] hover:brightness-110"
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