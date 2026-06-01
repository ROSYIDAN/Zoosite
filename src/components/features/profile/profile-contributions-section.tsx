import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ContributionItem {
  id: string;
  animal_name: string | null;
  canonical_slug: string | null;
  image_url: string | null;
}

interface ProfileContributionsSectionProps {
  stats: {
    approvedCount: number;
    pendingCount: number;
    inReviewCount: number;
    rejectionCount: number;
  };
  approvedContributions: ContributionItem[];
}

export const ProfileContributionsSection: React.FC<ProfileContributionsSectionProps> = ({
  stats,
  approvedContributions = [],
}) => {
  const totalSubmissions = stats.approvedCount + stats.rejectionCount;
  const acceptanceRate =
    totalSubmissions === 0
      ? "100%"
      : `${Math.round((stats.approvedCount / totalSubmissions) * 100)}%`;

  const activeDrafts = stats.pendingCount + stats.inReviewCount;

  return (
    <div className="w-full rounded-3xl border border-[#c2c9bb]/60 bg-[#ffffff]/60 backdrop-blur-md shadow-md p-6 sm:p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-headline font-semibold text-[#1a1c19] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2d5a27]">nature_people</span>
          Contributions
        </h2>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#fafaf5]/70 border border-[#c2c9bb]/40 text-center">
            <span className="material-symbols-outlined text-[#2d5a27] text-2xl mb-1">
              verified
            </span>
            <p className="text-2xl font-headline font-bold text-[#1a1c19]">
              {stats.approvedCount}
            </p>
            <p className="text-[10px] sm:text-xs text-[#42493e] font-body font-semibold uppercase tracking-wider mt-1">
              Catalogued
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafaf5]/70 border border-[#c2c9bb]/40 text-center">
            <span className="material-symbols-outlined text-[#805533] text-2xl mb-1">
              pending_actions
            </span>
            <p className="text-2xl font-headline font-bold text-[#1a1c19]">
              {activeDrafts}
            </p>
            <p className="text-[10px] sm:text-xs text-[#42493e] font-body font-semibold uppercase tracking-wider mt-1">
              In Review
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafaf5]/70 border border-[#c2c9bb]/40 text-center">
            <span className="material-symbols-outlined text-[#2d5a27] text-2xl mb-1">
              monitoring
            </span>
            <p className="text-2xl font-headline font-bold text-[#154212]">
              {acceptanceRate}
            </p>
            <p className="text-[10px] sm:text-xs text-[#42493e] font-body font-semibold uppercase tracking-wider mt-1">
              Accept Rate
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#c2c9bb]/40 pt-6">
        <h3 className="text-sm font-headline font-semibold text-[#1a1c19] uppercase tracking-wider mb-4">
          Approved Species Catalogued
        </h3>

        {approvedContributions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[#c2c9bb] bg-[#fafaf5]/40 mt-2">
            <span className="material-symbols-outlined text-[#42493e]/50 text-4xl mb-2">
              eco
            </span>
            <p className="text-sm font-semibold text-[#42493e] font-body">
              No approved contributions yet
            </p>
            <p className="text-xs text-[#42493e]/80 font-body max-w-sm mt-1">
              Help us expand the ZooSite encyclopedia by submitting new wildlife requests on the Request page!
            </p>
            <Link
              href="/request"
              className="mt-4 px-4 py-2 bg-[#154212] hover:bg-[#2d5a27] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Submit First Request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 max-h-[300px] overflow-y-auto pr-1">
            {approvedContributions.map((animal) => (
              <Link
                key={animal.id}
                href={animal.canonical_slug ? `/animals/${animal.canonical_slug}` : "#"}
                className="flex items-center gap-4 p-3 rounded-2xl border border-[#c2c9bb]/50 bg-white hover:bg-[#eeeee9]/40 hover:border-[#154212]/50 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#eeeee9] shrink-0">
                  {animal.image_url ? (
                    <Image
                      src={animal.image_url}
                      alt={animal.animal_name || "Animal image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#42493e]/50 bg-[#eeeee9]">
                      <span className="material-symbols-outlined text-[20px]">image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-[#1a1c19] text-sm truncate group-hover:text-[#154212] transition-colors">
                    {animal.animal_name || "Unknown Species"}
                  </h4>
                  <span className="text-[10px] font-body text-[#42493e] bg-[#fafaf5] px-2 py-0.5 rounded border border-[#c2c9bb]/40 font-semibold inline-block mt-0.5">
                    Your contribution
                  </span>
                </div>

                <span className="material-symbols-outlined text-[#42493e]/60 group-hover:text-[#154212] group-hover:translate-x-0.5 transition-all text-[20px] shrink-0">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
