import { QuizRank } from "@/types/quiz.types";

interface CurrentRankSectionProps {
  currentRank: QuizRank;
  progress: number;
  totalLevels: number;
}

export function CurrentRankSection({ currentRank, progress, totalLevels }: CurrentRankSectionProps) {
  return (
    <div className="flex flex-col items-center mb-16">
      <div className="text-[80px] mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
        {currentRank.icon}
      </div>
      <h2 className="font-serif text-4xl mb-2">{currentRank.title}</h2>

      <div className="flex flex-col items-center w-64 mt-4">
        <div className="flex justify-between w-full text-sm text-white/60 mb-1">
          <span>Progress</span>
          <span>
            {progress}/{totalLevels} Levels Completed
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-700"
            style={{ width: `${(progress / totalLevels) * 100}%` }}
          />
        </div>
      </div>
      <p className="text-white/40 text-sm mt-4">
        Complete each level with 3/3 to unlock the next.
      </p>
    </div>
  );
}
