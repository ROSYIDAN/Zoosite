import React from "react";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import AnimalCardGrid from "@/components/grid/animal-card-grid";
import { animalService } from "@/services/animal.service";

export const metadata = {
  title: "Species Archive | Arboreal Archive",
  description: "Browse the complete database of cataloged species.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnimalsArchivePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  const result = await animalService.list({
    limit: 1000,
    page: 1,
    search: search,
  });

  const animals = result.data.map((item: any) => ({
    id: item.id,
    name: item.name || "Unknown Species",
    slug: item.slug || "",
    image: item.image,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto">
        <div className="p-6 bg-white/40 dark:bg-[#232621]/40 rounded-r-3xl rounded-l-lg border border-[#1a1c19]/5 dark:border-white/5 border-l-4 border-l-primary dark:border-l-[#d0e8c5] backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary dark:text-[#d0e8c5] font-headline">
            {search ? `Search Results for "${search}"` : "Species Archive"}
          </h1>
          <p className="text-sm text-[#1a1c19]/85 dark:text-[#fafaf5]/85 mt-2 max-w-3xl font-['Manrope'] leading-relaxed">
            {animals.length} species documented in the archive.
          </p>
        </div>

        {animals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-[#232621] rounded-3xl p-8 border border-outline-variant/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined text-4xl text-primary">search_off</span>
            <div>
              <p className="text-lg font-semibold text-[#1a1c19]">No matching species found</p>
              <p className="text-sm text-[#1a1c19]/60">Try adjusting your query or check back later.</p>
            </div>
          </div>
        ) : (
          <AnimalCardGrid animals={animals} currentPageLabel="Archive" />
        )}
      </div>
    </DashboardLayout>
  );
}
