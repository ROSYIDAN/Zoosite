"use client";

import { Country } from "./types";

interface CountryTableProps {
  loading: boolean;
  paginatedCountries: Country[];
  onEdit: (country: Country) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  ITEMS_PER_PAGE: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function CountryTable({
  loading,
  paginatedCountries,
  onEdit,
  currentPage,
  totalPages,
  totalItems,
  ITEMS_PER_PAGE,
  setCurrentPage,
}: CountryTableProps) {
  return (
    <section className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full" />
          <p className="text-sm text-[#1a1c19]/50 font-['Manrope'] font-medium">Fetching Conservatory geography database...</p>
        </div>
      ) : paginatedCountries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <span className="material-symbols-outlined text-[48px] text-primary-container/30 mb-4">public_off</span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#1a1c19] mb-1">No Countries Found</h3>
          <p className="font-['Manrope'] text-sm text-[#1a1c19]/50 max-w-sm">
            We couldn't find any countries matching your filter criteria. Try updating your search keyword or add a new country!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf5] border-b border-outline-variant/50">
                <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/50 w-24">Flag</th>
                <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/50">Country Name</th>
                <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/50">Region / Continent</th>
                <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/50 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {paginatedCountries.map((c) => (
                <tr key={c.id} className="hover:bg-[#fafaf5]/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-8 rounded-lg overflow-hidden bg-[#fafaf5] border border-outline-variant/40 flex items-center justify-center shadow-sm">
                      {c.country_flag?.startsWith("http") ? (
                        <img
                          src={c.country_flag}
                          alt={`${c.country} flag`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl leading-none">{c.country_flag || "📍"}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#1a1c19]">
                      {c.country}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.regions?.region ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/5 border border-primary-container/20 text-primary-container text-xs font-bold font-['Manrope']">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                        {c.regions.region}
                      </span>
                    ) : (
                      <span className="text-xs text-[#1a1c19]/30 font-['Manrope'] font-medium">Unspecified Region</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onEdit(c)}
                      className="inline-flex items-center justify-center p-2 rounded-xl border border-outline-variant/60 text-[#1a1c19]/60 hover:text-primary-container hover:border-primary-container/50 hover:bg-primary-container/5 transition-all group-hover:scale-105 duration-200"
                      title={`Edit ${c.country}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-[#fafaf5] border-t border-outline-variant/50 px-6 py-4 flex items-center justify-between gap-4 font-['Manrope']">
              <span className="text-xs text-[#1a1c19]/50 font-medium">
                Showing <span className="font-bold text-[#1a1c19]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                <span className="font-bold text-[#1a1c19]">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of{" "}
                <span className="font-bold text-[#1a1c19]">{totalItems}</span> countries
              </span>
              
              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-outline-variant/60 text-[#1a1c19]/60 hover:text-primary-container hover:border-primary-container/50 hover:bg-primary-container/5 transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-outline-variant/60 disabled:hover:text-[#1a1c19]/60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] block">chevron_left</span>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? "bg-primary-container text-white shadow-sm"
                            : "border border-outline-variant/60 text-[#1a1c19]/60 hover:text-primary-container hover:border-primary-container/50 hover:bg-primary-container/5"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={page} className="px-1 text-[#1a1c19]/30 text-xs font-bold select-none">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-outline-variant/60 text-[#1a1c19]/60 hover:text-primary-container hover:border-primary-container/50 hover:bg-primary-container/5 transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-outline-variant/60 disabled:hover:text-[#1a1c19]/60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px] block">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
