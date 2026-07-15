import { useState, useRef, useEffect, useCallback } from "react";
import type { MatchPair } from "@/types/quiz.types";

export interface MatchLink {
  leftId: string;
  rightId: string;
}

export interface LineCoordinate {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  key: string;
}

/** Shuffles an array in-place using the Fisher–Yates algorithm. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Color palette for matched pair indicators */
export const PAIR_COLORS = [
  { bg: "bg-emerald-500/15", border: "border-emerald-500", stroke: "#10b981" },
  { bg: "bg-sky-500/15", border: "border-sky-500", stroke: "#0ea5e9" },
  { bg: "bg-amber-500/15", border: "border-amber-400", stroke: "#f59e0b" },
  { bg: "bg-violet-500/15", border: "border-violet-500", stroke: "#8b5cf6" },
  { bg: "bg-rose-500/15", border: "border-rose-400", stroke: "#fb7185" },
  { bg: "bg-teal-500/15", border: "border-teal-500", stroke: "#14b8a6" },
];

export interface UseMatchupQuestionProps {
  pairs: MatchPair[];
  isAnswered: boolean;
  onComplete: (isCorrect: boolean) => void;
  timedOut?: boolean;
}

export function useMatchupQuestion({
  pairs,
  isAnswered,
  onComplete,
  timedOut,
}: UseMatchupQuestionProps) {
  // Randomize both columns on mount only
  const [leftItems, setLeftItems] = useState<MatchPair[]>(() => shuffle(pairs));
  const [rightItems, setRightItems] = useState<MatchPair[]>(() => shuffle(pairs));

  // Sync shuffled items with pairs prop updates (preserving the shuffled order) so preview adjustments live-update
  useEffect(() => {
    setLeftItems((prev) =>
      prev.map((item) => {
        const updated = pairs.find((p) => p.id === item.id);
        return updated ? { ...item, ...updated } : item;
      })
    );
    setRightItems((prev) =>
      prev.map((item) => {
        const updated = pairs.find((p) => p.id === item.id);
        return updated ? { ...item, ...updated } : item;
      })
    );
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [links, setLinks] = useState<MatchLink[]>([]);

  // Refs for SVG line coordinate calculation
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Coordinate state for SVG lines
  const [lineCoords, setLineCoords] = useState<LineCoordinate[]>([]);

  // Calculate SVG line coordinates from matched elements
  const recalcLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const coords = links
      .map((link, idx) => {
        const leftEl = leftRefs.current[link.leftId];
        const rightEl = rightRefs.current[link.rightId];
        if (!leftEl || !rightEl) return null;

        const lr = leftEl.getBoundingClientRect();
        const rr = rightEl.getBoundingClientRect();

        return {
          x1: lr.right - containerRect.left,
          y1: lr.top + lr.height / 2 - containerRect.top,
          x2: rr.left - containerRect.left,
          y2: rr.top + rr.height / 2 - containerRect.top,
          color: PAIR_COLORS[idx % PAIR_COLORS.length].stroke,
          key: `${link.leftId}-${link.rightId}`,
        };
      })
      .filter(Boolean) as LineCoordinate[];

    setLineCoords(coords);
  }, [links]);

  useEffect(() => {
    recalcLines();
    window.addEventListener("resize", recalcLines);
    return () => window.removeEventListener("resize", recalcLines);
  }, [recalcLines]);

  // Handle timeout: auto-submit with wrong answer
  useEffect(() => {
    if (timedOut && !isAnswered) {
      onComplete(false);
    }
  }, [timedOut, isAnswered, onComplete]);

  // Check if all pairs are matched, then auto-verify
  useEffect(() => {
    if (links.length === pairs.length && !isAnswered) {
      // Verify all matches
      const allCorrect = links.every((link) => {
        const pair = pairs.find((p) => p.id === link.leftId);
        return pair && pair.id === link.rightId;
      });
      onComplete(allCorrect);
    }
  }, [links, pairs, isAnswered, onComplete]);

  // Pre-populate links if isAnswered is true on mount (e.g. in preview modal with Show Answers)
  useEffect(() => {
    if (isAnswered && links.length === 0) {
      const correctLinks = pairs.map((p) => ({ leftId: p.id, rightId: p.id }));
      setLinks(correctLinks);
    }
  }, [isAnswered, pairs, links.length]);

  const getMatchColorIndex = useCallback(
    (side: "left" | "right", id: string): number | null => {
      const idx = links.findIndex((l) =>
        side === "left" ? l.leftId === id : l.rightId === id
      );
      return idx >= 0 ? idx : null;
    },
    [links]
  );

  const isLinked = useCallback(
    (side: "left" | "right", id: string): boolean => {
      return links.some((l) =>
        side === "left" ? l.leftId === id : l.rightId === id
      );
    },
    [links]
  );

  const handleLeftClick = useCallback(
    (id: string) => {
      if (isAnswered) return;
      if (isLinked("left", id)) {
        setLinks((prev) => prev.filter((l) => l.leftId !== id));
        return;
      }
      setSelectedLeft(id);
    },
    [isAnswered, isLinked]
  );

  const handleRightClick = useCallback(
    (id: string) => {
      if (isAnswered || !selectedLeft) return;
      if (isLinked("right", id)) {
        setLinks((prev) => prev.filter((l) => l.rightId !== id));
        return;
      }
      // Create a new link
      setLinks((prev) => [...prev, { leftId: selectedLeft, rightId: id }]);
      setSelectedLeft(null);
    },
    [isAnswered, selectedLeft, isLinked]
  );

  return {
    leftItems,
    rightItems,
    selectedLeft,
    links,
    lineCoords,
    containerRef,
    leftRefs,
    rightRefs,
    getMatchColorIndex,
    isLinked,
    handleLeftClick,
    handleRightClick,
  };
}