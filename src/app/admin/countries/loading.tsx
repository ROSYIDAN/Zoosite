export default function AdminCountriesLoading() {
  return (
    <div className="p-10 max-w-7xl mx-auto flex flex-col gap-10 animate-pulse">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-stone-200" />
            <div className="h-3 w-32 bg-stone-200 rounded" />
          </div>
          <div className="h-10 w-72 bg-stone-200 rounded" />
          <div className="h-4 w-96 bg-stone-100 rounded" />
        </div>
        <div className="h-12 w-44 bg-stone-200 rounded-2xl" />
      </header>

      {/* Stats (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
            <div className="h-3 w-24 bg-stone-200 rounded" />
            <div className="h-8 w-16 bg-stone-200 rounded" />
          </div>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="h-12 flex-1 max-w-md bg-white border border-stone-200 rounded-2xl" />
        <div className="h-12 w-48 bg-white border border-stone-200 rounded-2xl" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafaf5] border-b border-stone-200">
              {["w-8", "w-24", "w-20", "w-16", "w-14"].map((w, i) => (
                <th key={i} className="px-6 py-4"><div className={`h-3 ${w} bg-stone-200 rounded`} /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4"><div className="h-6 w-6 bg-stone-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-32 bg-stone-200 rounded" /></td>
                <td className="px-6 py-4"><div className="h-4 w-20 bg-stone-100 rounded" /></td>
                <td className="px-6 py-4"><div className="h-6 w-16 bg-stone-100 rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-4 w-12 bg-stone-100 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <div className="h-4 w-32 bg-stone-100 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-9 bg-stone-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}