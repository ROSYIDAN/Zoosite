"use client";

import { useCountrySelection, Country } from "@/hooks/use-country-selection";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import CountryModal from "./country-modal";
import { SelectedCountries } from "./selected-countries";
import { CountrySearchDropdown } from "./country-search-dropdown";

interface CountrySectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  initialCountries?: Country[];
  commonName?: string;
}

export default function CountrySection({ setValue, watch, initialCountries }: CountrySectionProps) {
  const {
    countryQuery,
    setCountryQuery,
    countryResults,
    isCountryLoading,
    showCountryDropdown,
    setShowCountryDropdown,
    selectedCountryIds,
    selectedCountries,
    isModalOpen,
    setIsModalOpen,
    modalCountryName,
    setModalCountryName,
    addCountry,
    removeCountry,
    handleCountryPaste,
    handleRegisterSuccess,
  } = useCountrySelection({ setValue, watch, initialCountries });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#2d5a27] mb-1.5 flex items-center gap-1.5">
          🌍 Geographic Distribution
        </label>
        <p className="text-xs text-[#2d5a27]/70 mb-3 leading-relaxed">
          Select all countries where this animal is naturally distributed. You can search countries individually or paste a comma-separated list.
        </p>

        <div className="space-y-3">
          <SelectedCountries
            selectedCountries={selectedCountries}
            removeCountry={removeCountry}
          />

          <CountrySearchDropdown
            countryQuery={countryQuery}
            setCountryQuery={setCountryQuery}
            showCountryDropdown={showCountryDropdown}
            setShowCountryDropdown={setShowCountryDropdown}
            isCountryLoading={isCountryLoading}
            countryResults={countryResults}
            selectedCountryIds={selectedCountryIds}
            addCountry={addCountry}
            removeCountry={removeCountry}
            handleCountryPaste={handleCountryPaste}
            setModalCountryName={setModalCountryName}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>

      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCountryName={modalCountryName}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
}