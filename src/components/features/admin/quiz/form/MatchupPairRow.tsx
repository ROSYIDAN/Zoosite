"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";
import AnimalSearchInput from "./AnimalSearchInput";
import CountrySearchInput from "./CountrySearchInput";
import { cn } from "@/lib/utils";

interface MatchupPairRowProps {
  index: number;
  remove: (index: number) => void;
}

/**
 * MatchupPairRow renders two side-by-side text/image selectors for a matching pair.
 * It lets the admin toggle each side between "Animal" or "Country" mode,
 * and searches using their respective API autocomplete endpoints.
 * 
 * * Labels are stored as a pipe-separated string: `options[index].label = "leftLabel|rightLabel"`
 * * Images are stored as a pipe-separated string: `options[index].media_url = "leftImg|rightImg"`
 */
export default function MatchupPairRow({ index, remove }: MatchupPairRowProps) {
  const { setValue, watch, formState: { errors } } = useFormContext<CreateQuizQuestionInput>();

  const label = watch(`options.${index}.label`) || "";
  const [leftValue, rightValue] = label.split("|").map((s: string) => s.trim());

  const mediaUrl = watch(`options.${index}.media_url`) || "";
  const [leftImg, rightImg] = mediaUrl.split("|").map((s: string) => s.trim());

  // Search type states per side
  const [leftType, setLeftType] = useState<"animal" | "country">("animal");
  const [rightType, setRightType] = useState<"animal" | "country">("country");

  const optionsErrors = errors.options?.[index];

  const updateLabel = (side: "left" | "right", value: string) => {
    const newLeft = side === "left" ? value : (leftValue || "");
    const newRight = side === "right" ? value : (rightValue || "");
    setValue(`options.${index}.label`, `${newLeft}|${newRight}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // All matchup pairs are implicitly correct
    setValue(`options.${index}.is_correct`, true, { shouldDirty: true });
  };

  const updateImage = (side: "left" | "right", url: string) => {
    const newLeftImg = side === "left" ? url : (leftImg || "");
    const newRightImg = side === "right" ? url : (rightImg || "");
    setValue(`options.${index}.media_url`, `${newLeftImg}|${newRightImg}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSelectAnimal = (side: "left" | "right", animal: { name: string; imageUrl: string }) => {
    updateLabel(side, animal.name);
    updateImage(side, animal.imageUrl || "");
  };

  const handleSelectCountry = (side: "left" | "right", country: { name: string; flagUrl: string }) => {
    updateLabel(side, country.name);
    updateImage(side, country.flagUrl || "");
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 items-start p-3.5 rounded-xl border border-[#c2c9bb] bg-[#fafaf5] focus-within:border-[#2d5a27] focus-within:ring-1 focus-within:ring-[#2d5a27]/30 transition-all group">
      {/* Left Side Input Block */}
      <div className="flex flex-col">
        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 mb-1.5 justify-start">
          <button
            type="button"
            onClick={() => setLeftType("animal")}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all font-['Manrope']",
              leftType === "animal"
                ? "bg-[#2d5a27] text-white shadow-sm"
                : "bg-white/60 border border-[#c2c9bb]/40 text-[#72796e] hover:bg-[#eeeee9]/50"
            )}
          >
            Animal 🐾
          </button>
          <button
            type="button"
            onClick={() => setLeftType("country")}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all font-['Manrope']",
              leftType === "country"
                ? "bg-[#2d5a27] text-white shadow-sm"
                : "bg-white/60 border border-[#c2c9bb]/40 text-[#72796e] hover:bg-[#eeeee9]/50"
            )}
          >
            Country 🗺️
          </button>
        </div>

        {leftType === "animal" ? (
          <AnimalSearchInput
            value={leftValue || ""}
            onChange={(val) => updateLabel("left", val)}
            onSelectAnimal={(animal) => handleSelectAnimal("left", animal)}
            placeholder="Search animal..."
          />
        ) : (
          <CountrySearchInput
            value={leftValue || ""}
            onChange={(val) => updateLabel("left", val)}
            onSelectCountry={(country) => handleSelectCountry("left", country)}
            placeholder="Search country..."
          />
        )}
        {leftImg && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#72796e] font-['Manrope']">Image Link:</span>
            <img src={leftImg} alt="Preview" className="w-8 h-6 rounded object-cover border border-[#c2c9bb]/60" />
            <button
              type="button"
              onClick={() => updateImage("left", "")}
              className="text-xs text-red-600 hover:underline font-['Manrope']"
            >
              Clear Image
            </button>
          </div>
        )}
      </div>

      {/* Connector Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] mt-7">
        <span className="material-symbols-outlined text-[16px]">link</span>
      </div>

      {/* Right Side Input Block */}
      <div className="flex flex-col">
        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 mb-1.5 justify-start">
          <button
            type="button"
            onClick={() => setRightType("animal")}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all font-['Manrope']",
              rightType === "animal"
                ? "bg-[#2d5a27] text-white shadow-sm"
                : "bg-white/60 border border-[#c2c9bb]/40 text-[#72796e] hover:bg-[#eeeee9]/50"
            )}
          >
            Animal 🐾
          </button>
          <button
            type="button"
            onClick={() => setRightType("country")}
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all font-['Manrope']",
              rightType === "country"
                ? "bg-[#2d5a27] text-white shadow-sm"
                : "bg-white/60 border border-[#c2c9bb]/40 text-[#72796e] hover:bg-[#eeeee9]/50"
            )}
          >
            Country 🗺️
          </button>
        </div>

        {rightType === "animal" ? (
          <AnimalSearchInput
            value={rightValue || ""}
            onChange={(val) => updateLabel("right", val)}
            onSelectAnimal={(animal) => handleSelectAnimal("right", animal)}
            placeholder="Search animal..."
          />
        ) : (
          <CountrySearchInput
            value={rightValue || ""}
            onChange={(val) => updateLabel("right", val)}
            onSelectCountry={(country) => handleSelectCountry("right", country)}
            placeholder="Search country..."
          />
        )}
        {rightImg && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#72796e] font-['Manrope']">Image Link:</span>
            <img src={rightImg} alt="Preview" className="w-8 h-6 rounded object-cover border border-[#c2c9bb]/60" />
            <button
              type="button"
              onClick={() => updateImage("right", "")}
              className="text-xs text-red-600 hover:underline font-['Manrope']"
            >
              Clear Image
            </button>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-[#72796e] hover:text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors mt-7"
        title="Remove pair"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>

      {optionsErrors?.label && (
        <span className="col-span-4 text-red-500 text-xs font-['Manrope'] mt-1">{optionsErrors.label.message}</span>
      )}
    </div>
  );
}
