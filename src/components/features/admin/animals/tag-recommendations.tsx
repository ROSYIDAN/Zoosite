"use client";

interface TagRecommendationsProps {
  recommendedTags: string[];
  onAddTag: (tag: string) => void;
}

export default function TagRecommendations({ recommendedTags, onAddTag }: TagRecommendationsProps) {
  if (recommendedTags.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-1 select-none">
      <span className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
        Recommended Tags
      </span>
      <div className="flex flex-wrap gap-1.5">
        {recommendedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onAddTag(tag)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#fafaf5] hover:bg-[#2d5a27]/10 hover:text-[#2d5a27] border border-[#c2c9bb]/60 text-[#1a1c19]/60 text-xs font-bold font-['Manrope'] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
