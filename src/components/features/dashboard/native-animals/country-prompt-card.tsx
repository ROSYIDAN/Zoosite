"use client";

import { useState } from "react";

interface CountryPromptCardProps {
  onSelectCountry: () => void;
}

/**
 * CountryPromptCard - Empty state when user hasn't set their country
 * Prompts them to select a country to see endemic wildlife
 */
export default function CountryPromptCard({
  onSelectCountry,
}: CountryPromptCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-12 border border-outline-variant/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] min-h-[280px] flex flex-col items-center justify-center text-center space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary font-headline flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-3xl">public</span>
          Discover Your Local Wildlife
        </h2>
        <p className="text-sm text-on-surface-variant max-w-md">
          Set your country to see animals native to your region and explore
          endemic species found nowhere else on Earth
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onSelectCountry}
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">public</span>
        Select Country
      </button>
    </div>
  );
}