import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminAnimalPaginationProps {
  page: number;
  totalPages: number;
  search?: string;
  sort: string;
  order: string;
}

/**
 * AdminAnimalPagination - Renders the lower paginated action buttons for navigation.
 */
export default function AdminAnimalPagination({
  page,
  totalPages,
  search,
  sort,
  order,
}: AdminAnimalPaginationProps) {
  if (totalPages <= 1) return null;

  // Helper to build URL with kept search params
  const getUrl = (nextPage: number) => {
    const nextParams = new URLSearchParams();
    if (search) nextParams.set("search", search);
    nextParams.set("sort", sort);
    nextParams.set("order", order);
    nextParams.set("page", nextPage.toString());

    return `/admin/animals?${nextParams.toString()}`;
  };

  return (
    <div className="px-6 py-4 bg-[#fafaf5] border-t border-[#1a1c19]/8 flex items-center justify-between">
      <p className="text-xs font-['Manrope'] text-[#1a1c19]/40 font-bold uppercase tracking-widest">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={getUrl(page - 1)}
          className={cn(
            "p-2 rounded-xl border border-[#1a1c19]/10 bg-white text-[#1a1c19]/60 hover:text-primary-container transition-all",
            page <= 1 && "pointer-events-none opacity-30"
          )}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </Link>
        <Link
          href={getUrl(page + 1)}
          className={cn(
            "p-2 rounded-xl border border-[#1a1c19]/10 bg-white text-[#1a1c19]/60 hover:text-primary-container transition-all",
            page >= totalPages && "pointer-events-none opacity-30"
          )}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </Link>
      </div>
    </div>
  );
}
