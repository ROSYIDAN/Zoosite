export default function QuizLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0c0f0d] to-[#111412] text-white animate-pulse">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="h-8 w-40 bg-white/10 rounded" />
        <div className="h-8 w-24 bg-white/10 rounded" />
      </div>

      <main className="flex-grow flex flex-col items-center px-6 py-12 w-full max-w-4xl mx-auto">
        {/* Rank section */}
        <div className="mb-12 text-center space-y-4">
          <div className="h-16 w-16 bg-white/10 rounded-full mx-auto" />
          <div className="h-6 w-36 bg-white/10 rounded mx-auto" />
          <div className="h-3 w-48 bg-white/5 rounded mx-auto" />
        </div>

        {/* Level cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-white/10" />
          ))}
        </div>
      </main>
    </div>
  );
}