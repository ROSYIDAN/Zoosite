"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface VisibilityToggleProps {
  animalId: string;
  initialVisible: boolean;
  animalName: string;
}

export default function VisibilityToggle({
  animalId,
  initialVisible,
  animalName,
}: VisibilityToggleProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);
    const nextState = !isVisible;

    // Optimistic UI update
    setIsVisible(nextState);

    try {
      const response = await fetch(`/api/animals/${animalId}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_visible: nextState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      toast.success(
        `"${animalName}" is now ${nextState ? "Published (Visible)" : "Draft (Hidden)"}!`
      );
    } catch (error) {
      // Revert optimistic update on error
      setIsVisible(!nextState);
      toast.error("Failed to update visibility status.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 select-none w-fit">
      {/* Dynamic Glassmorphic Status Pill */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold font-['Plus_Jakarta_Sans'] border uppercase tracking-wider transition-all duration-300 w-[100px] justify-center ${
          isVisible
            ? "bg-[#2d5a27]/10 border-[#2d5a27]/20 text-[#2d5a27]"
            : "bg-[#5c635a]/10 border-[#5c635a]/20 text-[#5c635a]"
        }`}
      >
        <span className="material-symbols-outlined text-[13px]">
          {isVisible ? "check_circle" : "visibility_off"}
        </span>
        <span>{isVisible ? "Published" : "Draft"}</span>
      </div>

      {/* Premium Toggle Switch Button */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={`Toggle visibility for ${animalName}`}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isVisible ? "bg-primary" : "bg-outline-variant/30"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isVisible ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
