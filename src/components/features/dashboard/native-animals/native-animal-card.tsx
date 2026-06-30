import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import Link from "next/link";
import type { NativeAnimalItem } from "@/types/native-animals.types";

interface NativeAnimalCardProps {
  animal: NativeAnimalItem;
  priority?: boolean;
}

/**
 * NativeAnimalCard - displays individual endemic animal
 * Matches NewAnimalCard styling for consistency
 */
export default function NativeAnimalCard({ animal, priority }: NativeAnimalCardProps) {
  return (
    <Link href={`/animals/${animal.slug}`} className="block h-full">
      <div className="bg-surface-container-low h-82 rounded-2xl p-4 flex flex-col hover:shadow-xl transition-shadow cursor-pointer group border border-outline-variant/10">
        {/* Image */}
        <div className="flex-1 min-h-0 mb-3 relative">
          <ImageWithSkeleton
            alt={animal.name}
            src={animal.image}
            priority={priority}
            isCard={true}
            fallbackSrc="/static_image.png"
            className="w-full h-full object-cover rounded-xl"
            containerClassName="w-full h-full rounded-xl overflow-hidden"
          />
          {animal.status && (
            <span
              className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm z-10 ${
                animal.status === "ENDEMIC"
                  ? "bg-primary text-on-primary"
                  : "bg-secondary text-on-secondary"
              }`}
            >
              {animal.status === "ENDEMIC" ? "Endemic" : "Native"}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-none">
          <h3 className="font-bold text-lg text-on-surface font-headline truncate">
            {animal.name}
          </h3>
          {animal.scientific_name && (
            <p className="text-xs text-on-surface-variant italic truncate mt-0.5">
              {animal.scientific_name}
            </p>
          )}
          {animal.family && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className="material-symbols-outlined text-primary text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                category
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-tight uppercase truncate">
                {animal.family}
              </span>
            </div>
          )}
          {animal.locality && (
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="material-symbols-outlined text-primary text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-tight truncate" title={animal.locality}>
                {animal.locality}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}