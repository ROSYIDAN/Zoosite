import { prisma } from "@/lib/prisma";
import { buildLocalImageUrl, checkLocalImageExists } from "@/lib/image-utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
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
        where: {
          animals: {
            is_visible: true
          }
        },
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
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto">
        {/* Breadcrumbs & Header section */}
        <div className="flex flex-col gap-4">
          <NavigationBreadcrumbs currentPageLabel={habitatName} />
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary dark:text-[#d0e8c5] font-headline lowercase capitalize">
              {habitatName}
            </h1>
            <span className="material-symbols-outlined text-[24px] text-primary opacity-40">eco</span>
          </div>
          <p className="text-sm text-[#1a1c19]/60 dark:text-[#fafaf5]/60 max-w-2xl font-['Manrope']">
            {animals.length} species documented within this environment.
          </p>
        </div>

        {/* Species grid layout */}
        <AnimalCardGrid animals={animals} currentPageLabel={habitatName} />

        {animals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-[#232621] rounded-3xl p-8 border border-outline-variant/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined text-4xl text-primary opacity-40">eco</span>
            <div>
              <p className="text-lg font-semibold text-[#1a1c19]">No species documented yet</p>
              <p className="text-sm text-[#1a1c19]/60">There are no animals cataloged for this environment yet.</p>
            </div>
          </div>
        )}

        {/* Back navigation */}
        <div className="pt-4">
          <Link
            href="/habitats"
            className="text-primary hover:underline flex items-center gap-2 font-medium font-['Manrope'] text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Biome Explorer
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
