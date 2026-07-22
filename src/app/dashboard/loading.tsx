export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* HeroSearch */}
      <div className="rounded-3xl bg-stone-200 dark:bg-stone-800 h-48" />

      {/* QuickActions */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 w-36 shrink-0 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        ))}
      </div>

      {/* FeaturedBanner */}
      <div className="rounded-3xl bg-stone-200 dark:bg-stone-800 h-56" />

      {/* QuizNav */}
      <div className="h-24 rounded-2xl bg-stone-100 dark:bg-stone-700" />

      {/* EcosystemGrid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        ))}
      </div>

      {/* NativeAnimalsWidget */}
      <div className="h-64 rounded-3xl bg-stone-100 dark:bg-stone-700" />

      {/* NewAnimals */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 w-48 shrink-0 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      </div>

      {/* TrendingAnimals */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 w-48 shrink-0 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      </div>

      {/* StatsBar */}
      <div className="flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 h-20 rounded-2xl bg-stone-100 dark:bg-stone-700" />
        ))}
      </div>
    </div>
  );
}