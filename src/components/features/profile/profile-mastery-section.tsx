import React from "react";

interface ProfileMasterySectionProps {
  completedLevels: string[];
}

export const ProfileMasterySection: React.FC<ProfileMasterySectionProps> = ({
  completedLevels = [],
}) => {
  // Normalize levels to lowercase
  const activeLevels = completedLevels.map((lvl) => lvl.toLowerCase());
  const completedCount = activeLevels.length;

  const isEasyCompleted = activeLevels.includes("easy");
  const isNormalCompleted = activeLevels.includes("normal");
  const isHardCompleted = activeLevels.includes("hard");

  // Determine Rank Name
  const getRankName = () => {
    if (completedCount === 3) return "Apex Predator";
    if (completedCount === 2) return "Wildlife Scholar";
    if (completedCount === 1) return "Novice Explorer";
    return "Aspiring Naturalist";
  };

  const rank = getRankName();

  // SVG Progress Ring calculations
  const radius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (completedCount / 3) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full rounded-3xl border border-[#c2c9bb]/60 bg-[#ffffff]/60 backdrop-blur-md shadow-md p-6 flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#2d5a27]">workspace_premium</span>
          Quiz Mastery
        </h2>

        <div className="flex items-center gap-6 mt-4">
          {/* Circular Progress Ring */}
          <div className="relative shrink-0 w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#eeeee9]"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Foreground progress circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[#154212] transition-all duration-500 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-headline font-bold text-[#1a1c19] leading-none">
                {completedCount}
              </span>
              <span className="text-[10px] text-[#42493e] font-body uppercase font-bold tracking-wider mt-0.5">
                of 3
              </span>
            </div>
          </div>

          {/* Rank details */}
          <div className="flex-1">
            <p className="text-xs text-[#42493e] font-body uppercase tracking-wider font-bold">
              Current Rank
            </p>
            <p className="text-lg font-headline font-bold text-[#154212] mt-0.5">
              {rank}
            </p>
            <p className="text-xs text-[#42493e] font-body mt-1">
              Complete quiz levels to unlock superior titles & privileges.
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Levels Status list */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {/* Easy */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
            isEasyCompleted
              ? "bg-[#bcf0ae]/20 border-[#a1d494] text-[#154212]"
              : "bg-[#fafaf5]/60 border-[#c2c9bb]/60 text-[#42493e]/55"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] mb-1">
            {isEasyCompleted ? "check_circle" : "lock"}
          </span>
          <span className="text-xs font-semibold font-body">Easy</span>
        </div>

        {/* Normal */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
            isNormalCompleted
              ? "bg-[#bcf0ae]/20 border-[#a1d494] text-[#154212]"
              : "bg-[#fafaf5]/60 border-[#c2c9bb]/60 text-[#42493e]/55"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] mb-1">
            {isNormalCompleted ? "check_circle" : "lock"}
          </span>
          <span className="text-xs font-semibold font-body">Normal</span>
        </div>

        {/* Hard */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
            isHardCompleted
              ? "bg-[#bcf0ae]/20 border-[#a1d494] text-[#154212]"
              : "bg-[#fafaf5]/60 border-[#c2c9bb]/60 text-[#42493e]/55"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] mb-1">
            {isHardCompleted ? "check_circle" : "lock"}
          </span>
          <span className="text-xs font-semibold font-body">Hard</span>
        </div>
      </div>
    </div>
  );
};
