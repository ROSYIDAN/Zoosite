"use client";

interface CountryStatsProps {
  loading: boolean;
  totalCountries: number;
  countriesWithFlags: number;
  totalRegions: number;
}

export default function CountryStats({
  loading,
  totalCountries,
  countriesWithFlags,
  totalRegions,
}: CountryStatsProps) {
  return (
    <section className="grid gap-6 md:grid-cols-3 bg-primary-container/5 border border-primary-container/10 rounded-3xl p-8">
      <div className="flex flex-col gap-1">
        <span className="font-['Manrope'] text-[10px] uppercase tracking-widest text-primary-container/60 font-bold">Total Countries</span>
        <span className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-primary">
          {loading ? "..." : totalCountries}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-['Manrope'] text-[10px] uppercase tracking-widest text-primary-container/60 font-bold">Countries with Flags</span>
        <div className="flex items-baseline gap-2">
          <span className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-primary">
            {loading ? "..." : countriesWithFlags}
          </span>
          <span className="text-xs text-[#1a1c19]/40 font-['Manrope'] font-medium">
            ({totalCountries ? Math.round((countriesWithFlags / totalCountries) * 100) : 0}% covered)
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-['Manrope'] text-[10px] uppercase tracking-widest text-primary-container/60 font-bold">Active Regions</span>
        <span className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-primary">
          {loading ? "..." : totalRegions}
        </span>
      </div>
    </section>
  );
}
