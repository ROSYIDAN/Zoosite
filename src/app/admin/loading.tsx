export default function AdminLoading() {
  return (
    <div className="p-10 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[1px] w-12 bg-stone-300" />
          <div className="h-3 w-28 bg-stone-200 rounded" />
        </div>
        <div className="h-10 w-96 bg-stone-200 rounded" />
        <div className="mt-4 h-5 w-[28rem] bg-stone-100 rounded" />
      </header>

      {/* Cards grid — 4 solid + 1 dashed placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-stone-200 bg-white p-8 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-stone-200" />
            <div className="h-5 w-36 bg-stone-200 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-stone-100 rounded" />
              <div className="h-3 w-3/4 bg-stone-100 rounded" />
            </div>
            <div className="mt-4 h-4 w-24 bg-stone-100 rounded" />
          </div>
        ))}
        {/* Coming soon placeholder */}
        <div className="rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-stone-100" />
          <div className="h-5 w-28 bg-stone-100 rounded" />
          <div className="h-3 w-48 bg-stone-50 rounded" />
        </div>
      </div>

      {/* Footer — 3-col stats */}
      <footer className="mt-16 rounded-3xl bg-stone-50 border border-stone-200 p-8">
        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 w-20 bg-stone-200 rounded" />
              <div className="h-4 w-36 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}