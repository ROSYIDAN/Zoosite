import { dashboardService } from "@/services/dashboard.service";
import TrendingAnimalsSlider from "./trending-animals-slider";
import { TrendingAnimal } from "./trending-slider/AnimalCard";
import { unstable_cache } from "next/cache";

const getCachedTrending = unstable_cache(
  async () => dashboardService.getTrending({ detail: "full" }),
  ["trending-animals-cache"],
  { revalidate: 300 } // 5 minutes cache
);

/**
 * TrendingAnimals Server Component wrapper.
 * Following FE System Law: Fetches data on the server, passes to client slider component.
 */
export default async function TrendingAnimals() {
  let formattedAnimals: TrendingAnimal[] = [];
  let lastFetched = new Date().toISOString();

  try {
    const data = await getCachedTrending();
    formattedAnimals = data.map((item: any) => ({
      slug: item.slug,
      name: item.name,
      category: `${item.stats?.diet || 'Unknown'} • ${item.habitats?.[0] || 'Unknown'}`,
      image: item.imageUrl || "/static_image.png",
    }));
  } catch (error) {
    console.error("Failed to fetch trending animals:", error);
  }

  return <TrendingAnimalsSlider animals={formattedAnimals} lastFetched={lastFetched} />;
}
