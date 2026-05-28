"use client";

import { Country, Region } from "./types";

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCountry: Country | null;
  formCountryName: string;
  setFormCountryName: (name: string) => void;
  formCountryFlag: string;
  setFormCountryFlag: (flag: string) => void;
  formRegionId: string;
  setFormRegionId: (id: string) => void;
  regions: Region[];
  isSubmitting: boolean;
}

export default function CountryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCountry,
  formCountryName,
  setFormCountryName,
  formCountryFlag,
  setFormCountryFlag,
  formRegionId,
  setFormRegionId,
  regions,
  isSubmitting,
}: CountryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1a1c19]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
      <div className="bg-white border border-outline-variant rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col transform animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-[#fafaf5] px-8 py-5 border-b border-outline-variant/50 flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">public</span>
            {editingCountry ? "Edit Country & Flag" : "Register New Country"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#1a1c19]/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="p-8 flex flex-col gap-6">
          {/* Country Name */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/60">
              Country Name
            </label>
            <input
              type="text"
              value={formCountryName}
              onChange={(e) => setFormCountryName(e.target.value)}
              placeholder="e.g. Thailand, Colombia, Kenya"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope']"
              required
            />
          </div>

          {/* Region Select */}
          <div className="flex flex-col gap-2">
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/60">
              Region / Continent
            </label>
            <div className="relative">
              <select
                value={formRegionId}
                onChange={(e) => setFormRegionId(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-white appearance-none cursor-pointer"
              >
                <option value="">Select a region...</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.region}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 pointer-events-none text-[20px]">
                unfold_more
              </span>
            </div>
          </div>

          {/* Flag Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#1a1c19]/60">
                Flag Emoji or Image URL
              </label>
              {/* Visual Preview */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-['Manrope'] text-[#1a1c19]/40">Preview:</span>
                <div className="w-8 h-5 rounded overflow-hidden bg-[#fafaf5] border border-outline-variant/40 flex items-center justify-center shadow-sm">
                  {formCountryFlag.startsWith("http") ? (
                    <img
                      src={formCountryFlag}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs leading-none">{formCountryFlag || "📍"}</span>
                  )}
                </div>
              </div>
            </div>
            <input
              type="text"
              value={formCountryFlag}
              onChange={(e) => setFormCountryFlag(e.target.value)}
              placeholder="Paste Unicode emoji (e.g. 🇧🇷) or high-res flag URL"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope']"
            />
            <span className="text-[11px] text-[#1a1c19]/50 font-['Manrope'] leading-relaxed bg-[#fafaf5] p-3 rounded-lg border border-outline-variant/30 mt-1">
              💡 **TIP**: You can use copy-paste flag emojis directly (Windows: `Win + .` / Mac: `Ctrl + Cmd + Space` to open emoji panel) or enter a web URL of a flag PNG/SVG.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-outline-variant/30 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-outline-variant text-[#1a1c19]/60 text-sm font-bold font-['Manrope'] hover:bg-[#fafaf5] hover:text-[#1a1c19] transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary-container hover:bg-[#20401b] text-white text-sm font-bold font-['Manrope'] shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  {editingCountry ? "Save Changes" : "Register Country"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
