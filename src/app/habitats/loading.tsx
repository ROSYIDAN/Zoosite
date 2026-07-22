import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function HabitatsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto animate-pulse">
      {/* Breadcrumb placeholder */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
        {/* Title header block */}
        <div className="p-6 bg-white/40 dark:bg-[#232621]/40 rounded-r-3xl rounded-l-lg border border-[#1a1c19]/5 dark:border-white/5 border-l-4 border-l-stone-300 dark:border-l-stone-700 backdrop-blur-sm">
          <div className="h-8 w-56 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-4 w-96 max-w-full bg-stone-200 dark:bg-stone-800 rounded mt-3" />
        </div>
      </div>

      {/* Biome cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-[#1a1c19]/8 dark:border-white/8 bg-white/60 dark:bg-[#232621]/60 overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-stone-200 dark:bg-stone-800" />
            {/* Content */}
            <div className="p-6 space-y-3">
              <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-4 w-full bg-stone-100 dark:bg-stone-700 rounded" />
              <div className="h-4 w-2/3 bg-stone-100 dark:bg-stone-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Back link placeholder */}
      <div className="pt-4">
        <div className="h-4 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
      </div>
    </DashboardLayout>
  );
}
