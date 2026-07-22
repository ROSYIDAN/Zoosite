import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function AboutLoading() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 animate-pulse">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-10 w-72 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-4 w-4/5 bg-stone-200 dark:bg-stone-800 rounded" />
        </div>

        {/* Mission card */}
        <div className="bg-white dark:bg-[#232621] rounded-3xl p-8 border border-outline-variant/10 space-y-4">
          <div className="h-6 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-stone-100 dark:bg-stone-700 rounded" />
            <div className="h-4 w-full bg-stone-100 dark:bg-stone-700 rounded" />
            <div className="h-4 w-3/4 bg-stone-100 dark:bg-stone-700 rounded" />
          </div>
        </div>

        {/* Attributions */}
        <div className="space-y-6">
          <div className="h-6 w-56 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="p-6 bg-[#fafaf5] dark:bg-[#232621] rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-stone-200 dark:bg-stone-800 rounded" />
                  <div className="h-5 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
                </div>
                <div className="h-4 w-full bg-stone-100 dark:bg-stone-700 rounded" />
                <div className="h-4 w-2/3 bg-stone-100 dark:bg-stone-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-outline-variant/20">
          <div className="h-3 w-64 bg-stone-100 dark:bg-stone-700 rounded mx-auto" />
        </div>
      </div>
    </DashboardLayout>
  );
}