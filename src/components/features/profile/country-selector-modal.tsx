"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CountryCombobox from "./country-combobox";
import type { Country } from "@/types/native-animals.types";

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  countries: Country[];
  currentCountryId?: string;
}

/**
 * CountrySelectorModal - Modal dialog for selecting user's country
 * Used on dashboard prompt and profile settings
 */
export default function CountrySelectorModal({
  isOpen,
  onClose,
  userId,
  countries,
  currentCountryId,
}: CountrySelectorModalProps) {
  const [selectedCountryId, setSelectedCountryId] = useState(
    currentCountryId || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = async () => {
    if (!selectedCountryId) {
      setError("Please select a country");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/user/country", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryId: selectedCountryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update country");
      }

      // Refresh the page to show updated native animals
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    setSelectedCountryId(currentCountryId || "");
    setError(null);
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="bg-surface-container-low rounded-2xl shadow-2xl border border-outline-variant/20">
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/10 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">
                  public
                </span>
                Select Your Country
              </h2>
              <button
                onClick={handleSkip}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">
                  close
                </span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mt-2">
              Choose your country to see endemic wildlife native to your region
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Country / Region
              </label>
              <CountryCombobox
                countries={countries}
                value={selectedCountryId}
                onChange={setSelectedCountryId}
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/10 flex items-center justify-end gap-3 rounded-b-2xl">
            <button
              onClick={handleSkip}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
            >
              Skip for now
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
                  Save Country
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}