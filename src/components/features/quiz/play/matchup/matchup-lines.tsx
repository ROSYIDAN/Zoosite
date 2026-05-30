"use client";

import { motion } from "framer-motion";

interface LineCoord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  key: string;
}

export interface MatchupLinesProps {
  lineCoords: LineCoord[];
}

export function MatchupLines({ lineCoords }: MatchupLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: "visible" }}
    >
      {lineCoords.map((coord) => {
        // Calculate curve offsets for smooth Bezier path transitions
        const dx = coord.x2 - coord.x1;
        const cpOffset = Math.min(Math.abs(dx) * 0.4, 80);
        const path = `M ${coord.x1} ${coord.y1} C ${coord.x1 + cpOffset} ${coord.y1}, ${coord.x2 - cpOffset} ${coord.y2}, ${coord.x2} ${coord.y2}`;

        return (
          <motion.path
            key={coord.key}
            d={path}
            fill="none"
            stroke={coord.color}
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            filter="drop-shadow(0 0 6px rgba(255,255,255,0.15))"
          />
        );
      })}
    </svg>
  );
}
