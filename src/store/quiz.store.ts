import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizState {
  unlockedLevels: string[];
  completedLevels: string[];
  unlockLevel: (level: string) => void;
  completeLevel: (level: string) => void;
  resetProgress: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      unlockedLevels: ["easy"],
      completedLevels: [],

      unlockLevel: (level) =>
        set((state) => ({
          unlockedLevels: state.unlockedLevels.includes(level)
            ? state.unlockedLevels
            : [...state.unlockedLevels, level],
        })),

      completeLevel: (level) =>
        set((state) => ({
          completedLevels: state.completedLevels.includes(level)
            ? state.completedLevels
            : [...state.completedLevels, level],
        })),

      resetProgress: () =>
        set({
          unlockedLevels: ["easy"],
          completedLevels: [],
        }),
    }),
    {
      name: "zoosite_quiz_progress", // unique name for localStorage key
    }
  )
);
