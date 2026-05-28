import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { parseMediaUrl } from "@/lib/media-utils";

interface AnimalImageProps {
  imageUrl: string | undefined;
  altText: string;
  source?: string | null;
}

export default function AnimalImage({ imageUrl, altText, source }: AnimalImageProps) {
  if (!imageUrl) return null;

  const parsed = parseMediaUrl(imageUrl);
  const { fit, x, y } = parsed.options;

  return (
    <div className="relative group">
      <ImageWithSkeleton
        src={parsed.url || ""}
        fallbackSrc="/static_image.png"
        alt={altText}
        priority={true}
        className="w-full h-full rounded-3xl"
        containerClassName="w-full max-w-[584px] aspect-[584/452] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          objectFit: fit,
          objectPosition: `${x}% ${y}%`,
        }}
      />
      {source && (
        <div className="absolute bottom-4 mx-2 w-fit bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-opacity duration-300 opacity-60 group-hover:opacity-100">
          <p className="text-[10px] text-white/90 font-['Manrope'] font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[12px]">copyright</span>
            {source}
          </p>
        </div>
      )}
    </div>
  );
}
