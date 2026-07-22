import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function RequestAnimalLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 w-full max-w-7xl mx-auto animate-pulse">
        {/* Header */}
        <div className="mb-10 text-center space-y-2">
          <div className="h-7 w-64 bg-stone-200 dark:bg-stone-800 rounded mx-auto" />
          <div className="h-3 w-80 bg-stone-100 dark:bg-stone-700 rounded mx-auto" />
        </div>

        {/* Form skeleton */}
        <div className="max-w-2xl mx-auto space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-10 w-full bg-stone-100 dark:bg-stone-700 rounded-lg" />
            </div>
          ))}
          <div className="h-12 w-full bg-stone-200 dark:bg-stone-800 rounded-lg" />
        </div>
      </div>
    </DashboardLayout>
  );
}