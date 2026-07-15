import AnimalHeader from "@/components/animal_details/AnimalHeader";
import type { CSSProperties } from "react";

interface ImageBadgeProps {
  imageSource?: string;
  photographerName?: string;
}

function ImageBadge({ imageSource, photographerName }: ImageBadgeProps) {
  const isUrl = (str?: string | null): boolean => {
    if (!str) return false;
    return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("www.");
  };

  const getHref = (str?: string | null): string => {
    if (!str) return "";
    if (str.startsWith("www.")) return `https://${str}`;
    return str;
  };

  const hasLink = isUrl(imageSource);
  const href = getHref(imageSource);

  let displayLabel = "";
  if (photographerName) {
    displayLabel = `Photo by ${photographerName}`;
    if (imageSource && !hasLink) displayLabel += ` (${imageSource})`;
  } else if (imageSource) {
    displayLabel = hasLink ? "Photo Source" : imageSource;
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
}

interface DetailPagePreviewProps {
  imageUrl: string;
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
  imageSource?: string;
  photographerName?: string;
  imageStyle: CSSProperties;
}

export default function DetailPagePreview({
  imageUrl,
  commonName,
  scientificName,
  description,
  descriptionSource,
  diet,
  tags,
  taxonomy,
  imageSource,
  photographerName,
  imageStyle,
}: DetailPagePreviewProps) {
  return (
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
                src={imageUrl}
                alt={commonName}
                className="absolute inset-0 w-full h-full rounded-2xl transition-all duration-300"
                style={imageStyle}
              />
            </div>
            <ImageBadge imageSource={imageSource} photographerName={photographerName} />
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
  );
}