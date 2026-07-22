export default function RegionsLoading() {
  return (
    <div className="px-8 py-10 max-w-full mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded mb-8" />

      {/* Section Header */}
      <div className="mb-12 space-y-4">
        <div className="h-10 w-64 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-4 w-full max-w-2xl bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-4 w-3/4 max-w-2xl bg-stone-200 dark:bg-stone-800 rounded" />
      </div>

      {/* Region card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-outline-variant/20 bg-white dark:bg-[#232621] overflow-hidden">
            <div className="h-44 bg-stone-200 dark:bg-stone-800" />
            <div className="p-6 space-y-3">
              <div className="h-6 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-4 w-full bg-stone-100 dark:bg-stone-700 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 dark:bg-stone-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-8">
        <div className="h-4 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
    </div>
  );
}