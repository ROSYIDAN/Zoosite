import type { AnimalTaxonomy } from "@/types/animal";

interface AnimalTaxonomyGridProps {
  taxonomy: AnimalTaxonomy;
}

export default function AnimalTaxonomyGrid({ taxonomy }: AnimalTaxonomyGridProps) {
  const items = [
    { label: "Family", value: taxonomy.family },
    { label: "Genus", value: taxonomy.genus },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 break-inside-avoid">
      {items.map((item) => (
        <div key={item.label} className="bg-surface-container rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
            {item.label}
          </p>
          <p className="font-bold text-on-surface">{item.value || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
