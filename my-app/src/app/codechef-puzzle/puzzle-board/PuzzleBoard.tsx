"use client";

import { useCallback, useMemo, useState } from "react";

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

  const blankIndex = tiles.indexOf(total - 1);
  const isSolved = tiles.every((value, index) => value === index);
  const tileSize = 100 / gridSize;

  const handleTileClick = useCallback(
    (index: number) => {
      if (isSolved) return;
      const neighbors = getNeighbors(blankIndex, gridSize);
      if (!neighbors.includes(index)) return;

      const next = [...tiles];
      [next[blankIndex], next[index]] = [next[index], next[blankIndex]];
      setTiles(next);
      setMoves((m) => m + 1);

      const nextIsSolved = next.every((value, i) => value === i);
      if (nextIsSolved) {
        onSolved();
      }
    },
    [tiles, blankIndex, gridSize, isSolved, onSolved]
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
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-2 border-primary/40">
          <span className="text-primary text-xs font-bold tracking-wider">MOVES</span>
          <span className="text-foreground text-sm font-bold">{moves}</span>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full border-2 shadow-[0_3px_0_rgba(0,0,0,0.6)] text-xs font-bold tracking-wider cursor-default select-none ${
            isSolved
              ? "bg-primary border-primary/60 text-black"
              : "bg-amber-600 border-amber-300 text-black"
          }`}
        >
          {isSolved ? "RESTORED" : "CORRUPTED"}
        </div>
      </div>

      <div className="relative p-[4px] rounded-2xl bg-primary/80 shadow-[0_6px_0_rgba(21,94,117,1),0_0_45px_rgba(34,211,238,0.35)]">
        <div
          className="relative bg-surface rounded-[14px] overflow-hidden"
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
                    padding: "4px",
                  }}
                >
                  <div className="w-full h-full rounded-md border-2 border-dashed border-red-500/80 bg-black/70 shadow-[0_0_18px_rgba(239,68,68,0.5),inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,1)]" />
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
                  padding: "4px",
                }}
              >
                <div
                  className="w-full h-full rounded-md border border-primary/60 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-2px_5px_rgba(0,0,0,0.55),0_2px_4px_rgba(0,0,0,0.5)] hover:brightness-110"
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