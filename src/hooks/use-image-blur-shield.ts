import { useState } from "react";

type BlurLevel = 3 | 2 | 1;

/**
 * Manages per-item image blur levels for safety shield UX.
 * Level 3 = max blur, 2 = medium, 1 = clear.
 * Click cycles 3→2→1 (stops at 1). Reset sends back to 3.
 */
export function useImageBlurShield() {
  const [blurLevels, setBlurLevels] = useState<Record<string, BlurLevel>>({});

  const getBlurLevel = (id: string): BlurLevel => blurLevels[id] ?? 3;

  const cycleBlurLevel = (id: string) => {
    setBlurLevels((prev) => {
      const current = prev[id] ?? 3;
      if (current === 3) return { ...prev, [id]: 2 };
      if (current === 2) return { ...prev, [id]: 1 };
      return prev;
    });
  };

  const resetBlurLevel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlurLevels((prev) => ({ ...prev, [id]: 3 }));
  };

  return { getBlurLevel, cycleBlurLevel, resetBlurLevel };
}