"use client";

interface TagListProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
}

export default function TagList({ tags, onRemoveTag }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5a27]/10 text-[#2d5a27] text-xs font-bold font-['Manrope'] border border-[#2d5a27]/20"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemoveTag(tag)}
            className="hover:text-red-500 transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}
    </div>
  );
}
