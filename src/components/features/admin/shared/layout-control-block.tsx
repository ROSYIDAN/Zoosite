"use client";

import { parseMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";

interface LayoutControlBlockProps {
  title: string;
  url: string;
  onChange: (opts: MediaLayoutOptions) => void;
}

export function LayoutControlBlock({ title, url, onChange }: LayoutControlBlockProps) {
  const parsed = parseMediaUrl(url);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-[#c2c9bb] bg-[#fafaf5]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded bg-black/5 flex-shrink-0 border border-[#c2c9bb] overflow-hidden">
          <img src={parsed.url} className="w-full h-full object-cover" alt="Preview" />
        </div>
        <h3 className="font-bold text-[#1a1c19] text-sm line-clamp-1 flex-1">{title}</h3>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-bold text-[#72796e] uppercase mb-1 block">Fit Strategy</label>
          <div className="flex bg-[#e3e3de] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ ...parsed.options, fit: "cover" })}
              className={`flex-1 py-1.5 text-xs font-bold rounded ${parsed.options.fit === "cover" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
            >
              Cover (Fill)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...parsed.options, fit: "contain" })}
              className={`flex-1 py-1.5 text-xs font-bold rounded ${parsed.options.fit === "contain" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
            >
              Contain (Full Image)
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-[#72796e] uppercase">Position X (Pan)</span>
            <span className="text-[#2d5a27] font-bold">{parsed.options.x}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={parsed.options.x}
            onChange={(e) => onChange({ ...parsed.options, x: parseInt(e.target.value, 10) })}
            className="w-full accent-[#2d5a27]"
            disabled={parsed.options.fit === "contain"}
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-[#72796e] uppercase">Position Y (Pan)</span>
            <span className="text-[#2d5a27] font-bold">{parsed.options.y}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={parsed.options.y}
            onChange={(e) => onChange({ ...parsed.options, y: parseInt(e.target.value, 10) })}
            className="w-full accent-[#2d5a27]"
            disabled={parsed.options.fit === "contain"}
          />
        </div>
      </div>
    </div>
  );
}
