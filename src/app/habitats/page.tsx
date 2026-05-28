import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import HabitatCardGrid from "@/components/grid/HabitatCardGrid";

export default async function HabitatsPage() {
  // Fetch distinct habitats and their animal counts
  const habitats = await prisma.habitat.findMany({
    select: {
      id: true,
      habitat_name: true,
      _count: {
        select: { animal_environment: true }
      }
    },
    where: {
      habitat_name: { not: null }
    },
    orderBy: {
      habitat_name: 'asc'
    }
  });

  return (
    <div className="p-8">
      <NavigationBreadcrumbs currentPageLabel="Ecosystem Archive" className="mb-8" />
      <h1 className="text-3xl font-bold mb-6 font-headline text-primary">Ecosystem Archive</h1>
      
      <HabitatCardGrid habitats={habitats} />

      <div className="mt-8">
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
