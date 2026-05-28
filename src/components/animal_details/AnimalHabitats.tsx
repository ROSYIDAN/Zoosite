interface AnimalHabitatsProps {
  habitats: (string | null | undefined)[];
}

export default function AnimalHabitats({ habitats }: AnimalHabitatsProps) {
  return (
    <div className="break-inside-avoid">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 opacity-60">
        Habitats
      </h3>
      <div className="flex flex-wrap gap-2">
        {habitats && habitats.length > 0 ? (
          habitats.map((habitat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-high px-3 py-2 rounded-xl border border-outline-variant/10"
            >
              <span className="text-sm font-medium text-on-surface capitalize">{habitat}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant italic">Data not available</p>
        )}
      </div>
    </div>
  );
}
