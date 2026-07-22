export default function LoginLoading() {
  return (
    <main className="min-h-screen bg-[#fafaf5] px-6 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center animate-pulse">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="h-3 w-24 bg-stone-200 rounded" />
            <div className="h-9 w-72 bg-stone-200 rounded" />
            <div className="h-4 w-full bg-stone-200 rounded" />
          </div>

          {/* Google button placeholder */}
          <div className="h-12 w-full bg-stone-200 rounded-lg" />

          {/* Divider */}
          <div className="pt-8 border-t border-stone-200">
            <div className="space-y-4">
              <div className="h-3 w-28 bg-stone-100 rounded" />
              <div className="h-10 w-full bg-stone-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}