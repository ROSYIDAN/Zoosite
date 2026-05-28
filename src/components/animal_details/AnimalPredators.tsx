interface AnimalPredatorsProps {
  predators: string[];
}

export default function AnimalPredators({ predators }: AnimalPredatorsProps) {
  if (!predators || predators.length === 0) return null;

  return (
    <div className="pt-6 border-t border-outline-variant/20 break-inside-avoid">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 opacity-60">
        Predators
      </h3>
      <div className="flex flex-wrap gap-2">
        {predators.map((predator, idx) => (
          <div
            key={idx}
            className="bg-surface-container-high px-3 py-2 rounded-xl border border-outline-variant/10"
          >
            <span className="text-sm font-medium text-on-surface">{predator}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
