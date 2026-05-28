"use client";

import { parseMediaUrl } from "@/lib/media-utils";

interface SelectedPreviewProps {
  url: string;
  isLinked: boolean;
  onClear: () => void;
}

export default function SelectedPreview({ url, isLinked, onClear }: SelectedPreviewProps) {
  const parsed = parseMediaUrl(url);

  return (
    <div className="relative group rounded-xl overflow-hidden border border-[#c2c9bb] bg-[#fafaf5] aspect-video max-h-48 flex items-center justify-center">
      <img
        src={parsed.url || url}
        alt="Selected"
        className="w-full h-full"
        style={parsed.style}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="bg-white/90 hover:bg-white text-[#ba1a1a] p-2 rounded-full shadow-lg transition-transform hover:scale-110"
          title="Remove image"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
        <div className="bg-white/90 text-[#2d5a27] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {isLinked ? "Linked" : "Uploaded"}
        </div>
      </div>
    </div>
  );
}
