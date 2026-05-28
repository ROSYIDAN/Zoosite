import { MdLock, MdCheckCircle } from "react-icons/md";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  level: "easy" | "normal" | "hard";
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  unlockRequirement?: string;
  onStart: () => void;
}

const levelConfig = {
  easy: {
    label: "Easy",
    badgeClasses: "bg-green-500/20 text-green-400 border-green-500/30",
    buttonClasses: "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]",
  },
  normal: {
    label: "Normal",
    badgeClasses: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    buttonClasses: "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  },
  hard: {
    label: "Hard",
    badgeClasses: "bg-red-500/20 text-red-400 border-red-500/30",
    buttonClasses: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]",
  },
};

export function LevelCard({
  level,
  title,
  description,
  isUnlocked,
  isCompleted,
  unlockRequirement,
  onStart,
}: LevelCardProps) {
  const config = levelConfig[level];

  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border rounded-3xl p-6 flex flex-col transition-all relative overflow-hidden",
        isUnlocked
          ? "border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
          : "border-white/5 opacity-60"
      )}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
            <MdLock size={24} className="text-white/80" />
          </div>
          {unlockRequirement && (
            <span className="text-sm font-semibold text-white/80">{unlockRequirement}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded-full border uppercase tracking-wider",
            config.badgeClasses
          )}
        >
          {config.label}
        </span>
        {isCompleted && <MdCheckCircle className="text-green-500" size={20} />}
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-6 flex-grow">{description}</p>

      <button
        onClick={onStart}
        disabled={!isUnlocked}
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all",
          isUnlocked ? config.buttonClasses : "bg-white/10 text-white/30"
        )}
      >
        Start Quiz
      </button>
    </div>
  );
}
