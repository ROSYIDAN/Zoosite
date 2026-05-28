import { prisma } from "@/lib/prisma";
import { buildLocalImageUrl, checkLocalImageExists } from "@/lib/image-utils";
import { notFound } from "next/navigation";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import AnimalCardGrid from "@/components/grid/animal-card-grid";

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionName = decodeURIComponent(region);

  // Added 2 second delay back for testing purposes
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const regionData = await prisma.regions.findFirst({
    where: {
      region: {
        equals: regionName,
        mode: 'insensitive'
      }
    },
    include: {
      countries: {
        select: {
          country: true,
          animal_distributions: {
            select: {
              animals: {
                select: {
                  id: true,
                  canonical_slug: true,
                  animal_name: true,
                  scientific_name: true,
                  animal_images: {
                    select: { image_url: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!regionData) {
    notFound();
  }

  // Flatten animals from all countries in the region
  const animalsMap = new Map();
  regionData.countries.forEach(c => {
    c.animal_distributions.forEach(dist => {
      if (dist.animals) {
        animalsMap.set(dist.animals.id, dist.animals);
      }
    });
  });

  const rawAnimals = Array.from(animalsMap.values());

  const filterResults = await Promise.all(
    rawAnimals.map(async (animal) => {
      const hasImgbb = animal.animal_images?.some((img: any) => img.image_url?.includes("ibb.co"));
      const exists = hasImgbb || await checkLocalImageExists(animal.id);
      return { animal, exists };
    })
  );

  const animals = filterResults
    .filter((r) => r.exists)
    .map((r) => r.animal)
    .map((animal) => {
      const imgbbUrl = animal.animal_images?.find((img: any) => img.image_url?.includes("ibb.co"))?.image_url;
      return {
        id: animal.id,
        name: animal.animal_name || "Unknown",
        slug: animal.canonical_slug || "",
        image: imgbbUrl || buildLocalImageUrl(animal.canonical_slug) || undefined,
      };
    });

  return (
    <div className="p-8">
      <NavigationBreadcrumbs currentPageLabel={regionName} className="mb-8" />
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">{regionName}</h1>
        <p className="text-on-surface-variant mt-2">
          {animals.length} species documented in this region across {regionData.countries.length} countries.
        </p>
      </div>

      <AnimalCardGrid animals={animals} currentPageLabel={regionName} />

      {animals.length === 0 && (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-20">inventory_2</span>
          <p className="mt-4 text-on-surface-variant font-medium">No animals documented for this region yet.</p>
        </div>
      )}
    </div>
  );
}
