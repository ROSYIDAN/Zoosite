import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function ProfileLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-12 max-w-screen-2xl w-full mx-auto animate-pulse">
        {/* Avatar + name header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="h-20 w-20 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-3">
            <div className="h-7 w-48 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-4 w-32 bg-stone-100 dark:bg-stone-700 rounded" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-stone-100 dark:bg-stone-700" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}