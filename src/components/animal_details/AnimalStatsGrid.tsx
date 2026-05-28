import type { AnimalStats } from "@/types/animal";

interface AnimalStatsGridProps {
  stats: AnimalStats | null;
  section?: "primary" | "details";
}

function formatStatValue(value: string | null | undefined, unit?: string) {
  if (!value) return "N/A";
  return unit ? `${value} ${unit}` : value;
}

export default function AnimalStatsGrid({ stats, section = "primary" }: AnimalStatsGridProps) {
  const primaryItems = [
    { label: "Diet", value: formatStatValue(stats?.diet) },
    { label: "Lifespan", value: formatStatValue(stats?.lifespan_years, "years") },
    { label: "Weight", value: formatStatValue(stats?.weight_kg, "kg") },
    { label: "Conservation", value: formatStatValue(stats?.conservation_status) },
  ];

  const detailItems = [
    { label: "Height", value: formatStatValue(stats?.height_cm, "cm") },
    { label: "Average Speed", value: formatStatValue(stats?.avg_speed_kmh, "km/h") },
    { label: "Top Speed", value: formatStatValue(stats?.top_speed_kmh, "km/h") },
    { label: "Social Structure", value: formatStatValue(stats?.social_structure) },
  ];
  const items = section === "details" ? detailItems : primaryItems;

  return (
    <div className="grid grid-cols-2 gap-4 break-inside-avoid">
      {items.map((item) => (
        <div key={item.label} className="bg-surface-container rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
            {item.label}
          </p>
          <p className="font-bold text-on-surface">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
