"use client";

import { useState, useEffect } from "react";
import { parseMediaUrl, encodeMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";
import AnimalHeader from "@/components/animal_details/AnimalHeader";
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
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const parsed = parseMediaUrl(localImageUrl);
  const { fit, x, y, cardFit, cardX, cardY } = parsed.options;

  // Linked if card options are undefined in the hash
  const linkLayouts = cardFit === undefined && cardX === undefined && cardY === undefined;

  const handleUpdateDetailOptions = (updates: Partial<Pick<MediaLayoutOptions, "fit" | "x" | "y">>) => {
    if (parsed.url) {
      const newOptions: MediaLayoutOptions = {
        ...parsed.options,
        ...updates,
      };
      if (linkLayouts) {
        newOptions.cardFit = undefined;
        newOptions.cardX = undefined;
        newOptions.cardY = undefined;
      }
      setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleUpdateCardOptions = (updates: Partial<Pick<MediaLayoutOptions, "cardFit" | "cardX" | "cardY">>) => {
    if (parsed.url) {
      const newOptions: MediaLayoutOptions = {
        ...parsed.options,
        ...updates,
      };
      setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleToggleLink = (checked: boolean) => {
    if (parsed.url) {
      if (checked) {
        // Link layouts: clear card options so it inherits detail options
        const newOptions: MediaLayoutOptions = {
          fit: parsed.options.fit,
          x: parsed.options.x,
          y: parsed.options.y,
          cardFit: undefined,
          cardX: undefined,
          cardY: undefined,
        };
        setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
      } else {
        // Unlink: clone detail options to card options
        const newOptions: MediaLayoutOptions = {
          fit: parsed.options.fit,
          x: parsed.options.x,
          y: parsed.options.y,
          cardFit: parsed.options.fit,
          cardX: parsed.options.x,
          cardY: parsed.options.y,
        };
        setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
      }
    }
  };

  const handleApply = () => {
    onApply(localImageUrl);
    onClose();
  };

  // Safe parsed values for UI inputs
  const detailFit = fit;
  const detailX = x;
  const detailY = y;

  const cardFitVal = cardFit || fit;
  const cardXVal = cardX !== undefined ? cardX : x;
  const cardYVal = cardY !== undefined ? cardY : y;

  const renderImageBadge = () => {
    const isUrl = (str?: string | null): boolean => {
      if (!str) return false;
      return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("www.");
    };

    const getHref = (str?: string | null): string => {
      if (!str) return "";
      if (str.startsWith("www.")) {
        return `https://${str}`;
      }
      return str;
    };

    const hasLink = isUrl(imageSource);
    const href = getHref(imageSource);

    let displayLabel = "";
    if (photographerName) {
      displayLabel = `Photo by ${photographerName}`;
      if (imageSource && !hasLink) {
        displayLabel += ` (${imageSource})`;
      }
    } else if (imageSource) {
      if (hasLink) {
        displayLabel = "Photo Source";
      } else {
        displayLabel = imageSource;
      }
    }

    if (!displayLabel) return null;

    return (
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
        <p className="text-[8px] text-white/90 font-['Manrope'] font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[10px]">person</span>
          {hasLink ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 hover:text-white"
            >
              {displayLabel}
              <span className="material-symbols-outlined text-[8px] shrink-0">open_in_new</span>
            </a>
          ) : (
            <span>{displayLabel}</span>
          )}
        </p>
      </div>
    );
  };

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
          {/* Detail Page Preview */}
          <div className="bg-white border border-[#c2c9bb] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#e3e3de] pb-3">
              <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-wider font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Detail Page Hero View
              </span>
              <span className="text-[10px] bg-stone-100 text-[#72796e] px-2 py-0.5 rounded font-mono font-bold">584 x 452 (Aspect Ratio)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="relative group">
                  <div className="w-full max-w-[584px] aspect-[584/452] rounded-2xl overflow-hidden shadow-md border border-[#1a1c19]/5 relative bg-stone-100">
                    <img
                      src={parsed.url || localImageUrl}
                      alt={commonName}
                      className="absolute inset-0 w-full h-full rounded-2xl transition-all duration-300"
                      style={parsed.style}
                    />
                  </div>
                  {renderImageBadge()}
                </div>
              </div>
              <div className="space-y-4">
                <AnimalHeader
                  commonName={commonName}
                  taxonomy={{
                    family: taxonomy?.family || null,
                    genus: taxonomy?.genus || null,
                    order: taxonomy?.order || null,
                  }}
                  description={description || null}
                  descriptionSource={descriptionSource || null}
                  scientificName={scientificName || null}
                  diet={diet || null}
                  tags={(tags || []).map((t) => ({ name: t, color: null }))}
                />
              </div>
            </div>
          </div>

          {/* User Card Layout Preview */}
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
                    src={parsed.url || localImageUrl}
                    alt={commonName}
                    className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={parsed.cardStyle}
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
                  onClick={() => handleUpdateDetailOptions({ fit: "cover" })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${detailFit === "cover" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                >
                  Cover (Fill)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateDetailOptions({ fit: "contain" })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${detailFit === "contain" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                >
                  Contain
                </button>
              </div>
            </div>

            <LayoutSlider
              label="Position X (Horizontal)"
              value={detailX}
              onChange={(val) => handleUpdateDetailOptions({ x: val })}
              disabled={detailFit === "contain"}
            />

            <LayoutSlider
              label="Position Y (Vertical)"
              value={detailY}
              onChange={(val) => handleUpdateDetailOptions({ y: val })}
              disabled={detailFit === "contain"}
            />
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
                checked={linkLayouts}
                onChange={(e) => handleToggleLink(e.target.checked)}
                className="w-4 h-4 rounded border-[#c2c9bb] text-[#2d5a27] focus:ring-[#2d5a27]/30 cursor-pointer"
              />
              <span className="text-xs text-[#1a1c19]/80 font-bold font-['Manrope']">
                Link Card to Detail Layout
              </span>
            </label>

            <div className={`flex flex-col gap-4 transition-all duration-300 ${linkLayouts ? "opacity-35 pointer-events-none select-none" : "opacity-100"}`}>
              <div>
                <label className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider block mb-1.5 font-['Plus_Jakarta_Sans']">Fit Strategy</label>
                <div className="flex bg-[#e3e3de] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleUpdateCardOptions({ cardFit: "cover" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${cardFitVal === "cover" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                    disabled={linkLayouts}
                  >
                    Cover (Fill)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateCardOptions({ cardFit: "contain" })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${cardFitVal === "contain" ? "bg-white text-[#2d5a27] shadow-sm" : "text-[#72796e]"}`}
                    disabled={linkLayouts}
                  >
                    Contain
                  </button>
                </div>
              </div>

              <LayoutSlider
                label="Position X (Horizontal)"
                value={cardXVal}
                onChange={(val) => handleUpdateCardOptions({ cardX: val })}
                disabled={linkLayouts || cardFitVal === "contain"}
              />

              <LayoutSlider
                label="Position Y (Vertical)"
                value={cardYVal}
                onChange={(val) => handleUpdateCardOptions({ cardY: val })}
                disabled={linkLayouts || cardFitVal === "contain"}
              />
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
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2d5a27] text-white font-bold text-sm shadow-md hover:bg-[#1f3f1b] hover:shadow-lg transition-all font-['Plus_Jakarta_Sans']"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}