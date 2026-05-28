"use client";

import { useEffect, useState } from "react";
import { useFavorites, AnimalFavorite } from "@/store/useFavorites";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  animal: AnimalFavorite;
  className?: string;
}

export default function FavoriteButton({ animal, className = "" }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder to prevent layout shift before hydration
    return (
      <div className="relative inline-block">
        <button className={`pt-1 h-14 w-14 rounded-full border border-outline-variant/30 text-outline-variant/30 ${className}`}>
          <span className="flex justify-center text-outline-variant/30"><FaRegHeart size={24} /></span>
        </button>
      </div>
    );
  }

  const isFav = isFavorite(animal.id);

  const toggleFavorite = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (isFav) {
      removeFavorite(animal.id);
      toast("Removed from My Zoo", { icon: "💔", duration: 1200 });
    } else {
      addFavorite(animal);
      toast.success("Added to My Zoo", { icon: "❤️", duration: 1500 });
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 500); // 500ms debounce
  };

  return (
    <div className="relative inline-block z-10">
      <button
        onClick={toggleFavorite}
        disabled={isProcessing}
        className={`pt-1 h-14 w-14 rounded-full border transition-all ${isProcessing ? "opacity-70 cursor-wait scale-95" : "hover:bg-surface-container"
          } border-outline-variant ${className}`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <span className={`flex justify-center transition-colors ${isFav ? "text-red-500" : "text-on-surface"}`}>
          {isFav ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
        </span>
      </button>
    </div>
  );
}
