import Link from "next/link";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";

/**
 * FeaturedBanner component highlighting a specific animal.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function FeaturedBanner() {
  return (
    <section
      className={cn(
        "relative bg-primary-container rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl items-stretch"
      )}
    >
      <div className="w-full md:w-5/12 min-h-[300px] relative">
        <ImageWithSkeleton
          alt="Majestic Lion"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaLGcM7oLSrPR1PKiqWFu_VDh-kyo3PuGEa9gik2XgnoKOoc_fnS9EDIBIc83QicJkm4y3Bxgy62OSyBijq-kfIrNvl5maBGp9BumihE05ick-yl3Zs9ziE5i2AH-mFbnf9rLkOMNhRLxyTq8QSPeR8tF9_OREssPlyCvaP3288Xtc_UXqfNM8GIL-7-AQ13gDoQbgtnxdRIPGp_FJSaxmqLtnijyzWRlFCKKY5jB7h_UY0MJ-QCwO65UEVvv9pXX7lNCVdEq6MU9i"
          priority={true}
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0"
        />
      </div>
      <div className="p-8 md:p-12 flex-1 flex flex-col justify-center text-white space-y-6 z-10">
        <div className="inline-flex px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase self-start">
          Species of the Week
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-extrabold tracking-tighter font-headline">
            The African Lion
          </h2>
          <p className="text-on-primary-container/80 text-lg max-w-md leading-relaxed">
            The majestic &apos;King of the Jungle&apos; is a symbol of strength
            and courage. Known for its impressive roar and cooperative pride
            structure.
          </p>
        </div>
        <div>
          <button className="bg-surface-bright text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            View Details
          </button>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <span className="px-3 py-1 bg-tertiary text-white rounded-full text-[10px] font-bold tracking-wider uppercase">
          Vulnerable
        </span>
      </div>
    </section>
  );
}
