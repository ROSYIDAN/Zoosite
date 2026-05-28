import { animalService } from "@/services/animal.service";
import AdminAnimalHeader from "@/components/features/admin/animals/animal-list-admin/AdminAnimalHeader";
import AdminAnimalSearch from "@/components/features/admin/animals/animal-list-admin/AdminAnimalSearch";
import AdminAnimalTable from "@/components/features/admin/animals/animal-list-admin/AdminAnimalTable";
import AdminAnimalPagination from "@/components/features/admin/animals/animal-list-admin/AdminAnimalPagination";

export default async function AdminAnimalListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: "name" | "scientific_name" | "created_at";
    order?: "asc" | "desc";
  }>;
}) {
  const {
    page: pageStr,
    search,
    sort = "name",
    order = "asc"
  } = await searchParams;

  const page = parseInt(pageStr || "1", 10);
  const limit = 8;

  const { data: animals, meta } = await animalService.list({
    page,
    limit,
    search,
    sort,
    order,
    includeHidden: true,
  });

  const totalPages = Math.ceil(meta.total / limit);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 1. Header & CTA controls */}
      <AdminAnimalHeader />

      {/* 2. Unified Search Filter Component */}
      <AdminAnimalSearch search={search} sort={sort} order={order} />

      {/* 3. Table Layout with Sorting & Status Toggles */}
      <div className="bg-white rounded-3xl border border-[#1a1c19]/8 overflow-hidden shadow-sm">
        <AdminAnimalTable
          animals={animals}
          search={search}
          sort={sort}
          order={order}
          page={page}
        />

        {/* 4. Page Indicator & Pagination Footer controls */}
        <AdminAnimalPagination
          page={page}
          totalPages={totalPages}
          search={search}
          sort={sort}
          order={order}
        />
      </div>
    </div>
  );
}

