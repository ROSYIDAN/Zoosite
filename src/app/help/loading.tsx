import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

export default function HelpLoading() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 p-6 md:p-10 animate-pulse">
        {/* Header */}
        <div className="space-y-3 text-center md:text-left">
          <div className="h-9 w-64 bg-stone-200 dark:bg-stone-800 rounded mx-auto md:mx-0" />
          <div className="h-4 w-full max-w-2xl bg-stone-200 dark:bg-stone-800 rounded" />
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ accordion placeholder */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-stone-200 dark:bg-stone-800" />
            ))}
          </div>
          {/* Contact form placeholder */}
          <div className="space-y-4 rounded-2xl bg-white dark:bg-[#232621] p-6 border border-outline-variant/10">
            <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-10 w-full bg-stone-100 dark:bg-stone-700 rounded" />
            <div className="h-10 w-full bg-stone-100 dark:bg-stone-700 rounded" />
            <div className="h-24 w-full bg-stone-100 dark:bg-stone-700 rounded" />
            <div className="h-10 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}