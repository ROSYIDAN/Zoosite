export default function AdminQuizLoading() {
  return (
    <div className="p-6 flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-8 w-44 bg-stone-200 rounded" />
          <div className="h-4 w-72 bg-stone-100 rounded" />
        </div>
        <div className="h-10 w-48 bg-stone-200 rounded-xl" />
      </div>

      {/* Table card */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {/* Filter bar */}
        <div className="px-4 py-3 border-b border-stone-200 bg-[#f4f4ef] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 bg-white border border-stone-200 rounded-lg" />
            <div className="h-8 w-28 bg-white border border-stone-200 rounded-lg" />
          </div>
          <div className="h-3 w-16 bg-stone-200 rounded" />
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              {["w-[35%]", "", "", "", "", ""].map((w, i) => (
                <th key={i} className={`py-3 px-5 ${w}`}>
                  <div className="h-3 w-20 bg-stone-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-5"><div className="h-4 w-52 bg-stone-100 rounded" /></td>
                <td className="py-3 px-5"><div className="h-6 w-14 bg-stone-200 rounded-full" /></td>
                <td className="py-3 px-5"><div className="h-6 w-24 bg-stone-100 rounded-full" /></td>
                <td className="py-3 px-5"><div className="h-4 w-20 bg-stone-100 rounded" /></td>
                <td className="py-3 px-5 text-right"><div className="h-4 w-6 bg-stone-100 rounded ml-auto" /></td>
                <td className="py-3 px-5 text-right"><div className="h-4 w-10 bg-stone-100 rounded ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-stone-200 flex items-center justify-between">
          <div className="h-4 w-32 bg-stone-100 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-stone-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}