"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import { toast } from "react-hot-toast";
import { parsePastedList } from "@/lib/parse-pasted-list";

export interface Habitat {
  id: string;
  habitat_name: string;
}

interface UseHabitatSelectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
}

export function useHabitatSelection({ setValue, watch }: UseHabitatSelectionProps) {
  const [habitatQuery, setHabitatQuery] = useState("");
  const [habitatResults, setHabitatResults] = useState<Habitat[]>([]);
  const [showHabitatDropdown, setShowHabitatDropdown] = useState(false);
  const selectedHabitats = watch("habitats") || [];

  // Habitat Search
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

  return {
    habitatQuery,
    setHabitatQuery,
    habitatResults,
    showHabitatDropdown,
    setShowHabitatDropdown,
    selectedHabitats,
    addHabitat,
    removeHabitat,
    handleHabitatKeyDown,
    handleHabitatPaste,
  };
}
