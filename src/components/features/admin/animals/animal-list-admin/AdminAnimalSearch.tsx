interface AdminAnimalSearchProps {
  search?: string;
  sort: string;
  order: string;
}

/**
 * AdminAnimalSearch - Renders the inventory search bar.
 * Preserves sort context on submit using hidden parameters.
 */
export default function AdminAnimalSearch({ search, sort, order }: AdminAnimalSearchProps) {
  return (
    <div className="mb-6 flex gap-4">
      <form className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1c19]/30">
          search
        </span>
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
  );
}
