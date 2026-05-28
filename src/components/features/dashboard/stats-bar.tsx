import { cn } from "@/lib/utils";

/**
 * StatsBar component displaying high-level archive statistics.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function StatsBar() {
  return (
    <section
      className={cn(
        "bg-surface-container-highest rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-8 text-primary mt-16"
      )}
    >
      <StatItem icon="pets" value="1,200" label="Species Documented" />
      <div className="h-12 w-px bg-outline-variant/30 hidden md:block" />
      <StatItem icon="public" value="8" label="Active Regions" />
      <div className="h-12 w-px bg-outline-variant/30 hidden md:block" />
      <StatItem icon="flag" value="120" label="Countries Linked" />
    </section>
  );
}

interface StatItemProps {
  icon: string;
  value: string;
  label: string;
}

/**
 * Sub-component for individual statistic items.
 * DRY principle: extracted repeating JSX.
 */
function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
      <div>
        <p className="text-3xl font-extrabold tracking-tighter leading-none font-headline">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          {label}
        </p>
      </div>
    </div>
  );
}
