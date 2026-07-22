import Footer from "@/components/landing/Footer";

export default function RootLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf5]">
      {/* Mock Navbar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 mx-auto bg-[#fafaf5] font-headline tracking-tight border-b border-stone-100">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter text-stone-300">
            The Conservatory
          </div>
          <nav className="hidden md:flex gap-6">
            <span className="text-stone-300 font-medium">Exhibits</span>
            <span className="text-stone-300 font-medium">Conservation</span>
            <span className="text-stone-300 font-medium">Visit</span>
            <span className="text-stone-300 font-medium">Research</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-24 bg-stone-200 rounded-xl" />
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Skeleton */}
        <section className="relative w-full h-[56.25vw] max-h-[1080px] min-h-[600px] bg-stone-950 flex items-center overflow-hidden">
          <div className="container mx-auto px-8 relative z-10 animate-pulse">
            <div className="max-w-2xl text-left space-y-6">
              <div className="h-6 w-36 bg-stone-800 rounded-full" />
              <div className="h-16 w-96 md:w-[32rem] bg-stone-800 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-4 w-80 md:w-[28rem] bg-stone-800 rounded" />
                <div className="h-4 w-72 md:w-[24rem] bg-stone-800 rounded" />
              </div>
              <div className="flex gap-4">
                <div className="h-14 w-48 bg-stone-800 rounded-xl" />
                <div className="h-14 w-14 bg-stone-800 rounded-full" />
                <div className="h-14 w-14 bg-stone-800 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Teaser Skeleton */}
        <section className="py-24 bg-[#fafaf5] animate-pulse">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="h-4 w-28 bg-stone-200 rounded-full mx-auto" />
              <div className="h-12 w-80 md:w-[32rem] bg-stone-200 rounded-2xl mx-auto" />
              <div className="space-y-3">
                <div className="h-4 w-full md:w-[40rem] bg-stone-200 rounded mx-auto" />
                <div className="h-4 w-[90%] md:w-[36rem] bg-stone-200 rounded mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="py-20 bg-stone-900 animate-pulse">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="h-12 w-24 bg-stone-800 rounded mx-auto" />
                  <div className="h-4 w-32 bg-stone-800 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Skeleton */}
        <section className="py-24 bg-stone-100 animate-pulse">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="h-12 w-72 bg-stone-200 rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-4 w-full md:w-[28rem] bg-stone-200 rounded" />
                  <div className="h-4 w-[90%] md:w-[24rem] bg-stone-200 rounded" />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-4">
                    <div className="h-6 w-6 bg-stone-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-stone-200 rounded" />
                      <div className="h-3 w-48 bg-stone-200 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-6 w-6 bg-stone-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-stone-200 rounded" />
                      <div className="h-3 w-48 bg-stone-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl w-full h-64 bg-stone-200" />
                  <div className="rounded-2xl w-full h-48 bg-stone-200" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl w-full h-48 bg-stone-200" />
                  <div className="rounded-2xl w-full h-64 bg-stone-200" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}