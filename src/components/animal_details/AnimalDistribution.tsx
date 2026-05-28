import type { AnimalDistribution as AnimalDistributionType } from "@/types/animal";

interface AnimalDistributionProps {
  distribution: AnimalDistributionType[];
}

export default function AnimalDistribution({ distribution }: AnimalDistributionProps) {
  return (
    <div className="pt-6 border-t border-outline-variant/20 break-inside-avoid">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 opacity-60">
        Native Distribution
      </h3>
      <div className="flex flex-wrap gap-2">
        {distribution && distribution.length > 0 ? (
          distribution.map((dist, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-surface-container-high px-3 py-2 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors"
            >
              {dist.flag && (
                <img
                  src={dist.flag}
                  alt=""
                  className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                />
              )}
              <span className="text-sm font-medium text-on-surface">{dist.country || "Unknown"}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant italic">Data not available</p>
        )}
      </div>
    </div>
  );
}
