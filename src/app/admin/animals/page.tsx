
import { animalService } from "@/services/animal.service";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    order
  });

  const totalPages = Math.ceil(meta.total / limit);

  // Helper to build URL with kept search params
  const getUrl = (params: Record<string, string | number | undefined>) => {
    const nextParams = new URLSearchParams();
    if (search) nextParams.set("search", search);
    nextParams.set("sort", sort);
    nextParams.set("order", order);
    nextParams.set("page", page.toString());

    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined) nextParams.delete(k);
      else nextParams.set(k, v.toString());
    });

    return `/admin/animals?${nextParams.toString()}`;
  };

  const toggleOrder = (field: string) => {
    if (sort === field) {
      return order === "asc" ? "desc" : "asc";
    }
    return "asc";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight text-primary">
            Species Inventory
          </h1>
        </div>

        <Link
          href="/admin/animals/create"
          className="flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-2xl font-bold font-['Manrope'] shadow-lg shadow-primary-container/20 hover:bg-primary transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Register Species
        </Link>
      </header>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <form className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1c19]/30">search</span>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name or scientific name..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#1a1c19]/8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all font-['Manrope'] text-sm"
          />
          {/* Hidden inputs to preserve sort state on search submit */}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="order" value={order} />
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-[#1a1c19]/8 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafaf5] border-b border-[#1a1c19]/8">
              <th className="px-6 py-4">
                <Link
                  href={getUrl({ sort: "name", order: toggleOrder("name"), page: 1 })}
                  className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40 hover:text-primary-container transition-colors"
                >
                  Animal
                  {sort === "name" && (
                    <span className="material-symbols-outlined text-[14px]">
                      {order === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </Link>
              </th>
              <th className="px-6 py-4">
                <Link
                  href={getUrl({ sort: "scientific_name", order: toggleOrder("scientific_name"), page: 1 })}
                  className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40 hover:text-primary-container transition-colors"
                >
                  Scientific Name
                  {sort === "scientific_name" && (
                    <span className="material-symbols-outlined text-[14px]">
                      {order === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </Link>
              </th>
              <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1c19]/5">
            {animals.map((animal) => (
              <tr key={animal.id} className="group hover:bg-[#fafaf5]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#e3e3de] border border-[#1a1c19]/5">
                      <img
                        src={animal.image || ""}
                        alt={animal.name || ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-[#1a1c19] leading-tight">
                        {animal.name}
                      </p>
                      <p className="font-['Manrope'] text-xs text-[#1a1c19]/40">
                        {animal.family || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-['Manrope'] text-sm italic text-[#1a1c19]/60">
                    {animal.scientific_name}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/animals/${animal.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl hover:bg-surface-container text-[#1a1c19]/60 hover:text-primary-container transition-all"
                      title="View Public Page"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </Link>
                    <Link
                      href={`/admin/animals/${animal.id}/edit`}
                      className="p-2 rounded-xl hover:bg-surface-container text-[#1a1c19]/60 hover:text-primary-container transition-all"
                      title="Edit Species"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {animals.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <span className="material-symbols-outlined text-[48px]">inventory_2</span>
                    <p className="font-['Manrope'] font-medium">No species found in the archive.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#fafaf5] border-t border-[#1a1c19]/8 flex items-center justify-between">
            <p className="text-xs font-['Manrope'] text-[#1a1c19]/40 font-bold uppercase tracking-widest">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={getUrl({ page: page - 1 })}
                className={cn(
                  "p-2 rounded-xl border border-[#1a1c19]/10 bg-white text-[#1a1c19]/60 hover:text-primary-container transition-all",
                  page <= 1 && "pointer-events-none opacity-30"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </Link>
              <Link
                href={getUrl({ page: page + 1 })}
                className={cn(
                  "p-2 rounded-xl border border-[#1a1c19]/10 bg-white text-[#1a1c19]/60 hover:text-primary-container transition-all",
                  page >= totalPages && "pointer-events-none opacity-30"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
