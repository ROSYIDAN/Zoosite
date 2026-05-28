"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateAnimalInput } from "@/lib/validations/animal.schema";
import TagRecommendations from "./tag-recommendations";
import TagList from "./tag-list";

interface AnimalTagCardProps {
  setValue: UseFormSetValue<CreateAnimalInput>;
  watch: UseFormWatch<CreateAnimalInput>;
}

// Convert tag string to Title Case (e.g. "big cat" -> "Big Cat")
const normalizeTag = (tag: string): string => {
  return tag
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AnimalTagCard({ setValue, watch }: AnimalTagCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [existingTags, setExistingTags] = useState<{ id: string; name: string }[]>([]);
  const currentTags = watch("tags") || [];

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExistingTags(data);
        }
      })
      .catch((err) => console.error("Failed to fetch tags for suggestions:", err));
  }, []);

  // Watch other classification inputs for dynamic smart recommendations
  const family = watch("family") || "";
  const ordo = watch("ordo") || "";
  const diet = watch("diet") || "";
  const name = watch("name") || "";
  const conservationStatus = watch("conservation_status") || "";

  // ── Dynamic Taxonomy Recommendation Logic ──
  const getRecommendedTags = (): string[] => {
    const recs: string[] = [];
    const lowerFamily = family.trim().toLowerCase();
    const lowerOrdo = ordo.trim().toLowerCase();
    const lowerDiet = diet.trim().toLowerCase();
    const lowerName = name.trim().toLowerCase();
    const lowerStatus = conservationStatus.trim().toLowerCase();

    // 1. Felidae (Cat Family) dynamic rules
    if (lowerFamily === "felidae") {
      recs.push("Feline");

      const bigCatKeywords = ["lion", "tiger", "leopard", "jaguar", "panther", "cheetah", "cougar", "puma"];
      const isBigCat = bigCatKeywords.some((keyword) => lowerName.includes(keyword));

      if (lowerOrdo === "carnivore" || lowerDiet === "carnivore" || lowerOrdo.includes("carnivor")) {
        if (isBigCat) {
          recs.push("Big Cat");
        } else {
          recs.push("Small Cat");
        }
      }
    }

    // 2. Canidae (Dog Family) dynamic rules
    if (lowerFamily === "canidae") {
      recs.push("Canine");
      const wildCanidKeywords = ["wolf", "fox", "jackal", "coyote"];
      const isWildCanid = wildCanidKeywords.some((keyword) => lowerName.includes(keyword));
      if (isWildCanid) {
        recs.push("Wild Canid");
      }
    }

    // 3. Diet-based tags
    if (lowerDiet === "carnivore" || lowerOrdo === "carnivore" || lowerOrdo.includes("carnivor")) {
      recs.push("Carnivore");
      recs.push("Predator");
    } else if (lowerDiet === "herbivore" || lowerOrdo === "herbivore" || lowerOrdo.includes("herbivor")) {
      recs.push("Herbivore");
      recs.push("Grazer");
    } else if (lowerDiet === "omnivore" || lowerOrdo === "omnivore" || lowerOrdo.includes("omnivor")) {
      recs.push("Omnivore");
    }

    // 4. Conservation status
    if (lowerStatus && (lowerStatus.includes("endangered") || lowerStatus.includes("vulnerable") || lowerStatus.includes("threatened"))) {
      recs.push("Endangered");
    }

    // Filter out tags that are already selected
    return recs.filter((tag) => !currentTags.includes(tag));
  };

  const recommendedTags = getRecommendedTags();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const rawTag = inputValue.trim();
      if (!rawTag) return;

      const newTag = normalizeTag(rawTag);

      if (newTag && !currentTags.includes(newTag)) {
        setValue("tags", [...currentTags, newTag], { shouldDirty: true });
      }
      setInputValue("");
    }
  };

  const addTag = (tagToAdd: string) => {
    const normalized = normalizeTag(tagToAdd);
    if (normalized && !currentTags.includes(normalized)) {
      setValue("tags", [...currentTags, normalized], { shouldDirty: true });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };

  // Filter existing tags that match user input and are not already added
  const matchingSuggestions = inputValue.trim()
    ? existingTags.filter(
      (t) =>
        t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !currentTags.includes(t.name)
    )
    : [];

  return (
    <section className="bg-white border border-[#c2c9bb] rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1c19] font-['Plus_Jakarta_Sans'] mb-4">
        <span className="material-symbols-outlined text-[22px] text-[#2d5a27]">sell</span>
        Classification Tags
      </h2>

      <p className="text-xs text-[#1a1c19]/60 mb-4 font-['Manrope']">
        Add descriptive tags like "Cute", "Fierce", or "Endangered". Type and press Enter.
      </p>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Rare, nocturnal..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#1a1c19]/10 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] outline-none transition-all text-sm font-['Manrope'] bg-[#fafaf5]/50"
          />

          {/* 🌟 Dynamic Tag search suggestions dropdown */}
          {matchingSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#c2c9bb] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto font-['Manrope'] divide-y divide-[#e3e3de]">
              {matchingSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => {
                    addTag(suggestion.name);
                    setInputValue("");
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-[#1a1c19] hover:bg-[#fafaf5] transition-colors flex items-center justify-between"
                >
                  <span>{suggestion.name}</span>
                  <span className="text-[10px] text-[#2d5a27]/60 font-semibold uppercase tracking-wider">Use Existing</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Tag Recommendations Subcomponent */}
        <TagRecommendations recommendedTags={recommendedTags} onAddTag={addTag} />

        {/* Selected Tags List Subcomponent */}
        <TagList tags={currentTags} onRemoveTag={removeTag} />
      </div>
    </section>
  );
}
