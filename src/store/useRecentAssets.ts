import { create } from "zustand";

interface RecentAssetsState {
  recentImages: string[];
  addRecentImage: (url: string) => void;
}

export const useRecentAssets = create<RecentAssetsState>((set) => ({
  recentImages: [],
  addRecentImage: (url) =>
    set((state) => {
      // Keep only unique images and limit to 10
      const updated = [url, ...state.recentImages.filter((img) => img !== url)].slice(0, 10);
      return { recentImages: updated };
    }),
}));
