"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Country } from "@/hooks/use-country-selection";

export interface Region {
  id: string;
  region: string;
}

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCountryName: string;
  onRegisterSuccess: (newCountry: Country) => void;
}

export default function CountryModal({ isOpen, onClose, initialCountryName, onRegisterSuccess }: CountryModalProps) {
  const [modalCountryName, setModalCountryName] = useState(initialCountryName);
  const [modalCountryFlag, setModalCountryFlag] = useState("");
  const [modalRegionId, setModalRegionId] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [isSubmittingCountry, setIsSubmittingCountry] = useState(false);

  // Sync modal input name with parent query if it changes
  useEffect(() => {
    setModalCountryName(initialCountryName);
  }, [initialCountryName]);

  // Fetch Regions on Mount for Modal Selection
  useEffect(() => {
    if (isOpen) {
      fetch("/api/regions")
        .then((res) => res.json())
        .then((data) => setRegions(data.data || []))
        .catch((err) => console.error("Failed to load regions:", err));
    }
  }, [isOpen]);

  const handleRegisterCountry = async (e: FormEvent) => {
    e.preventDefault();
    if (!modalCountryName.trim()) {
      toast.error("Country name is required");
      return;
    }

    setIsSubmittingCountry(true);
    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: modalCountryName.trim(),
          country_flag: modalCountryFlag.trim() || null,
          region_id: modalRegionId || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to register country");
      }

      const { data: newCountry } = await res.json();
      toast.success(`Registered and added "${newCountry.country}"!`);
      
      onRegisterSuccess(newCountry);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmittingCountry(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1a1c19]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white border border-outline-variant rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#fafaf5] px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">public</span>
            Register New Country
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#1a1c19]/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleRegisterCountry} className="p-6 flex flex-col gap-4 text-left">
          {/* Country Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider text-[#1a1c19]/60">
              Country Name
            </label>
            <input
              type="text"
              value={modalCountryName}
              onChange={(e) => setModalCountryName(e.target.value)}
              placeholder="e.g. Thailand, Kenya"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope']"
              required
            />
          </div>

          {/* Region Select */}
          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider text-[#1a1c19]/60">
              Region / Continent
            </label>
            <div className="relative">
              <select
                value={modalRegionId}
                onChange={(e) => setModalRegionId(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-white appearance-none cursor-pointer"
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
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider text-[#1a1c19]/60">
                Flag Emoji or Image URL
              </label>
              {/* Visual Preview */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-['Manrope'] text-[#1a1c19]/40">Preview:</span>
                <div className="w-6 h-4 rounded overflow-hidden bg-[#fafaf5] border border-outline-variant/40 flex items-center justify-center shadow-xs">
                  {modalCountryFlag.startsWith("http") ? (
                    <img
                      src={modalCountryFlag}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-[10px] leading-none">{modalCountryFlag || "📍"}</span>
                  )}
                </div>
              </div>
            </div>
            <input
              type="text"
              value={modalCountryFlag}
              onChange={(e) => setModalCountryFlag(e.target.value)}
              placeholder="Unicode emoji (e.g. 🇹🇭) or URL"
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope']"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-outline-variant/30 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant text-[#1a1c19]/60 text-xs font-bold font-['Manrope'] hover:bg-[#fafaf5] hover:text-[#1a1c19] transition-all"
              disabled={isSubmittingCountry}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-[#20401b] text-white text-xs font-bold font-['Manrope'] shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              disabled={isSubmittingCountry}
            >
              {isSubmittingCountry ? (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Save & Select
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
