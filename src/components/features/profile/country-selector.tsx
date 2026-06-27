"use client";

import { useState } from "react";
import CountryCombobox from "./country-combobox";
import type { Country } from "@/types/native-animals.types";
import CountryFlag from "@/components/ui/country-flag";

interface CountrySelectorProps {
  countries: Country[];
  currentCountryId?: string;
  userId: string;
}

/**
 * CountrySelector - Profile page widget for country selection
 * Allows users to update their country in settings
 */
export default function CountrySelector({
  countries,
  currentCountryId,
  userId,
}: CountrySelectorProps) {
  const [selectedCountryId, setSelectedCountryId] = useState(
    currentCountryId || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges = selectedCountryId !== (currentCountryId || "");
  const currentCountry = countries.find((c) => c.id === currentCountryId);

  const handleSave = async () => {
    if (!selectedCountryId) {
      setError("Please select a country");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/user/country", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryId: selectedCountryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update country");
      }

      setSuccess(true);
      // Refresh the page after a short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(currentCountryId || "");
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-primary font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">public</span>
          Country / Region
        </h3>
        <p className="text-sm text-on-surface-variant mt-1">
          Set your country to see wildlife native to your region
        </p>
      </div>

      {/* Current Country Display */}
      {currentCountry && !hasChanges && (
        <div className="mb-4 p-3 bg-surface-container rounded-lg border border-outline-variant/10">
          <p className="text-xs text-on-surface-variant mb-1">Current:</p>
          <div className="flex items-center gap-2 text-on-surface">
            <CountryFlag flag={currentCountry.flag} alt={currentCountry.name} />
            <span className="font-medium">{currentCountry.name}</span>
          </div>
        </div>
      )}

      {/* Country Selector */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Select Country
          </label>
          <CountryCombobox
            countries={countries}
            value={selectedCountryId}
            onChange={setSelectedCountryId}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium">
              Country updated successfully! Refreshing...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !selectedCountryId}
              className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}