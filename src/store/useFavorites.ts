import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnimalFavorite {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface FavoritesState {
  favorites: AnimalFavorite[];
  addFavorite: (animal: AnimalFavorite) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (animal) =>
        set((state) => {
          // Prevent duplicates
          if (state.favorites.some((f) => f.id === animal.id)) {
            return state;
          }
          return { favorites: [...state.favorites, animal] };
        }),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((a) => a.id !== id),
        })),
      isFavorite: (id) => get().favorites.some((a) => a.id === id),
    }),
    {
      name: 'zoosite-favorites-storage',
    }
  )
);
