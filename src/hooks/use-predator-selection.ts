"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";

interface UsePredatorSelectionProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
}

export function usePredatorSelection({
  setValue,
  watch,
}: UsePredatorSelectionProps) {
  const [predatorQuery, setPredatorQuery] = useState("");
  const [animalResults, setAnimalResults] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const predatorsValue = watch("predators") || "";
  const currentPredators = predatorsValue
    ? predatorsValue.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (predatorQuery.trim().length < 1) {
      setAnimalResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/animals?search=${encodeURIComponent(predatorQuery)}`);
        const data = await res.json();
        setAnimalResults(data.data || []);
      } catch (err) {
        console.error("Failed to search animals for predators:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [predatorQuery]);

  const addPredator = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const normalized = trimmed
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!currentPredators.includes(normalized)) {
      const updated = [...currentPredators, normalized];
      setValue("predators", updated.join(", "), { shouldDirty: true });
    }
    setPredatorQuery("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addPredator(predatorQuery);
    }
  };

  const removePredator = (name: string) => {
    const updated = currentPredators.filter((p) => p !== name);
    setValue("predators", updated.join(", "), { shouldDirty: true });
  };

  return {
    predatorQuery,
    setPredatorQuery,
    animalResults,
    isLoading,
    showDropdown,
    setShowDropdown,
    currentPredators,
    addPredator,
    removePredator,
    handleKeyDown,
  };
}