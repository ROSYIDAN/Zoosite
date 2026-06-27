import Link from "next/link";
import ImageWithSkeleton from "@/components/loading/ImageWithSkeleton";
import { cn } from "@/lib/utils";

/**
 * EcosystemGrid component displaying the Biome Explorer sections.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function EcosystemGrid() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
        Biome Explorer
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
        <HabitatLink
          href="/habitats?biome=forests"
          title="Forests"
          imageSrc="/biomes/forests.webp"
        />

        <HabitatLink
          href="/habitats?biome=grasslands"
          title="Grasslands"
          imageSrc="/biomes/grasslands.webp"
        />

        <HabitatLink
          href="/habitats?biome=wetlands"
          title="Wetlands"
          imageSrc="/biomes/wetlands.webp"
        />

        <HabitatLink
          href="/habitats?biome=waters"
          title="Waters"
          imageSrc="/biomes/waters.webp"
        />

        <HabitatLink
          href="/habitats?biome=deserts-drylands"
          title="Deserts & Drylands"
          imageSrc="/biomes/deserts-drylands.webp"
        />

        <HabitatLink
          href="/habitats?biome=polar-tundra"
          title="Polar & Tundra"
          imageSrc="/biomes/polar-tundra.webp"
        />

        <HabitatLink
          href="/habitats?biome=mountains-highlands"
          title="Mountains & Highlands"
          imageSrc="/biomes/mountains-highlands.webp"
        />
      </div>
    </section>
  );
}

interface HabitatLinkProps {
  href: string;
  title: string;
  imageSrc: string;
}

/**
 * Sub-component for individual habitat links.
 * DRY principle: extracted repeating JSX.
 */
function HabitatLink({ href, title, imageSrc }: HabitatLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative h-40 rounded-[1.5rem] overflow-hidden group cursor-pointer block border border-outline-variant/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]"
      )}
    >
      <ImageWithSkeleton
        alt={`${title} Biome`}
        src={imageSrc}
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        containerClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-4">
        <p className="text-white font-bold text-sm md:text-base font-headline leading-tight">{title}</p>
      </div>
    </Link>
  );
}
