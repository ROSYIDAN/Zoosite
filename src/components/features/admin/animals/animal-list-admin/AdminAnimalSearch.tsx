"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface AdminAnimalSearchProps {
  search?: string;
  sort: string;
  order: string;
}

/**
 * AdminAnimalSearch - Renders the inventory search bar and sort filter dropdown.
 */
export default function AdminAnimalSearch({ search, sort, order }: AdminAnimalSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSort, newOrder] = e.target.value.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("order", newOrder);
    params.set("page", "1"); // Reset pagination to first page
    router.push(`/admin/animals?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset pagination to first page
    router.push(`/admin/animals?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1c19]/30">
          search
        </span>
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name or scientific name..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#1a1c19]/8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] transition-all font-['Manrope'] text-sm text-[#1a1c19]"
        />
      </form>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <label htmlFor="admin-sort-select" className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-widest text-[#1a1c19]/40">
          Sort By
        </label>
        <div className="relative">
          <select
            id="admin-sort-select"
            value={`${sort}:${order}`}
            onChange={handleSortChange}
            className="appearance-none pl-4 pr-10 py-3 bg-white border border-[#1a1c19]/8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/20 focus:border-[#2d5a27] hover:border-[#2d5a27]/40 transition-all font-['Manrope'] text-sm text-[#1a1c19]/80 cursor-pointer min-w-[180px]"
          >
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="scientific_name:asc">Scientific Name (A-Z)</option>
            <option value="scientific_name:desc">Scientific Name (Z-A)</option>
            <option value="created_at:desc">Newest Added</option>
            <option value="is_visible:asc">Unpublished First</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1c19]/40 pointer-events-none text-[18px]">
            unfold_more
          </span>
        </div>
      </div>
    </div>
  );
}
