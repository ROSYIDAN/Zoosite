export default function AdminAnimalsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      {/* Header: title + CTA */}
      <header className="mb-6 flex items-center justify-between">
        <div className="h-9 w-52 bg-stone-200 rounded" />
        <div className="h-12 w-44 bg-stone-200 rounded-2xl" />
      </header>

      {/* Search + sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="h-12 flex-1 max-w-md bg-white border border-stone-200 rounded-2xl" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-12 bg-stone-200 rounded" />
          <div className="h-12 w-[180px] bg-white border border-stone-200 rounded-2xl" />
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafaf5] border-b border-stone-200">
              <th className="px-6 py-4"><div className="h-3 w-14 bg-stone-200 rounded" /></th>
              <th className="px-6 py-4"><div className="h-3 w-28 bg-stone-200 rounded" /></th>
              <th className="px-6 py-4"><div className="h-3 w-12 bg-stone-200 rounded" /></th>
              <th className="px-6 py-4 text-right"><div className="h-3 w-14 bg-stone-200 rounded ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-stone-200" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 bg-stone-200 rounded" />
                      <div className="h-3 w-16 bg-stone-100 rounded" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><div className="h-3 w-36 bg-stone-100 rounded" /></td>
                <td className="px-6 py-4"><div className="h-6 w-16 bg-stone-200 rounded-full" /></td>
                <td className="px-6 py-4"><div className="h-4 w-16 bg-stone-100 rounded ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination footer */}
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