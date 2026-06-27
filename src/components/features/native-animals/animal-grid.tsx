import NativeAnimalCard from "@/components/features/dashboard/native-animals/native-animal-card";
import type { NativeAnimalItem } from "@/types/native-animals.types";

interface AnimalGridProps {
  animals: NativeAnimalItem[];
  isLoading?: boolean;
}

/**
 * AnimalGrid - Responsive grid of animal cards
 * Reuses NativeAnimalCard from dashboard
 */
export default function AnimalGrid({ animals, isLoading }: AnimalGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-low h-82 rounded-2xl animate-pulse border border-outline-variant/10"
          />
        ))}
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-12 border border-outline-variant/10 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
          search_off
        </span>
        <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
          No Animals Found
        </h3>
        <p className="text-sm text-on-surface-variant">
          Try adjusting your search or filters to find what you're looking
          for
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          Showing <strong className="text-on-surface">{animals.length}</strong>{" "}
          endemic {animals.length === 1 ? "species" : "species"}
        </p>
      </div>

      {/* Animal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {animals.map((animal) => (
          <NativeAnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
}