import { dashboardService } from "@/services/dashboard.service";
import { unstable_cache } from "next/cache";
import type { RecentAnimalItem } from "@/types/dashboard.types";
import NewAnimalCard from "./new-animal-card";
import AddAnimalPlaceholderCard from "./add-animal-placeholder-card";
import { getStartOfWeek, getEndOfWeek } from "@/lib/date-utils";
import { auth } from "@/auth";
import { userService } from "@/services/user.service";

const MAX_RECENT_ANIMALS = 6;

const getCachedRecentAnimals = (countryId: string | null) =>
  unstable_cache(
    async () => dashboardService.getRecentAnimals(MAX_RECENT_ANIMALS, countryId),
    ["new-animals-cache", countryId || "none"],
    { revalidate: 120 } // 2 minutes — keeps "new this week" fresh
  )();

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

  const session = await auth();
  let countryId: string | null = null;
  if (session?.user?.id) {
    try {
      const profile = await userService.getProfileData(session.user.id);
      countryId = profile.user.country_id || null;
    } catch (e) {
      console.error("Failed to fetch user profile for recent animals prioritization:", e);
    }
  }

  try {
    const result = await getCachedRecentAnimals(countryId);
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
