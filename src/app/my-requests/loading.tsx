import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function MyRequestsLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 max-w-screen-2xl w-full mx-auto animate-pulse">
        {/* Header row: title + button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="h-6 w-52 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-3 w-72 bg-stone-100 dark:bg-stone-800/60 rounded" />
          </div>
          <div className="h-10 w-32 bg-stone-200 dark:bg-stone-800 rounded-xl" />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-200 dark:border-stone-700 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          ))}
        </div>

        {/* 2-column request card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 space-y-4">
              {/* Top: name + badge */}
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="h-5 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-3 w-24 bg-stone-100 dark:bg-stone-800/60 rounded" />
                </div>
                <div className="h-6 w-20 bg-stone-200 dark:bg-stone-800 rounded-full" />
              </div>
              {/* Middle: image + info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-stone-100 dark:bg-stone-800/60 rounded" />
                  <div className="h-4 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-3 w-32 bg-stone-100 dark:bg-stone-800/60 rounded" />
                </div>
              </div>
              {/* Bottom action bar */}
              <div className="border-t border-stone-100 dark:border-stone-700 pt-4 flex justify-end">
                <div className="h-8 w-24 bg-stone-200 dark:bg-stone-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}