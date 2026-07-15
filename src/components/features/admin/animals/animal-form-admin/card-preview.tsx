import type { CSSProperties } from "react";

interface CardPreviewProps {
  imageUrl: string;
  commonName: string;
  diet?: string;
  tags?: string[];
  cardStyle: CSSProperties;
}

export default function CardPreview({
  imageUrl,
  commonName,
  diet,
  tags,
  cardStyle,
}: CardPreviewProps) {
  return (
    <div className="bg-white border border-[#c2c9bb] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#e3e3de] pb-3">
        <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-wider font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">portrait</span>
          User Card Grid View
        </span>
        <span className="text-[10px] bg-stone-100 text-[#72796e] px-2 py-0.5 rounded font-mono font-bold">16:9 (Aspect Video)</span>
      </div>

      <div className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl border border-dashed border-[#c2c9bb]/60 min-h-[280px]">
        {/* Mock User Card */}
        <div className="bg-white border border-outline-variant/10 rounded-2xl overflow-hidden shadow-md w-full max-w-[280px] group transition-all duration-300">
          <div className="aspect-video relative overflow-hidden bg-stone-100">
            <img
              src={imageUrl}
              alt={commonName}
              className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
              style={cardStyle}
            />
          </div>
          <div className="p-4 flex flex-col gap-2">
            <h3 className="font-bold text-base text-[#1a1c19] truncate font-['Plus_Jakarta_Sans']">
              {commonName || "Animal Common Name"}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-[#72796e] font-semibold uppercase tracking-wider font-['Manrope']">
              <span className="material-symbols-outlined text-[12px] text-[#2d5a27]">restaurant</span>
              <span>{diet || "Diet Category"}</span>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.slice(0, 2).map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[9px] font-semibold bg-[#2d5a27]/5 text-[#2d5a27] border border-[#2d5a27]/10 rounded-md font-['Manrope']">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}