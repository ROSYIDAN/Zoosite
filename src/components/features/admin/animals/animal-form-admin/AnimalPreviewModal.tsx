"use client";

import { usePreviewLayout } from "@/hooks/use-preview-layout";
import DetailPagePreview from "./detail-page-preview";
import CardPreview from "./card-preview";
import LayoutSlider from "./layout-slider";

interface AnimalPreviewModalProps {
  imageUrl: string;
  imageSource?: string;
  photographerName?: string;
  commonName: string;
  scientificName?: string;
  description?: string;
  descriptionSource?: string;
  diet?: string;
  tags?: string[];
  taxonomy?: {
    class_name?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
  onApply: (newImageUrl: string) => void;
  onClose: () => void;
}

export default function AnimalPreviewModal({
  imageUrl,
  imageSource,
  photographerName,
  commonName,
  scientificName,
  description,
  descriptionSource,
  diet,
  tags,
  taxonomy,
  onApply,
  onClose,
}: AnimalPreviewModalProps) {
  const layout = usePreviewLayout({ imageUrl, onApply, onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-[#1a1c19]/90 backdrop-blur-sm">
      {/* LEFT: Live Preview Split Canvas */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-stone-100/50">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">Live Layout Canvas</h1>
            <p className="text-xs text-[#72796e] mt-1 font-['Manrope']">View details page alignment alongside card layout side-by-side.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start my-auto w-full max-w-6xl mx-auto">
          <DetailPagePreview
            imageUrl={layout.parsed.url || layout.localImageUrl}
            commonName={commonName}
            scientificName={scientificName}
            description={description}
            descriptionSource={descriptionSource}
            diet={diet}
            tags={tags}
            taxonomy={taxonomy}
            imageSource={imageSource}
            photographerName={photographerName}
            imageStyle={layout.parsed.style}
          />

          <CardPreview
            imageUrl={layout.parsed.url || layout.localImageUrl}
            commonName={commonName}
            diet={diet}
            tags={tags}
            cardStyle={layout.parsed.cardStyle}
          />
        </div>
      </div>

      {/* RIGHT: Layout Editor Controls */}
      <div className="w-[400px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.15)] z-10 shrink-0 border-l border-[#e3e3de]">
        <div className="p-6 border-b border-[#e3e3de] bg-stone-50">
          <h2 className="text-xl font-bold text-[#1a1c19] font-['Plus_Jakarta_Sans'] tracking-tight">Dual-Layout Editor</h2>
          <p className="text-xs text-[#72796e] mt-1 font-['Manrope'] leading-relaxed">
            Position how the image crop renders across details hero banners and index cards.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Detail Page layout controls */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl border border-[#c2c9bb] bg-[#fafaf5]">
            <h3 className="text-sm font-bold text-[#1a1c19] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <span className="material-symbols-outlined text-[18px] text-[#2d5a27]">menu_book</span>
              Detail Page Hero Layout
            </h3>

            <div>
              <label className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider block mb-1.5 font-['Plus_Jakarta_Sans']">Fit Strategy</label>
              <div className="flex bg-[#e3e3de] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => layout.handleUpdateDetailOptions({ fit: "cover" })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${layout.detailFit === "cover" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                >
                  Cover (Fill)
                </button>
                <button
                  type="button"
                  onClick={() => layout.handleUpdateDetailOptions({ fit: "contain" })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${layout.detailFit === "contain" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                >
                  Contain
                </button>
              </div>
            </div>

            <LayoutSlider label="Position X (Horizontal)" value={layout.detailX} onChange={(val) => layout.handleUpdateDetailOptions({ x: val })} disabled={layout.detailFit === "contain"} />
            <LayoutSlider label="Position Y (Vertical)" value={layout.detailY} onChange={(val) => layout.handleUpdateDetailOptions({ y: val })} disabled={layout.detailFit === "contain"} />
          </div>

          {/* Card Layout controls */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl border border-[#c2c9bb] bg-[#fafaf5]">
            <h3 className="text-sm font-bold text-[#1a1c19] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <span className="material-symbols-outlined text-[18px] text-[#2d5a27]">portrait</span>
              User Card Layout
            </h3>

            <label className="flex items-center gap-2.5 cursor-pointer select-none pb-2 border-b border-[#e3e3de]/75">
              <input
                type="checkbox"
                checked={layout.linkLayouts}
                onChange={(e) => layout.handleToggleLink(e.target.checked)}
                className="w-4 h-4 rounded border-[#c2c9bb] text-[#2d5a27] focus:ring-[#2d5a27]/30 cursor-pointer"
              />
              <span className="text-xs text-[#1a1c19]/80 font-bold font-['Manrope']">Link Card to Detail Layout</span>
            </label>

            <div className={`flex flex-col gap-4 transition-all duration-300 ${layout.linkLayouts ? "opacity-35 pointer-events-none select-none" : "opacity-100"}`}>
              <div>
                <label className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider block mb-1.5 font-['Plus_Jakarta_Sans']">Fit Strategy</label>
                <div className="flex bg-[#e3e3de] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => layout.handleUpdateCardOptions({ cardFit: "cover" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${layout.cardFitVal === "cover" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                    disabled={layout.linkLayouts}
                  >
                    Cover (Fill)
                  </button>
                  <button
                    type="button"
                    onClick={() => layout.handleUpdateCardOptions({ cardFit: "contain" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${layout.cardFitVal === "contain" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                    disabled={layout.linkLayouts}
                  >
                    Contain
                  </button>
                </div>
              </div>

              <LayoutSlider label="Position X (Horizontal)" value={layout.cardXVal} onChange={(val) => layout.handleUpdateCardOptions({ cardX: val })} disabled={layout.linkLayouts || layout.cardFitVal === "contain"} />
              <LayoutSlider label="Position Y (Vertical)" value={layout.cardYVal} onChange={(val) => layout.handleUpdateCardOptions({ cardY: val })} disabled={layout.linkLayouts || layout.cardFitVal === "contain"} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#e3e3de] flex gap-3 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#c2c9bb] text-[#42493e] font-bold text-sm hover:bg-[#e3e3de] transition-all font-['Plus_Jakarta_Sans']"
          >
            Cancel
          </button>
          <button
            onClick={layout.handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2d5a27] text-white font-bold text-sm shadow-md hover:bg-[#1f3f1b] hover:shadow-lg transition-all font-['Plus_Jakarta_Sans']"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}