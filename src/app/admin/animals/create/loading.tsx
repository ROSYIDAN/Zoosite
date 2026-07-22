/** ponytail: reused by edit route via copy — extract to shared if a third consumer appears */
function FormCardSkeleton({ rows }: { rows: number }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
      <div className="h-5 w-40 bg-stone-200 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3 w-20 bg-stone-200 rounded" />
          <div className="h-10 w-full bg-stone-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default function CreateAnimalLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8 animate-pulse">
      {/* Header: back button + title */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-stone-200" />
        <div className="space-y-1.5">
          <div className="h-7 w-56 bg-stone-200 rounded" />
          <div className="h-4 w-72 bg-stone-100 rounded" />
        </div>
      </div>

      {/* Form skeleton — max-w-[1200px] 2-col grid */}
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {/* Full-width banner */}
        <div className="lg:col-span-2 h-16 bg-stone-100 rounded-2xl" />
        {/* Full-width AI autofill */}
        <div className="lg:col-span-2 h-14 bg-stone-100 rounded-2xl" />

        {/* Left column cards */}
        <div className="flex flex-col gap-8">
          <FormCardSkeleton rows={4} />
          <FormCardSkeleton rows={2} />
        </div>

        {/* Right column cards */}
        <div className="flex flex-col gap-8">
          <FormCardSkeleton rows={4} />
          <FormCardSkeleton rows={5} />
        </div>

        {/* Full-width bottom cards */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <FormCardSkeleton rows={2} />
          <FormCardSkeleton rows={1} />
          <FormCardSkeleton rows={3} />
          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <div className="h-12 w-28 bg-stone-200 rounded-2xl" />
            <div className="h-12 w-36 bg-stone-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}