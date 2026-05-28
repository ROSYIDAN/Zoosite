"use client";

import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface TrendingAnimal {
  slug: string;
  name: string;
  category: string;
  image: string;
}

interface AnimalCardProps {
  animal: TrendingAnimal;
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link href={`/animals/${animal.slug}`} className="block h-full">
      <div className="bg-surface-container-low h-82 rounded-2xl p-4 flex flex-col hover:shadow-xl transition-shadow cursor-pointer group">
        <div className="flex-1 min-h-0 mb-3">
          <ImageWithSkeleton
            alt={animal.name}
            src={animal.image}
            fallbackSrc="/static_image.png"
            className="w-full h-full object-cover rounded-xl"
            containerClassName="w-full h-full rounded-xl overflow-hidden"
          />
        </div>
        <div className="flex-none">
          <h3 className="font-bold text-lg text-on-surface font-headline truncate">
            {animal.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="material-symbols-outlined text-primary text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              restaurant
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium tracking-tight uppercase truncate">
              {animal.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
