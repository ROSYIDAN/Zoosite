"use client";

import Link from "next/link";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

/**
 * ExploreByRegion component displaying various geographical regions.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function ExploreByRegion() {
  const { isSidebarVisible } = useSidebar();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
          Explore by Region
        </h2>
        <Link
          href="/regions"
          className="text-sm font-bold text-primary hover:underline"
        >
          View Global Map
        </Link>
      </div>
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-2 px-2 justify-between">
        <RegionCard
          region="Africa"
          count={120}
          isSidebarVisible={isSidebarVisible}
        />
        <RegionCard
          region="Asia"
          count={95}
          isSidebarVisible={isSidebarVisible}
        />
        <RegionCard
          region="Europe"
          count={42}
          isSidebarVisible={isSidebarVisible}
        />
        <RegionCard
          region="Americas"
          count={88}
          isSidebarVisible={isSidebarVisible}
        />
      </div>
    </section>
  );
}

interface RegionCardProps {
  region: string;
  count: number;
  isSidebarVisible: boolean;
}

/**
 * Sub-component for individual region cards.
 * DRY principle: extracted repeating JSX.
 */
function RegionCard({ region, count, isSidebarVisible }: RegionCardProps) {
  return (
    <Link
      href={`/regions/${region}`}
      className={cn(
        "bg-surface-container rounded-2xl p-4 flex flex-col gap-8 hover:bg-surface-container-high transition-all cursor-pointer group",
        isSidebarVisible ? "min-w-[350px]" : "min-w-[420px]"
      )}
    >
      <span className="material-symbols-outlined text-4xl text-primary opacity-20 self-end group-hover:opacity-100 transition-opacity">
        location_on
      </span>
      <div>
        <p className="text-2xl font-bold text-primary leading-tight font-headline">
          {region}
        </p>
        <p className="text-xs text-on-surface-variant">
          {count} species documented
        </p>
      </div>
    </Link>
  );
}
