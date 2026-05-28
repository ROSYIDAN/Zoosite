import Link from "next/link";
import VisibilityToggle from "./VisibilityToggle";

interface AdminAnimalTableProps {
  animals: any[];
  search?: string;
  sort: string;
  order: string;
  page: number;
}

/**
 * AdminAnimalTable - Renders the species list table with dynamic sorting and status toggles.
 */
export default function AdminAnimalTable({
  animals,
  search,
  sort,
  order,
  page,
}: AdminAnimalTableProps) {
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
          <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40">
            Status
          </th>
          <th className="px-6 py-4 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40 text-right">
            Actions
          </th>
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
            <td className="px-6 py-4">
              <VisibilityToggle
                animalId={animal.id}
                initialVisible={animal.is_visible}
                animalName={animal.name || ""}
              />
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
            <td colSpan={4} className="px-6 py-20 text-center">
              <div className="flex flex-col items-center gap-4 opacity-30">
                <span className="material-symbols-outlined text-[48px]">inventory_2</span>
                <p className="font-['Manrope'] font-medium">No species found in the archive.</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
