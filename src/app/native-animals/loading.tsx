import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function NativeAnimalsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1440px] mx-auto animate-pulse">
        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded" />

        {/* Page header */}
        <div className="space-y-4">
          <div className="h-10 w-72 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-4 w-full max-w-xl bg-stone-200 dark:bg-stone-800 rounded" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-32 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          ))}
        </div>

        {/* Animal grid */}
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
      </div>
    </DashboardLayout>
  );
}