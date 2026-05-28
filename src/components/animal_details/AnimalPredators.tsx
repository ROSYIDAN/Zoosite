import BreadcrumbLink from "@/components/breadcrumbs/BreadcrumbLink";

export interface PredatorInfo {
  name: string;
  slug: string | null;
}

interface AnimalPredatorsProps {
  predators: PredatorInfo[];
  currentAnimalName: string;
}

export default function AnimalPredators({ predators, currentAnimalName }: AnimalPredatorsProps) {
  if (!predators || predators.length === 0) return null;

  return (
    <div className="pt-6 border-t border-outline-variant/20 break-inside-avoid">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 opacity-60">
        Predators
      </h3>
      <div className="flex flex-wrap gap-2">
        {predators.map((predator, idx) => {
          if (predator.slug) {
            return (
              <BreadcrumbLink
                key={idx}
                href={`/animals/${predator.slug}`}
                breadcrumbLabel={currentAnimalName}
                className="group flex items-center gap-1.5 bg-surface-container-high hover:bg-primary/10 px-3 py-2 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all duration-200 cursor-pointer active:scale-95 select-none"
              >
                <span className="text-sm font-semibold text-primary group-hover:underline">
                  {predator.name}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary/70 group-hover:text-primary transition-colors">
                  link
                </span>
              </BreadcrumbLink>
            );
          }

          return (
            <div
              key={idx}
              className="bg-surface-container-high px-3 py-2 rounded-xl border border-outline-variant/10 select-none"
            >
              <span className="text-sm font-medium text-on-surface">{predator.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

