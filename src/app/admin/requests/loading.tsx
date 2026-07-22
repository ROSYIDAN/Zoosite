export default function AdminRequestsLoading() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8 space-y-1.5">
        <div className="h-6 w-56 bg-stone-200 rounded" />
        <div className="h-3 w-96 bg-stone-100 rounded" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-200 pb-4">
        {[20, 18, 20, 22].map((w, i) => (
          <div key={i} className={`h-9 rounded-xl border border-stone-200 bg-white`} style={{ width: `${w * 4}px` }} />
        ))}
      </div>

      {/* Request cards */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-stone-200 rounded-full" />
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-stone-200 rounded" />
                  <div className="h-3 w-36 bg-stone-100 rounded" />
                </div>
              </div>
              <div className="h-6 w-20 bg-stone-200 rounded-full" />
            </div>
            <div className="flex gap-4">
              <div className="h-24 w-24 bg-stone-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-stone-200 rounded" />
                <div className="h-3 w-28 bg-stone-100 rounded" />
                <div className="h-3 w-full bg-stone-100 rounded" />
                <div className="h-3 w-3/4 bg-stone-100 rounded" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="h-9 w-24 bg-stone-100 rounded-xl" />
              <div className="h-9 w-24 bg-stone-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}