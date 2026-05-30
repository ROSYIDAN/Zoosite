"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import AnimalCard, { TrendingAnimal } from "./trending-slider/AnimalCard";
import NavigationControls from "./trending-slider/NavigationControls";

interface TrendingAnimalsSliderProps {
  animals: TrendingAnimal[];
  lastFetched?: string;
}

/**
 * Main Slider component for trending animals.
 * Orchestrates infinite scroll logic, window resizing, and inactivity refreshes.
 */
export default function TrendingAnimalsSlider({ animals, lastFetched }: TrendingAnimalsSliderProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // Inactivity refresh logic: If away for > 10 mins, refresh on return
  useEffect(() => {
    const KEY = "last_dashboard_visit";
    const now = Date.now();
    const lastVisit = sessionStorage.getItem(KEY);

    if (lastVisit) {
      const diff = now - parseInt(lastVisit, 10);
      if (diff > 10 * 60 * 1000) { // 10 minutes
        router.refresh();
      }
    }
    sessionStorage.setItem(KEY, now.toString());
  }, [router]);

  // Dynamically update how many items to show based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      let newItemsPerView = 4;
      if (window.innerWidth < 768) {
        newItemsPerView = 1;
      } else if (window.innerWidth < 1024) {
        newItemsPerView = 2;
      }
      setItemsPerView(newItemsPerView);
      setStartIndex((prev) => Math.min(prev, Math.max(0, animals.length - newItemsPerView)));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [animals.length]);

  // Duplicate items for infinite scroll
  const extendedAnimals = [...animals, ...animals.slice(0, itemsPerView)];

  const handleNext = () => {
    if (isAnimating || animals.length <= itemsPerView) return;
    setIsAnimating(true);
    setIsTransitioning(true);
    setStartIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAnimating || animals.length <= itemsPerView) return;
    setIsAnimating(true);

    if (startIndex === 0) {
      setIsTransitioning(false);
      setStartIndex(animals.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setStartIndex(animals.length - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setStartIndex((prev) => prev - 1);
    }
  };

  // Unlock animation after transition and silently reset if needed
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        if (startIndex === animals.length) {
          setIsTransitioning(false);
          setStartIndex(0);
        }
      }, 500); // Match CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, startIndex, animals.length]);

  return (
    <section className="space-y-6">
      <NavigationControls
        onPrev={handlePrev}
        onNext={handleNext}
        prevDisabled={animals.length <= itemsPerView}
        nextDisabled={animals.length <= itemsPerView}
        lastFetched={lastFetched}
      />

      {animals.length === 0 ? (
        <p className="text-on-surface-variant col-span-full">No trending research available.</p>
      ) : (
        <div className="overflow-hidden -mx-3 -my-4 px-3 py-4">
          <div
            className={cn(
              "flex",
              isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
            )}
            style={{ transform: `translateX(-${startIndex * (100 / itemsPerView)}%)` }}
          >
            {extendedAnimals.map((animal, index) => (
              <div key={index} className="flex-none w-full md:w-1/2 lg:w-1/4 px-3">
                <AnimalCard animal={animal} priority={index < itemsPerView} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
