export default function CreateQuizLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="h-8 w-52 bg-stone-200 rounded" />
          <div className="h-4 w-80 bg-stone-100 rounded" />
        </div>
        <div className="h-5 w-28 bg-stone-100 rounded" />
      </div>

      {/* Form skeleton — 12-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left col-span-8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Prompt section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 w-32 bg-stone-200 rounded" />
            <div className="h-24 w-full bg-stone-100 rounded-xl" />
            <div className="h-10 w-full bg-stone-100 rounded-xl" />
          </div>
          {/* Answer options section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="h-5 w-36 bg-stone-200 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-stone-200 rounded-full" />
                <div className="h-10 flex-1 bg-stone-100 rounded-xl" />
                <div className="h-8 w-8 bg-stone-100 rounded" />
              </div>
            ))}
            <div className="h-9 w-32 bg-stone-100 rounded-lg" />
          </div>
        </div>

        {/* Right col-span-4 */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Properties card */}
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
          {/* Actions card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="h-11 w-full bg-stone-200 rounded-xl" />
            <div className="h-11 w-full bg-stone-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}