"use client";

import Link from "next/link";
import type { Country } from "@/types/native-animals.types";
import CountryFlag from "@/components/ui/country-flag";

interface NoAnimalsCardProps {
  country: Country;
}

/**
 * NoAnimalsCard - Empty state when country is set but no endemic animals cataloged
 * Shows friendly message and CTA to explore all animals
 */
export default function NoAnimalsCard({ country }: NoAnimalsCardProps) {


  return (
    <div className="bg-surface-container-low rounded-2xl p-12 border border-outline-variant/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] min-h-[280px] flex flex-col items-center justify-center text-center space-y-6">
      {/* Header with country */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary font-headline flex items-center justify-center gap-2">
          <CountryFlag flag={country.flag} alt={country.name} className="text-3xl w-8 h-5" />
          Native Wildlife of {country.name}
        </h2>
        <p className="text-sm text-on-surface-variant max-w-md">
          We're still cataloging endemic species for {country.name}. Check
          back soon!
        </p>
      </div>

      {/* Info */}
      <p className="text-sm text-on-surface font-medium">Meanwhile, you can:</p>

      {/* CTA Button */}
      <Link
        href="/animals"
        className="inline-flex items-center gap-2 border-2 border-primary text-primary bg-transparent px-6 py-3 rounded-xl font-medium hover:bg-primary/5 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">search</span>
        Explore All Animals
      </Link>
    </div>
  );
}