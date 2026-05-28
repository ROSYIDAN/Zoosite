"use client";

import { useState, useEffect } from "react";
import { parseMediaUrl, encodeMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";
import { LayoutControlBlock } from "@/components/features/admin/shared/layout-control-block";
import AnimalHeader from "@/components/animal_details/AnimalHeader";

interface AnimalPreviewModalProps {
  imageUrl: string;
  imageSource?: string;
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

  const handleUpdateLayout = (newOptions: MediaLayoutOptions) => {
    const parsed = parseMediaUrl(localImageUrl);
    if (parsed.url) {
      setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleApply = () => {
    onApply(localImageUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/80 backdrop-blur-sm">
      {/* LEFT: Live Detail Page Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              {(() => {
                const parsed = parseMediaUrl(localImageUrl);
                return (
                  <div className="relative group">
                    <div className="w-full max-w-[584px] aspect-[584/452] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={parsed.url || localImageUrl}
                        alt={commonName}
                        className="w-full h-full rounded-3xl"
                        style={parsed.style}
                      />
                    </div>
                    {imageSource && (
                      <div className="absolute bottom-4 mx-2 w-fit bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-opacity duration-300 opacity-60 group-hover:opacity-100">
                        <p className="text-[10px] text-white/90 font-['Manrope'] font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[12px]">copyright</span>
                          {imageSource}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="space-y-6">
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
      </div>

      {/* RIGHT: Layout Editor Controls */}
      <div className="w-[400px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 shrink-0">
        <div className="p-6 border-b border-[#e3e3de]">
          <h2 className="text-xl font-bold text-[#1a1c19] font-serif">Image Layout Editor</h2>
          <p className="text-sm text-[#72796e] mt-1 font-sans">Adjust how the profile image fits within its container.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <LayoutControlBlock
            title="Profile Image"
            url={localImageUrl}
            onChange={handleUpdateLayout}
          />
        </div>

        <div className="p-6 border-t border-[#e3e3de] flex gap-3 bg-[#fafaf5]">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#c2c9bb] text-[#42493e] font-bold text-sm hover:bg-[#e3e3de] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2d5a27] text-white font-bold text-sm shadow-md hover:bg-[#154212] transition-colors"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}
