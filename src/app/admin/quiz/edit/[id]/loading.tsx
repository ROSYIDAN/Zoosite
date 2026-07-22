export default function EditQuizLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 animate-pulse">
      {/* Header — breadcrumb + title + subtitle */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 bg-stone-200 rounded" />
          <div className="h-3 w-3 bg-stone-200 rounded" />
          <div className="h-3 w-20 bg-stone-200 rounded" />
        </div>
        <div className="h-8 w-44 bg-stone-200 rounded" />
        <div className="h-4 w-64 bg-stone-100 rounded" />
      </div>

      {/* Form skeleton — same 12-col grid as create */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 w-32 bg-stone-200 rounded" />
            <div className="h-24 w-full bg-stone-100 rounded-xl" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 w-36 bg-stone-200 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-stone-200 rounded-full" />
                <div className="h-10 flex-1 bg-stone-100 rounded-xl" />
                <div className="h-8 w-8 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 w-28 bg-stone-200 rounded" />
            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-stone-200 rounded" />
              <div className="h-10 w-full bg-stone-100 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-stone-200 rounded" />
              <div className="h-10 w-full bg-stone-100 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="h-11 w-full bg-stone-200 rounded-xl" />
            <div className="h-11 w-full bg-stone-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}