"use client";

import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import KnowledgeHelper from "./knowledge-helper";
import { toast } from "react-hot-toast";

interface Country {
  id: string;
  country: string;
  country_flag: string | null;
}

interface Habitat {
  id: string;
  habitat_name: string;
}

interface Region {
  id: string;
  region: string;
}

interface AnimalDistributionCardProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  initialCountries?: Country[];
  commonName?: string;
}

const parsePastedList = (text: string): string[] => {
  if (!text) return [];
  
  // Split by commas, semicolons, and newlines
  const rawTokens = text.split(/[,;\n\r]+/);
  const stopWords = new Set(["and", "or", "the", "in", "of", "from", "to", "with", "a", "an", "&"]);
  
  const parsed: string[] = [];
  
  for (const token of rawTokens) {
    let cleaned = token.trim();
    
    // Remove leading/trailing common punctuation (like periods, quotes, brackets etc.)
    // but keep letters, numbers, spaces, and round brackets in the middle
    cleaned = cleaned.replace(/^[.,;:*"'`“‘’”[\](){}<>!\s]+|[.,;:*"'`“‘’”[\](){}<>!\s]+$/g, "");
    
    // Strip leading noise words and operators like "and ", "or ", "as well as ", "& "
    cleaned = cleaned.replace(/^(and|or|&|as well as)\s+/i, "");
    
    cleaned = cleaned.trim();
    
    if (!cleaned) continue;
    
    // If the token is a single stop word itself, skip it
    if (stopWords.has(cleaned.toLowerCase())) {
      continue;
    }
    
    parsed.push(cleaned);
  }
  
  return parsed;
};

export default function AnimalDistributionCard({ setValue, watch, initialCountries, commonName }: AnimalDistributionCardProps) {
  // ── Countries State ──
  const [countryQuery, setCountryQuery] = useState("");
  const [countryResults, setCountryResults] = useState<Country[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const selectedCountryIds = watch("countries") || [];
  
  // We need to keep track of the full country objects to show names for the selected IDs
  const [selectedCountries, setSelectedCountries] = useState<Country[]>(initialCountries || []);
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  // ── Inline Country Registration Modal State ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCountryName, setModalCountryName] = useState("");
  const [modalCountryFlag, setModalCountryFlag] = useState("");
  const [modalRegionId, setModalRegionId] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [isSubmittingCountry, setIsSubmittingCountry] = useState(false);

  // ── Habitats State ──
  const [habitatQuery, setHabitatQuery] = useState("");
  const [habitatResults, setHabitatResults] = useState<Habitat[]>([]);
  const [showHabitatDropdown, setShowHabitatDropdown] = useState(false);
  const selectedHabitats = watch("habitats") || [];

  const countryRef = useRef<HTMLDivElement>(null);
  const habitatRef = useRef<HTMLDivElement>(null);

  // ── Fetch Regions on Mount for Modal Selection ──
  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data.data || []))
      .catch((err) => console.error("Failed to load regions:", err));
  }, []);

  // ── Fetch all countries on mount for automatic synchronization (e.g. AI autofill) ──
  useEffect(() => {
    fetch("/api/countries?all=true")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        setAllCountries(list);
        if (selectedCountryIds.length > 0) {
          const selected = list.filter((c: Country) => selectedCountryIds.includes(c.id));
          setSelectedCountries(selected);
        }
      })
      .catch((err) => console.error("Failed to load all countries:", err));
  }, []);

  // ── Synchronize selectedCountries when selectedCountryIds or allCountries changes ──
  useEffect(() => {
    if (allCountries.length > 0) {
      const selected = allCountries.filter((c) => selectedCountryIds.includes(c.id));
      setSelectedCountries(selected);
    }
  }, [selectedCountryIds, allCountries]);

  // ── Country Search ──
  useEffect(() => {
    if (countryQuery.length < 1) {
      setCountryResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCountryLoading(true);
      try {
        const res = await fetch(`/api/countries?q=${encodeURIComponent(countryQuery)}`);
        const { data } = await res.json();
        setCountryResults(data || []);
      } catch (err) {
        console.error("Failed to search countries:", err);
      } finally {
        setIsCountryLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [countryQuery]);

  // ── Habitat Search ──
  useEffect(() => {
    if (habitatQuery.length < 1) {
      setHabitatResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/habitats?q=${encodeURIComponent(habitatQuery)}`);
        const { data } = await res.json();
        setHabitatResults(data || []);
      } catch (err) {
        console.error("Failed to search habitats:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [habitatQuery]);

  // ── Close dropdowns on click outside ──
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (habitatRef.current && !habitatRef.current.contains(event.target as Node)) {
        setShowHabitatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Country Actions ──
  const addCountry = (country: Country) => {
    if (!selectedCountryIds.includes(country.id)) {
      setValue("countries", [...selectedCountryIds, country.id], { shouldDirty: true });
      setSelectedCountries((prev) => [...prev, country]);
    }
    setAllCountries((prev) => {
      if (!prev.some((c) => c.id === country.id)) {
        return [...prev, country];
      }
      return prev;
    });
    setCountryQuery("");
    setShowCountryDropdown(false);
  };

  const removeCountry = (id: string) => {
    setValue("countries", selectedCountryIds.filter(cid => cid !== id), { shouldDirty: true });
    setSelectedCountries((prev) => prev.filter(c => c.id !== id));
  };

  const handleCountryPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const hasMultiple = pastedText.includes(",") || pastedText.includes(";") || pastedText.includes("\n") || pastedText.includes("\r");
    if (!hasMultiple) {
      return;
    }
    e.preventDefault();

    const countryNames = parsePastedList(pastedText);

    if (countryNames.length === 0) return;

    const toastId = toast.loading("Processing pasted countries...");

    try {
      const res = await fetch("/api/countries?all=true");
      const { data: dbCountries } = (await res.json()) as { data: Country[] };

      const newlySelected: Country[] = [];
      const notFoundNames: string[] = [];

      countryNames.forEach((name) => {
        const match = dbCountries.find(
          (dbc) => dbc.country.toLowerCase() === name.toLowerCase()
        );
        if (match) {
          newlySelected.push(match);
        } else {
          notFoundNames.push(name);
        }
      });

      if (newlySelected.length > 0) {
        const uniqueNewCountries = newlySelected.filter(
          (c) => !selectedCountryIds.includes(c.id)
        );

        if (uniqueNewCountries.length > 0) {
          setValue("countries", [...selectedCountryIds, ...uniqueNewCountries.map((c) => c.id)], { shouldDirty: true });
          setSelectedCountries((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const filteredNew = uniqueNewCountries.filter((c) => !existingIds.has(c.id));
            return [...prev, ...filteredNew];
          });
        }
      }
      setAllCountries(dbCountries);

      toast.dismiss(toastId);
      if (newlySelected.length > 0 && notFoundNames.length === 0) {
        toast.success(`Successfully auto-selected all ${newlySelected.length} countries!`);
      } else if (newlySelected.length > 0 && notFoundNames.length > 0) {
        toast.success(
          `Auto-selected ${newlySelected.length} countries! (${notFoundNames.length} not found: ${notFoundNames.join(", ")})`
        );
      } else {
        toast.error(`None of the pasted countries were found in the database.`);
      }

      setCountryQuery("");
    } catch (err) {
      console.error("Failed to parse and match pasted countries:", err);
      toast.dismiss(toastId);
      toast.error("Failed to process the pasted countries list.");
    }
  };

  // ── Inline Country Registration Submit ──
  const handleRegisterCountry = async (e: React.FormEvent) => {
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
      
      // Auto-select newly created country
      addCountry(newCountry);
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmittingCountry(false);
    }
  };

  // ── Habitat Actions ──
  const addHabitat = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selectedHabitats.includes(trimmed)) {
      setValue("habitats", [...selectedHabitats, trimmed], { shouldDirty: true });
    }
    setHabitatQuery("");
    setShowHabitatDropdown(false);
  };

  const handleHabitatKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHabitat(habitatQuery);
    }
  };

  const removeHabitat = (name: string) => {
    setValue("habitats", selectedHabitats.filter(h => h !== name), { shouldDirty: true });
  };

  const handleHabitatPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const hasMultiple = pastedText.includes(",") || pastedText.includes(";") || pastedText.includes("\n") || pastedText.includes("\r");
    if (!hasMultiple) {
      return;
    }
    e.preventDefault();

    const names = parsePastedList(pastedText);

    if (names.length === 0) return;

    const toastId = toast.loading("Processing pasted habitats...");

    try {
      const res = await fetch("/api/habitats?all=true");
      const { data: dbHabitats } = (await res.json()) as { data: Habitat[] };

      const newlySelected: string[] = [];
      const notFoundNames: string[] = [];

      names.forEach((name) => {
        const match = dbHabitats.find(
          (dbh) => dbh.habitat_name.toLowerCase() === name.toLowerCase()
        );
        if (match) {
          newlySelected.push(match.habitat_name);
        } else {
          notFoundNames.push(name);
        }
      });

      if (newlySelected.length > 0) {
        const uniqueNewHabitats = newlySelected.filter(
          (h) => !selectedHabitats.includes(h)
        );

        if (uniqueNewHabitats.length > 0) {
          setValue("habitats", [...selectedHabitats, ...uniqueNewHabitats], { shouldDirty: true });
        }
      }

      toast.dismiss(toastId);
      if (newlySelected.length > 0 && notFoundNames.length === 0) {
        toast.success(`Successfully auto-selected all ${newlySelected.length} habitats!`);
      } else if (newlySelected.length > 0 && notFoundNames.length > 0) {
        toast.success(
          `Auto-selected ${newlySelected.length} habitats! (${notFoundNames.length} skipped: ${notFoundNames.join(", ")})`
        );
      } else {
        toast.error(`None of the pasted habitats were found in the database. Use dropdown or press Enter to add new habitats manually.`);
      }

      setHabitatQuery("");
    } catch (err) {
      console.error("Failed to parse and match pasted habitats:", err);
      toast.dismiss(toastId);
      toast.error("Failed to process the pasted habitats list.");
    }
  };

  return (
    <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-8">
      {/* Countries Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
            <span className="material-symbols-outlined text-[22px] text-primary-container">public</span>
            Geographical Distribution
          </h2>
          <KnowledgeHelper label="Geographical Distribution" commonName={commonName} />
        </div>
        
        <div className="relative" ref={countryRef}>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                onPaste={handleCountryPaste}
                placeholder="Search countries (e.g. Thailand, China...)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
              />
              {isCountryLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full" />
              )}
            </div>

            <p className="text-[11px] text-[#1a1c19]/50 font-['Manrope'] flex items-center gap-1.5 px-1 select-none">
              <span className="material-symbols-outlined text-[13px] text-primary-container/70">info</span>
              <span><strong>💡 Smart Paste Active:</strong> Paste a list of countries (comma or newline separated) to automatically select them.</span>
            </p>

            {/* Country Dropdown */}
            {showCountryDropdown && countryQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto overflow-x-hidden">
                {countryResults.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addCountry(c)}
                    className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 transition-colors border-b last:border-b-0 border-outline-variant/50"
                  >
                    <span className="w-6 h-4 shrink-0 overflow-hidden rounded-sm bg-[#fafaf5] border border-outline-variant/30 flex items-center justify-center">
                      {c.country_flag?.startsWith("http") ? (
                        <img src={c.country_flag} alt={c.country} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[14px] leading-none">{c.country_flag || "📍"}</span>
                      )}
                    </span>
                    <span className="text-sm font-medium font-['Manrope'] text-[#1a1c19] truncate">{c.country}</span>
                    {selectedCountryIds.includes(c.id) && (
                      <span className="ml-auto material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                    )}
                  </button>
                ))}

                {/* Inline Register Country Option */}
                <button
                  type="button"
                  onClick={() => {
                    setModalCountryName(countryQuery);
                    setModalCountryFlag("");
                    setModalRegionId("");
                    setIsModalOpen(true);
                    setShowCountryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-primary-container/5 hover:bg-primary-container/10 flex items-center gap-3 transition-colors text-primary-container font-bold font-['Manrope'] text-xs border-t border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Can't find it? Register "{countryQuery}" as a new country</span>
                </button>
              </div>
            )}

            {/* Selected Countries */}
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-outline-variant text-[#1a1c19] text-xs font-bold font-['Manrope'] hover:border-primary-container transition-all group"
                >
                  <span className="w-4 h-3 shrink-0 overflow-hidden rounded-[2px] bg-[#fafaf5] border border-outline-variant/30 flex items-center justify-center">
                    {c.country_flag?.startsWith("http") ? (
                      <img src={c.country_flag} alt={c.country} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] leading-none">{c.country_flag || "📍"}</span>
                    )}
                  </span>
                  {c.country}
                  <button
                    type="button"
                    onClick={() => removeCountry(c.id)}
                    className="text-[#1a1c19]/40 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Habitats Section */}
      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans']">
          <span className="material-symbols-outlined text-[22px] text-primary-container">forest</span>
          Habitats & Environment
        </h2>
        
        <div className="relative" ref={habitatRef}>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#1a1c19]/40 text-[20px]">
                add_circle
              </span>
              <input
                type="text"
                value={habitatQuery}
                onChange={(e) => {
                  setHabitatQuery(e.target.value);
                  setShowHabitatDropdown(true);
                }}
                onFocus={() => setShowHabitatDropdown(true)}
                onKeyDown={handleHabitatKeyDown}
                onPaste={handleHabitatPaste}
                placeholder="Type and press Enter to add habitat (e.g. Tundra)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#1a1c19]/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
              />
            </div>

            <p className="text-[11px] text-[#1a1c19]/50 font-['Manrope'] flex items-center gap-1.5 px-1 select-none">
              <span className="material-symbols-outlined text-[13px] text-primary-container/70">info</span>
              <span><strong>💡 Smart Paste Active:</strong> Paste a list of habitats (comma or newline separated) to automatically select existing ones.</span>
            </p>

            {/* Habitat Dropdown (Results from DB) */}
            {showHabitatDropdown && habitatResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                {habitatResults.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => addHabitat(h.habitat_name)}
                    className="w-full text-left px-4 py-3 hover:bg-surface-container-low flex items-center gap-3 transition-colors border-b last:border-b-0 border-outline-variant/50"
                  >
                    <span className="material-symbols-outlined text-primary-container/40 text-[18px]">history</span>
                    <span className="text-sm font-medium font-['Manrope'] text-[#1a1c19]">{h.habitat_name}</span>
                    {selectedHabitats.includes(h.habitat_name) && (
                      <span className="ml-auto material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Habitats */}
            <div className="flex flex-wrap gap-2">
              {selectedHabitats.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-container/5 border border-primary-container/20 text-primary-container text-xs font-bold font-['Manrope']"
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => removeHabitat(h)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Register Country Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1a1c19]/40 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white border border-outline-variant rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#fafaf5] px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">public</span>
                Register New Country
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
                  onClick={() => setIsModalOpen(false)}
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
      )}
    </section>
  );
}
