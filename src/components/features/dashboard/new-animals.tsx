import { dashboardService } from "@/services/dashboard.service";
import { unstable_cache } from "next/cache";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { RecentAnimalItem } from "@/types/dashboard.types";

const MAX_RECENT_ANIMALS = 6;

const getCachedRecentAnimals = unstable_cache(
  async () => dashboardService.getRecentAnimals(MAX_RECENT_ANIMALS),
  ["new-animals-cache"],
  { revalidate: 120 }, // 2 minutes — keeps "new this week" fresh
);

/**
 * Formats a date (Date or ISO string) into a short month-day string (e.g. "Jun 16").
 * Accepts strings because unstable_cache serializes Date objects to ISO strings.
 */
function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * NewAnimals Server Component.
 * Displays the newest animals added to the system this calendar week.
 * Grid expands/contracts based on actual count (1–6).
 * Following FE System Law: async Server Component fetches data,
 * maps to clean types, renders with shared primitives.
 */
export default async function NewAnimals() {
  let items: RecentAnimalItem[] = [];
  let weekStart = getStartOfWeek(new Date());
  let weekEnd = getEndOfWeek(new Date());

  try {
    const result = await getCachedRecentAnimals();
    items = result.items;
    weekStart = result.weekStart;
    weekEnd = result.weekEnd;
  } catch (error) {
    console.error("Failed to fetch recent animals:", error);
  }

  const weekLabel = `${formatDateShort(weekStart)} – ${formatDateShort(weekEnd)}`;

  const displayCount = Math.max(3, Math.ceil(items.length / 3) * 3);
  const placeholdersCount = items.length > 0 ? displayCount - items.length : 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          new_releases
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
            New This Week
          </h2>
          <p className="text-sm text-on-surface-variant">{weekLabel}</p>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/50">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-3">
            pets
          </span>
          <p className="text-on-surface-variant text-sm font-medium">
            No new animals this week — check back soon!
          </p>
        </div>
      )}

      {/* Grid — uniform sizing, filled to multiple of 3 */}
      {items.length > 0 && (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
          {items.map((animal) => (
            <NewAnimalCard key={animal.id} animal={animal} />
          ))}
          {Array.from({ length: placeholdersCount }).map((_, idx) => (
            <AddAnimalPlaceholderCard key={`placeholder-${idx}`} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Helpers ──

/** Calendar week Monday 00:00 (pure, no external deps). */
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Calendar week Sunday 23:59:59. */
function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

// ── Sub-components ──

interface NewAnimalCardProps {
  animal: RecentAnimalItem;
}

/**
 * Card for a single recently-added animal.
 * DRY principle: extracted repeating JSX into a private sub-component
 * with an explicit interface (FE Law §13).
 */
function NewAnimalCard({ animal }: NewAnimalCardProps) {
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

/**
 * Placeholder card to prompt users/admins to contribute a new species.
 * Keeps grid perfectly balanced to a multiple of 3.
 */
function AddAnimalPlaceholderCard() {
  return (
    <Link href="/request-animal" className="block h-full">
      <div className="border-2 border-dashed border-outline-variant/30 hover:border-primary/40 rounded-2xl p-4 flex flex-col items-center justify-center h-82 text-center group transition-colors cursor-pointer bg-surface-container-low/20 hover:bg-surface-container-low/50">
        <span
          className="material-symbols-outlined text-4xl text-on-surface-variant/40 group-hover:text-primary group-hover:scale-110 transition-all mb-2"
          style={{ fontVariationSettings: "'wght' 300" }}
        >
          add_circle
        </span>
        <h3 className="font-bold text-sm text-on-surface-variant group-hover:text-primary transition-colors font-headline">
          Submit New Animal
        </h3>
        <p className="text-[10px] text-on-surface-variant/60 mt-1 max-w-[180px] leading-normal font-medium">
          Help grow our wildlife catalog by contributing a missing species!
        </p>
      </div>
    </Link>
  );
}
