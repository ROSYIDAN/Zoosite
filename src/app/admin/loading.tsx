export default function AdminLoading() {
  return (
    <div className="p-10 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-stone-300" />
          <div className="h-3 w-28 bg-stone-200 rounded" />
        </div>
        <div className="h-10 w-96 bg-stone-200 rounded" />
        <div className="h-5 w-[28rem] bg-stone-100 rounded" />
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-52 rounded-3xl bg-stone-100 border border-stone-200" />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 h-24 rounded-3xl bg-stone-100 border border-stone-200" />
    </div>
  );
}