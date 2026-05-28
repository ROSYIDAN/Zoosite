import Link from "next/link";
import { headers } from "next/headers";
import NavigationBreadcrumbs from "@/components/breadcrumbs/NavigationBreadcrumbs";
import RegionCardGrid from "@/components/grid/RegionCardGrid";

async function getRegions() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/dashboard/browse/region`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch regions');
  }
  const json = await res.json();
  console.log("✅ Data was done being fetched on browse region!");
  return json.data || [];
}

export default async function RegionsPage() {
  const regions = await getRegions();

  return (
    <div className="px-8 py-10 max-w-full mx-auto">
      <NavigationBreadcrumbs currentPageLabel="Regions" className="mb-8" />
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-extrabold tracking-tighter text-primary mb-4">Browse Regions</h2>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-body">
          Explore our global registry of biological habitats. Each region represents a unique ecosystem with localized flora and fauna documented by our field agents.
        </p>
      </div>

      <RegionCardGrid regions={regions} />

      <div className="mt-8">
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
