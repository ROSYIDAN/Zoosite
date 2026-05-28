import { prisma } from "@/lib/prisma";
import { buildLocalImageUrl, checkLocalImageExists } from "@/lib/image-utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import AnimalCardGrid from "@/components/grid/animal-card-grid";

export default async function HabitatDetailPage({
  params,
}: {
  params: Promise<{ habitat: string }>;
}) {
  const { habitat } = await params;
  const habitatName = decodeURIComponent(habitat);

  // Added 2 second delay back for testing purposes
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const habitatData = await prisma.habitat.findFirst({
    where: { 
        habitat_name: {
            equals: habitatName,
            mode: 'insensitive'
        }
    },
    include: {
      animal_environment: {
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
  });

  if (!habitatData) {
    notFound();
  }

  // Flatten animals
  const rawAnimals = habitatData.animal_environment
    .map(env => env.animals)
    .filter(Boolean);

  const filterResults = await Promise.all(
    rawAnimals.map(async (animal) => {
      const hasImgbb = animal!.animal_images?.some((img: any) => img.image_url?.includes("ibb.co"));
      const exists = hasImgbb || await checkLocalImageExists(animal!.id);
      return { animal, exists };
    })
  );

  const animals = filterResults
    .filter((r) => r.exists)
    .map((r) => r.animal)
    .map((animal) => {
      const imgbbUrl = animal!.animal_images?.find((img: any) => img.image_url?.includes("ibb.co"))?.image_url;
      return {
        id: animal!.id,
        name: animal!.animal_name || "Unknown",
        slug: animal!.canonical_slug || "",
        image: imgbbUrl || buildLocalImageUrl(animal!.canonical_slug) || undefined,
      };
    });

  return (
    <div className="p-8">
      <NavigationBreadcrumbs currentPageLabel={habitatName} className="mb-8" />
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold font-headline text-primary lowercase capitalize">{habitatName}</h1>
          <span className="material-symbols-outlined text-4xl text-primary opacity-20">eco</span>
        </div>
        <p className="text-on-surface-variant mt-2 font-medium">
            {animals.length} species documented within this environment.
        </p>
      </div>

      <AnimalCardGrid animals={animals} currentPageLabel={habitatName} />

      {animals.length === 0 && (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-20 font-variation-settings-fill">eco</span>
          <p className="mt-4 text-on-surface-variant font-medium">No animals documented for this ecosystem yet.</p>
        </div>
      )}
    </div>
  );
}
