export default function FavoritesLoading() {
  return (
    <div className="px-8 py-10 max-w-full mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded mb-8" />

      {/* Section Header */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-10 w-52 bg-stone-200 dark:bg-stone-800 rounded" />
        </div>
        <div className="h-4 w-full max-w-2xl bg-stone-200 dark:bg-stone-800 rounded" />
      </div>

      {/* Animal card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-outline-variant/20 bg-white dark:bg-[#232621] overflow-hidden">
            <div className="h-40 bg-stone-200 dark:bg-stone-800" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-20 bg-stone-100 dark:bg-stone-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-12">
        <div className="h-4 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
    </div>
  );
}