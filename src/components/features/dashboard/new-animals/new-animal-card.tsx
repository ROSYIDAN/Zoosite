import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import Link from "next/link";
import type { RecentAnimalItem } from "@/types/dashboard.types";

interface NewAnimalCardProps {
  animal: RecentAnimalItem;
}

export default function NewAnimalCard({ animal }: NewAnimalCardProps) {
  return (
    <Link href={`/animals/${animal.slug}`} className="block h-full">
      <div className="bg-surface-container-low h-82 rounded-2xl p-4 flex flex-col hover:shadow-xl transition-shadow cursor-pointer group">
        {/* Image */}
        <div className="flex-1 min-h-0 mb-3">
          <ImageWithSkeleton
            alt={animal.name}
            src={animal.image}
            isCard={true}
            fallbackSrc="/static_image.png"
            className="w-full h-full object-cover rounded-xl"
            containerClassName="w-full h-full rounded-xl overflow-hidden"
          />
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
        </div>
      </div>
    </Link>
  );
}
