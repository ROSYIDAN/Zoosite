"use client";

import { useState, useEffect, useMemo } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { toast } from "react-hot-toast";
import { parsePastedList } from "@/lib/parse-pasted-list";

export interface Country {
  id: string;
  country: string;
  country_flag: string | null;
}

interface UseCountrySelectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
  initialCountries?: Country[];
}

export function useCountrySelection({ setValue, watch, initialCountries }: UseCountrySelectionProps) {
  const [countryQuery, setCountryQuery] = useState("");
  const [countryResults, setCountryResults] = useState<Country[]>([]);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const selectedCountryIds = watch("countries") || [];
  
  const [allCountries, setAllCountries] = useState<Country[]>(initialCountries || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCountryName, setModalCountryName] = useState("");

  // Fetch all countries on mount for automatic synchronization (e.g. AI autofill)
  useEffect(() => {
    fetch("/api/countries?all=true")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        setAllCountries(list);
      })
      .catch((err) => console.error("Failed to load all countries:", err));
  }, []);

  // Derive selectedCountries using useMemo based on selectedCountryIds and allCountries
  const selectedCountries = useMemo(() => {
    return selectedCountryIds
      .map((id) => {
        const found = allCountries.find((c) => c.id === id);
        if (found) return found;
        return initialCountries?.find((c) => c.id === id) || null;
      })
      .filter((c): c is Country => c !== null);
  }, [selectedCountryIds, allCountries, initialCountries]);

  // Country Search
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

  const addCountry = (country: Country) => {
    if (!selectedCountryIds.includes(country.id)) {
      setValue("countries", [...selectedCountryIds, country.id], { shouldDirty: true });
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
    setValue(
      "countries",
      selectedCountryIds.filter((cid) => cid !== id),
      { shouldDirty: true }
    );
  };

  const handleCountryPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const hasMultiple =
      pastedText.includes(",") ||
      pastedText.includes(";") ||
      pastedText.includes("\n") ||
      pastedText.includes("\r");
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
          setValue(
            "countries",
            [...selectedCountryIds, ...uniqueNewCountries.map((c) => c.id)],
            { shouldDirty: true }
          );
        }
      }
      setAllCountries(dbCountries);

      toast.dismiss(toastId);
      if (newlySelected.length > 0 && notFoundNames.length === 0) {
        toast.success(`Successfully auto-selected all ${newlySelected.length} countries!`);
      } else if (newlySelected.length > 0 && notFoundNames.length > 0) {
        toast.success(
          `Auto-selected ${newlySelected.length} countries! (${notFoundNames.length} not found: ${notFoundNames.join(
            ", "
          )})`
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

  const handleRegisterSuccess = (newCountry: Country) => {
    addCountry(newCountry);
    setIsModalOpen(false);
  };

  return {
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
  };
}