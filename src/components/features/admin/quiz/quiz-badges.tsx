import { cn } from "@/lib/utils";

type DifficultyLevel = "EASY" | "NORMAL" | "HARD";
type FormatType = "SINGLE_PICK_LIST" | "MULTI_PICK_GRID" | "IMAGE_RECOGNITION" | "TRUE_FALSE";

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const styles: Record<DifficultyLevel, string> = {
    EASY: "bg-[#bcf0ae] text-[#002201]",
    NORMAL: "bg-[#ffdcc5] text-[#301400]",
    HARD: "bg-[#ffdad6] text-[#93000a]",
  };
  const labels: Record<DifficultyLevel, string> = {
    EASY: "Easy",
    NORMAL: "Normal",
    HARD: "Hard",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        styles[level]
      )}
    >
      {labels[level]}
    </span>
  );
}

interface FormatBadgeProps {
  pattern: FormatType;
}

export function FormatBadge({ pattern }: FormatBadgeProps) {
  const labels: Record<FormatType, string> = {
    SINGLE_PICK_LIST: "Single Pick",
    MULTI_PICK_GRID: "Multi Pick",
    IMAGE_RECOGNITION: "Image Recognition",
    TRUE_FALSE: "True / False",
  };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-[#c2c9bb] bg-white text-[#42493e] text-xs font-medium">
      {labels[pattern]}
    </span>
  );
}
