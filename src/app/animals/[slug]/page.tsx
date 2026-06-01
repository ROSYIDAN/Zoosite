import { notFound } from "next/navigation";
import AutoPagination from "@/components/AutoPagination";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import {
  AnimalHeader,
  AnimalImage,
  AnimalTaxonomyGrid,
  AnimalStatsGrid,
  AnimalHabitats,
  AnimalDistribution,
  AnimalPredators,
} from "@/components/animal_details";
import FavoriteButton from "@/components/features/favorites/FavoriteButton";
import { SetAvatarButton } from "@/components/features/profile/set-avatar-button";
import { getAnimalBySlug, mapAnimalToData, getCommonName } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const animal = await getAnimalBySlug(slug);

  if (!animal) {
    notFound();
  }

  // Security Guard: Hidden animals can only be viewed by administrators
  if (!animal.is_visible) {
    if (session?.user?.role !== UserRole.ADMIN) {
      notFound();
    }
  }

  const commonName = getCommonName(animal);
  const animalData = mapAnimalToData(animal);

  // Resolve matching animal slugs for predators that exist in the database
  const predatorNames = animalData.stats?.predators || [];
  const matchingAnimals = predatorNames.length > 0
    ? await prisma.animals.findMany({
        where: {
          animal_name: {
            in: predatorNames,
            mode: "insensitive",
          },
          canonical_slug: { not: null },
        },
        select: {
          animal_name: true,
          canonical_slug: true,
        },
      })
    : [];

  const resolvedPredators = predatorNames.map(name => {
    const match = matchingAnimals.find(
      a => a.animal_name?.toLowerCase() === name.toLowerCase()
    );
    return {
      name,
      slug: match?.canonical_slug || null,
    };
  });

  return (
    <div className="py-12 px-6 max-w-[1440px] mx-auto">
      <NavigationBreadcrumbs currentPageLabel={commonName} className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="relative w-full max-w-[584px] group">
          <AnimalImage 
            imageUrl={animalData.images[0]} 
            altText={commonName} 
            source={animalData.image_sources?.[0]} 
          />
          {session?.user && animalData.images[0] && (
            <div className="absolute top-4 right-4 z-10">
              <SetAvatarButton imageUrl={animalData.images[0]} animalName={commonName} />
            </div>
          )}
        </div>
        <AutoPagination>
          {/* Page 1: Primary Info */}
          <div className="space-y-6">
            {animal.contributor && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2d5a27]/10 border border-[#2d5a27]/20 text-xs font-bold text-[#2d5a27] font-['Plus_Jakarta_Sans'] uppercase tracking-wider mb-2 select-none w-fit">
                <span className="material-symbols-outlined text-[14px]">local_activity</span>
                Community Contribution by @{animal.contributor.name || animal.contributor.email.split('@')[0]}
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <AnimalHeader
                  commonName={commonName}
                  taxonomy={animalData.taxonomy}
                  description={animalData.descriptions?.[0]?.summary || null}
                  descriptionSource={animalData.descriptions?.[0]?.source_url || null}
                  scientificName={animalData.scientific_name}
                  diet={animalData.stats?.diet}
                  tags={animalData.tags}
                />
              </div>
              <div className="pt-2 flex flex-col items-end gap-3">
                <FavoriteButton animal={{ id: animal.id, name: commonName, slug, image: animalData.images[0] }} className="scale-125" />
              </div>
            </div>
            <AnimalTaxonomyGrid taxonomy={animalData.taxonomy} />
            <AnimalStatsGrid stats={animalData.stats} />
          </div>

          {/* Page 2: Detailed Stats & Distribution */}
          <div className="space-y-6">
            <AnimalStatsGrid stats={animalData.stats} section="details" />
            <AnimalHabitats habitats={animalData.habitats} />
            <AnimalDistribution distribution={animalData.distribution} />
            <AnimalPredators predators={resolvedPredators} currentAnimalName={commonName} />
          </div>
        </AutoPagination>
      </div>
    </div>
  );
}
